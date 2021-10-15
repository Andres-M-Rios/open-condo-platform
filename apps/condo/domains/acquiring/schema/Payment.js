/**
 * Generated by `createschema acquiring.Payment 'amount:Decimal; currencyCode:Text; time:DateTimeUtc; accountNumber:Text; purpose?:Text; receipt:Relationship:BillingReceipt:PROTECT; multiPayment:Relationship:MultiPayment:PROTECT; context:Relationship:AcquiringIntegrationContext:PROTECT;' --force`
 */

const { Text, Relationship, DateTimeUtc, Decimal } = require('@keystonejs/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD, CURRENCY_CODE_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/acquiring/access/Payment')


const Payment = new GQLListSchema('Payment', {
    schemaDoc: 'Information about completed transaction from user to a specific organization',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        amount: {
            schemaDoc: 'Amount of payment',
            type: Decimal,
            isRequired: true,
        },

        currencyCode: CURRENCY_CODE_FIELD,

        time: {
            schemaDoc: 'Time at which transaction was made',
            type: DateTimeUtc,
            isRequired: true,
        },

        accountNumber: {
            schemaDoc: 'Payer\'s account number',
            type: Text,
            isRequired: true,
        },

        purpose: {
            schemaDoc: 'Purpose of payment. Mostly used as title such as "Payment by agreement №123"',
            type: Text,
            isRequired: false,
        },

        receipt: {
            schemaDoc: 'Link to a billing receipt that the user paid for',
            type: Relationship,
            ref: 'BillingReceipt',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
        },

        multiPayment: {
            schemaDoc: 'Link to a payment related MultiPayment',
            type: Relationship,
            ref: 'MultiPayment',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
            hooks: {
                // TODO (savelevMatthew): create validations later
            },
        },

        context: {
            schemaDoc: 'Link to Acquiring Integration context to link payment with organization',
            type: Relationship,
            ref: 'AcquiringIntegrationContext',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    access: {
        read: access.canReadPayments,
        create: access.canManagePayments,
        update: access.canManagePayments,
        delete: false,
        auth: true,
    },
})

module.exports = {
    Payment,
}
