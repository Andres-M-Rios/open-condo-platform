const { identity, get } = require('lodash')
const { v4 } = require('uuid')
const express = require('express')
const bodyParser = require('body-parser')
const nextCookie = require('next-cookies')

const { Keystone } = require('@keystonejs/keystone')
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const { AdminUIApp } = require('@keystonejs/app-admin-ui')
const { NextApp } = require('@keystonejs/app-next')
const { createItems } = require('@keystonejs/server-side-graphql-client')

const conf = require('@core/config')
const { registerTriggers } = require('@core/triggers')
const { registerTasks } = require('@core/keystone/tasks')
const { prepareDefaultKeystoneConfig, getAdapter } = require('@core/keystone/setup.utils')
const { registerSchemas } = require('@core/keystone/KSv5v6/v5/registerSchema')
const { schemaDocPreprocessor } = require('@core/keystone/preprocessors/schemaDoc')

const { makeId } = require('@condo/domains/common/utils/makeid.utils')
const { formatError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { hasValidJsonStructure } = require('@condo/domains/common/utils/validation.utils')
const { SbbolRoutes } = require('@condo/domains/organization/integrations/sbbol/routes')
const FileAdapter = require('@condo/domains/common/utils/fileAdapter')
const { expressErrorHandler } = require('@condo/domains/common/utils/expressErrorHandler')
const { OIDCMiddleware } = require('@condo/domains/user/oidc')


const IS_ENABLE_DD_TRACE = conf.NODE_ENV === 'production'
const IS_ENABLE_APOLLO_DEBUG = conf.NODE_ENV === 'development' || conf.NODE_ENV === 'test'

let IS_BUILD_PHASE = conf.PHASE === 'build'
if (IS_BUILD_PHASE) {
    process.env.FILE_FIELD_ADAPTER = 'local' // Test
}
// TODO(DOMA-1614): if set to true adminUi will failed to load after build + start is launched
IS_BUILD_PHASE = false

// NOTE: should be disabled in production: https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/
// WARN: https://github.com/graphql/graphql-playground/tree/main/packages/graphql-playground-html/examples/xss-attack
const IS_ENABLE_DANGEROUS_GRAPHQL_PLAYGROUND = conf.ENABLE_DANGEROUS_GRAPHQL_PLAYGROUND === 'true'

if (IS_ENABLE_DD_TRACE) {
    require('dd-trace').init({
        logInjection: true,
    })
}

const keystoneConfig = (IS_BUILD_PHASE) ? { cookieSecret: v4(), adapter: getAdapter('undefined') } : prepareDefaultKeystoneConfig(conf)
const keystone = new Keystone({
    ...keystoneConfig,
    onConnect: async () => {
        // Initialise some data
        if (conf.NODE_ENV !== 'development' && conf.NODE_ENV !== 'test') return // Just for dev env purposes!
        // This function can be called before tables are created! (we just ignore this)
        const users = await keystone.lists.User.adapter.findAll()
        if (!users.length) {
            const initialData = require('./initialData')
            for (let { listKey, items } of initialData) {
                console.log(`🗿 createItems(${listKey}) -> ${items.length}`)
                await createItems({
                    keystone,
                    listKey,
                    items,
                })
            }
        }
    },
})

const originalCreateList = keystone.createList

/**
 * example:
 * {
 *      <requestId> : {
 *          <requestKey>
 *      }
 * }
 * @type {{}}
 */
const cache = {}

const generateRequestKey = (gqlName, args) => (
    `${gqlName}-${JSON.stringify(args)}`
)

const getRequestIdFromContext = (context) => {
    return get(context, ['req', 'headers', 'x-request-id'], null)
}

keystone.createList = async (...args) => {
    const list = originalCreateList.apply(keystone, args)

    // Ensure that if there is a mutation -- we delete cache item!
    const originalCreateMutation = list.createMutation
    list.createMutation = async ( data, context, mutationState ) => {
        const requestId = getRequestIdFromContext(context)
        if (requestId) { delete cache[requestId] }
        return await originalCreateMutation.call( list, data, context, mutationState )
    }

    const originalCreateManyMutation = list.createManyMutation
    list.createManyMutation = async ( data, context, mutationState ) => {
        const requestId = getRequestIdFromContext(context)
        if (requestId) { delete cache[requestId] }
        return await originalCreateManyMutation.call( list, data, context, mutationState )
    }

    const originalUpdateMutation = list.updateMutation
    list.updateMutation = async ( data, context, mutationState ) => {
        const requestId = getRequestIdFromContext(context)
        if (requestId) { delete cache[requestId] }
        return await originalUpdateMutation.call( list, data, context, mutationState )
    }

    const originalUpdateManyMutation = list.updateManyMutation
    list.updateManyMutation = async ( data, context, mutationState ) => {
        const requestId = getRequestIdFromContext(context)
        if (requestId) { delete cache[requestId] }
        return await originalUpdateManyMutation.call( list, data, context, mutationState )
    }

    const originalDeleteMutation = list.deleteMutation
    list.deleteMutation = async ( data, context, mutationState ) => {
        const requestId = getRequestIdFromContext(context)
        if (requestId) { delete cache[requestId] }
        return await originalDeleteMutation.call( list, data, context, mutationState )
    }

    const originalListQuery = list.listQuery
    list.listQuery = async function (args, context, gqlName, info, from) {

        let key = null
        const requestId = getRequestIdFromContext(context)

        if (requestId) {
            key = generateRequestKey(gqlName, args)

            if (!(requestId in cache)) {
                cache[requestId] = {}
            }

            if (key in cache[requestId]) {
                console.debug(`
                LIST_QUERY ${gqlName}\r\n
                KEY: ${key}\r\n
                CACHE_HIT: Yes`
                )
                return cache[requestId][key]
            }
        }

        console.debug(`
            LIST_QUERY ${gqlName}\r\n
            KEY: ${key}\r\n
            CACHE_HIT: No`
        )

        const listResult = await originalListQuery.call(list, args, context, gqlName, info, from)

        if (requestId && key) { cache[requestId][key] = listResult }

        return listResult
    }

    const originalItemQuery = list.itemQuery
    list.itemQuery = async (args, context, gqlName, info, from) => {

        let key = null
        const requestId = getRequestIdFromContext(context)

        if (requestId) {
            key = generateRequestKey(gqlName, args)

            if (!(requestId in cache)) {
                cache[requestId] = {}
            }

            if (key in cache[requestId]) {
                console.debug(`
                LIST_QUERY ${gqlName}\r\n
                KEY: ${key}\r\n
                CACHE_HIT: Yes`
                )
                return cache[requestId][key]
            }
        }

        console.debug(`
            LIST_QUERY ${gqlName}\r\n
            KEY: ${key}\r\n
            CACHE_HIT: No`
        )

        const itemQuery = await originalItemQuery.call(list, args, context, gqlName, info, from)

        if (requestId && key) { cache[requestId][key] = itemQuery }

        return itemQuery
    }

    return list
}

if (!IS_BUILD_PHASE) {
    registerSchemas(keystone, [
        require('@condo/domains/user/schema'),
        require('@condo/domains/organization/schema'),
        require('@condo/domains/property/schema'),
        require('@condo/domains/billing/schema'),
        require('@condo/domains/ticket/schema'),
        require('@condo/domains/notification/schema'),
        require('@condo/domains/contact/schema'),
        require('@condo/domains/resident/schema'),
        require('@condo/domains/onboarding/schema'),
        require('@condo/domains/division/schema'),
        require('@condo/domains/meter/schema'),
        require('@condo/domains/subscription/schema'),
        require('@condo/domains/acquiring/schema'),
        require('@condo/domains/miniapp/schema'),
    ], [schemaDocPreprocessor])

    registerTasks([
        require('@condo/domains/notification/tasks'),
        require('@condo/domains/organization/tasks'),
        require('@condo/domains/ticket/tasks'),
        require('@condo/domains/resident/tasks'),
    ])

    registerTriggers([
        require('@condo/domains/ticket/triggers'),
    ])
}

let authStrategy
if (!IS_BUILD_PHASE) {
    authStrategy = keystone.createAuthStrategy({
        type: PasswordAuthStrategy,
        list: 'User',
        config: {
            protectIdentities: false,
        },
    })
}

class SberBuisnessOnlineMiddleware {
    async prepareMiddleware () {
        const Auth = new SbbolRoutes()
        const app = express()
        // TODO(zuch): find a way to remove bind
        app.get('/api/sbbol/auth', Auth.startAuth.bind(Auth))
        app.get('/api/sbbol/auth/callback', Auth.completeAuth.bind(Auth))
        app.use(expressErrorHandler)
        return app
    }
}

class KeystoneCacheMiddleware {
    prepareMiddleware ({ keystone, dev, distDir }) {
        const app = express()

    }
}

/**
 * We need a custom body parser for custom file upload limit
 */
class CustomBodyParserMiddleware {
    prepareMiddleware ({ keystone, dev, distDir }) {
        const app = express()
        app.use(bodyParser.json({ limit: '100mb', extended: true }))
        app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
        return app
    }
}

module.exports = {
    keystone,
    apps: [
        new OIDCMiddleware(),
        new CustomBodyParserMiddleware(),
        new GraphQLApp({
            apollo: {
                formatError,
                debug: IS_ENABLE_APOLLO_DEBUG,
                introspection: IS_ENABLE_DANGEROUS_GRAPHQL_PLAYGROUND,
                playground: IS_ENABLE_DANGEROUS_GRAPHQL_PLAYGROUND,
            },
        }),
        FileAdapter.makeFileAdapterMiddleware(),
        new SberBuisnessOnlineMiddleware(),
        new AdminUIApp({
            adminPath: '/admin',
            isAccessAllowed: ({ authentication: { item: user } }) => Boolean(user && (user.isAdmin || user.isSupport)),
            authStrategy,
            hooks: require.resolve('@app/condo/admin-ui'),
        }),
        conf.NODE_ENV === 'test' ? undefined : new NextApp({ dir: '.' }),
    ].filter(identity),

    /** @type {(app: import('express').Application) => void} */
    configureExpress: (app) => {
        app.set('trust proxy', true)

        const requestIdHeaderName = 'X-Request-Id'
        app.use(function reqId (req, res, next) {
            req['id'] = req.headers[requestIdHeaderName.toLowerCase()] = v4()
            res.setHeader(requestIdHeaderName, req['id'])
            next()
        })

        app.get('/.well-known/change-password', function (req, res) {
            res.redirect('/auth/forgot')
        })

        app.use('/admin/', (req, res, next) => {
            if (req.url === '/api') return next()
            const cookies = nextCookie({ req })
            const isSenderValid = hasValidJsonStructure(
                {
                    resolvedData: { sender: cookies['sender'] },
                    fieldPath: 'sender',
                    addFieldValidationError: () => null,
                },
                true,
                1,
                {
                    fingerprint: {
                        presence: true,
                        format: /^[a-zA-Z0-9!#$%()*+-;=,:[\]/.?@^_`{|}~]{5,42}$/,
                        length: { minimum: 5, maximum: 42 },
                    },
                })
            if (!isSenderValid) {
                res.cookie('sender', JSON.stringify({ fingerprint: makeId(12), dv: 1 }))
                res.cookie('dv', 1)
            }
            next()
        })
    },
}
