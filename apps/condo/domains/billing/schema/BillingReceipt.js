/**
 * Generated by `createschema billing.BillingReceipt 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; importId?:Text; property:Relationship:BillingProperty:CASCADE; account:Relationship:BillingAccount:CASCADE; period:CalendarDay; raw:Json; toPay:Text; services:Json; meta:Json'`
 */

const { Text } = require('@keystonejs/fields')
const { Json } = require('@core/keystone/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/billing/access/BillingReceipt')

const { INTEGRATION_CONTEXT_FIELD, IMPORT_ID_FIELD, RAW_DATA_FIELD, BILLING_PROPERTY_FIELD, BILLING_ACCOUNT_FIELD, PERIOD_FIELD, BILLING_ORGANIZATION_FIELD } = require('./fields')

const BillingReceipt = new GQLListSchema('BillingReceipt', {
    schemaDoc: 'Account monthly invoice document',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        context: INTEGRATION_CONTEXT_FIELD,
        property: BILLING_PROPERTY_FIELD,
        recipient: BILLING_ORGANIZATION_FIELD,
        account: BILLING_ACCOUNT_FIELD,

        importId: IMPORT_ID_FIELD,
        period: PERIOD_FIELD,
        printableNumber: {
            schemaDoc: 'A number to print on the payment document.',
            type: Text,
            isRequired: false,
        },

        raw: RAW_DATA_FIELD,

        toPay: {
            schemaDoc: 'Total sum to pay. Usually counts as the sum of all services. Detail level 1.',
            type: Text,
            isRequired: true,
        },

        toPayDetails: {
            schemaDoc: 'Sum to pay details. Detail level 2',
            // todo(toplenboren) add validators for this lad!
            type: Json,
            isRequired: false,
        },

        services: {
            schemaDoc: 'Structured items in the receipt obtained from the `billing data source`. Amount of payment is required for use in the `receipt template`.',
            // todo(toplenboren) add validators for this lad too!
            type: Json,
            isRequired: false,
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    access: {
        read: access.canReadBillingReceipts,
        create: access.canManageBillingReceipts,
        update: access.canManageBillingReceipts,
        delete: false,
        auth: true,
    },
})

module.exports = {
    BillingReceipt,
}
