/**
 * Generated by `createschema miniapp.B2BAppContext 'integration:Relationship:B2BApp:PROTECT; organization:Relationship:Organization:PROTECT; settings:Json; state:Json;'`
 */

const { Relationship } = require('@keystonejs/fields')
const { Json } = require('@condo/keystone/fields')
const { GQLListSchema } = require('@condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@condo/keystone/plugins')
const { webHooked } = require('@condo/webhooks/plugins')
const access = require('@condo/domains/miniapp/access/B2BAppContext')
const { NO_CONTEXT_STATUS_ERROR } = require('@condo/domains/miniapp/constants')
const { STATUS_FIELD, getStatusResolver, getStatusDescription } = require('@condo/domains/miniapp/schema/fields/context')


const B2BAppContext = new GQLListSchema('B2BAppContext', {
    schemaDoc: 'Object which connects B2B App and Organization. Used to determine if app is connected or not, and store settings / state of app for specific organization',
    fields: {
        app: {
            schemaDoc: 'B2B App',
            type: Relationship,
            ref: 'B2BApp',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
            access: {
                create: true,
                read: true,
                update: false,
            },
        },
        organization: {
            schemaDoc: 'Organization',
            type: Relationship,
            ref: 'Organization',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
            access: {
                create: true,
                read: true,
                update: false,
            },
        },
        settings: {
            schemaDoc: 'Settings that are required for specified app to work with specified organization. Filled by app\'s service account / support and can have any JSON structure',
            type: Json,
            isRequired: false,
            access: {
                create: access.canReadAndManageSensitiveContextData,
                read: access.canReadAndManageSensitiveContextData,
            },
        },
        state: {
            schemaDoc: 'State of B2B working progress with specified organization. Filled by app\'s service account and can have any JSON structure',
            type: Json,
            isRequired: false,
            access: {
                create: access.canReadAndManageSensitiveContextData,
                read: access.canReadAndManageSensitiveContextData,
            },
        },
        status: {
            ...STATUS_FIELD,
            schemaDoc: getStatusDescription('B2BApp'),
            hooks: {
                resolveInput: getStatusResolver('B2BApp', 'app'),
            },
        },
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['organization', 'app'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'b2b_app_context_unique_organization_and_app',
            },
        ],
    },
    hooks: {
        validateInput: async ({ resolvedData, existingItem, addValidationError }) => {
            const newItem = { ...existingItem, ...resolvedData }
            if (!newItem || !newItem.status) {
                return addValidationError(NO_CONTEXT_STATUS_ERROR)
            }
        },
    },
    plugins: [
        uuided(),
        versioned(),
        tracked(),
        softDeleted(),
        dvAndSender(),
        historical(),
        webHooked(),
    ],
    access: {
        read: access.canReadB2BAppContexts,
        create: access.canManageB2BAppContexts,
        update: access.canManageB2BAppContexts,
        delete: false,
        auth: true,
    },
})

module.exports = {
    B2BAppContext,
}
