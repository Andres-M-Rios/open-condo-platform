import { IntlProvider, useIntl } from 'react-intl'
import React, { useEffect, useState } from 'react'
import cookie from 'js-cookie'

import { extractReqLocale } from '@condo/domains/common/utils/locales'
import { preventInfinityLoop, getContextIndependentWrappedInitialProps } from './_utils'

const LocaleContext = React.createContext({})

// TODO(pahaz): probably it's better to get it from next config!
let defaultLocale = 'en'

let messagesImporter = (locale) => {
    throw new Error('You should define your own "messagesImporter(locale)" function. ' +
        'Like so: "withIntl({ ..., messagesImporter: (locale) => import(`../lang/${locale}`) })(...)"')
}

let getMessages = async (locale) => {
    try {
        const module = await messagesImporter(locale)
        return module.default || module
    } catch (error) {
        console.error('getMessages error:', error)
        const module = await import('./lang/en.json')
        return module.default
    }
}

let getLocale = () => {
    let locale = null
    if (typeof window !== 'undefined') {
        try {
            locale = cookie.get('locale')
            if (!locale && navigator) {
                locale = navigator.language.slice(0, 2)
            }
        } catch (e) {
            locale = null
        }
    }
    return locale || defaultLocale
}


const initOnRestore = async (ctx) => {
    let locale, messages
    const isOnServerSide = typeof window === 'undefined'
    if (isOnServerSide) {
        const inAppContext = Boolean(ctx.ctx)
        const req = (inAppContext) ? ctx.ctx.req : ctx.req
        locale = extractReqLocale(req)
        messages = await getMessages(locale)
    } else {
        locale = getLocale()
        messages = await getMessages(locale)
    }
    return { locale, messages }
}

const Intl = ({ children, initialLocale, initialMessages, onError }) => {
    const [locale, setLocale] = useState(initialLocale)
    const [messages, setMessages] = useState(initialMessages)
    useEffect(() => {
        getMessages(locale).then(importedMessages => {
            if (JSON.stringify(messages) === JSON.stringify(importedMessages)) return
            setMessages(importedMessages)
            cookie.set('locale', locale, { expires: 365 })
        })
    }, [locale])

    return (
        <IntlProvider key={locale} locale={locale} messages={messages} onError={onError}>
            <LocaleContext.Provider value={{ locale, setLocale }}>
                {children}
            </LocaleContext.Provider>
        </IntlProvider>
    )
}

const withIntl = ({ ssr = false, ...opts } = {}) => PageComponent => {
    defaultLocale = opts.defaultLocale ? opts.defaultLocale : 'en'
    // TODO(pahaz): refactor it. No need to patch globals here!
    messagesImporter = opts.messagesImporter ? opts.messagesImporter : messagesImporter
    getMessages = opts.getMessages ? opts.getMessages : getMessages
    getLocale = opts.getLocale ? opts.getLocale : getLocale
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onIntlError = opts.hideErrors ? (() => {}) : undefined

    const WithIntl = ({ locale, messages, ...pageProps }) => {
        // in there is no locale and no messages => client side rerender (we should use some client side cache)
        if (!locale) locale = getLocale()
        if (!messages) messages = {}
        return (
            <Intl initialLocale={locale} initialMessages={messages} onError={onIntlError}>
                <PageComponent {...pageProps} />
            </Intl>
        )
    }


    // Set the correct displayName in development
    if (process.env.NODE_ENV !== 'production') {
        const displayName = PageComponent.displayName || PageComponent.name || 'Component'
        WithIntl.displayName = `withIntl(${displayName})`
    }

    if (ssr || PageComponent.getInitialProps) {
        WithIntl.getInitialProps = async ctx => {
            const isOnServerSide = typeof window === 'undefined'
            const { locale, messages } = await initOnRestore(ctx)
            const pageProps = await getContextIndependentWrappedInitialProps(PageComponent, ctx)

            if (isOnServerSide) {
                preventInfinityLoop(ctx)
            }

            return {
                ...pageProps,
                locale,
                messages,
            }
        }
    }

    return WithIntl
}

export {
    withIntl,
    useIntl,
}
