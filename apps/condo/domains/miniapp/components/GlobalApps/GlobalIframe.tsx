import React, { useCallback, useEffect } from 'react'
import { notification } from 'antd'
import isFunction from 'lodash/isFunction'
import { extractOrigin } from '@condo/domains/common/utils/url.utils'
import {
    NOTIFICATION_MESSAGE_TYPE,
    parseMessage,
} from '@condo/domains/common/utils/iframe.utils'

type IGlobalIframeProps = {
    pageUrl: string
    hidden?: boolean
}

const GlobalIframe = React.forwardRef<HTMLIFrameElement, IGlobalIframeProps>((props, ref) => {
    const { pageUrl, hidden } = props
    const shouldHideIframe = hidden === undefined ? true : hidden
    const pageOrigin = extractOrigin(pageUrl)

    // TODO(DOMA-3435, @savelevMatthew) Refactor message structure after moving to lib
    const handleNotification = useCallback((message) => {
        if (notification.hasOwnProperty(message.notificationType) && isFunction(notification[message.notificationType])) {
            notification[message.notificationType]({ message: message.message })
        }
    }, [])

    const handleMessage = useCallback((event: MessageEvent) => {
        if (event.origin !== pageOrigin) return
        if (!event.data || typeof event.data !== 'object') return
        const parsedMessage = parseMessage(event.data)
        if (!parsedMessage) return
        const { type, message } = parsedMessage
        if (type === 'system') {
            switch (message.type) {
                case NOTIFICATION_MESSAGE_TYPE:
                    return handleNotification(message)
            }
        }
        
    }, [pageOrigin, handleNotification])

    useEffect(() => {
        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [handleMessage])

    return (
        <iframe
            ref={ref}
            src={pageUrl}
            hidden={shouldHideIframe}
            frameBorder={0}
            scrolling={'no'}
        />
    )
})

GlobalIframe.displayName = 'GlobalIFrame'

export default GlobalIframe