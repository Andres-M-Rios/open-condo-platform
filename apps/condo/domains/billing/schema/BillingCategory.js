/**
 * Generated by `createschema billing.BillingCategory 'name:Text'`
 */
const Ajv = require('ajv')

const { LocalizedText, Json } = require('@open-condo/keystone/fields')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/billing/access/BillingCategory')
const { getValidator } = require('@condo/domains/common/schema/json.utils')

const ajv = new Ajv()

const BillingCategory = new GQLListSchema('BillingCategory', {
    schemaDoc: 'Receipt category - used primarily in display purposes',
    fields: {
        name: {
            schemaDoc: 'Localized name of billing category: Hot water, Cold water, Housing Services',
            type: LocalizedText,
            isRequired: true,
            template: 'billing.category.*.name',
        },
        serviceNames: {
            schemaDoc: 'Possible names of services to auto-detect receipt category',
            type: Json,
            isRequired: false,
            hooks: {
                validateInput: getValidator(ajv.compile({
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                })),
            },
        },
    },
    labelResolver: item => item.id,
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadBillingCategories,
        create: access.canManageBillingCategories,
        update: access.canManageBillingCategories,
        // NOTE: These categories are explicitly created in 0121 migration.
        delete: false,
        auth: true,
    },
    escapeSearch: true,
})

module.exports = {
    BillingCategory,
}
