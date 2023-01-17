/**
 * Generated by `createschema acquiring.Payment 'amount:Decimal; currencyCode:Text; time:DateTimeUtc; accountNumber:Text; purpose?:Text; receipt:Relationship:BillingReceipt:PROTECT; multiPayment:Relationship:MultiPayment:PROTECT; context:Relationship:AcquiringIntegrationContext:PROTECT;' --force`
 */

const { Text, Relationship, DateTimeUtc, Select } = require('@keystonejs/fields')
const Big = require('big.js')
const { get } = require('lodash')

const { Json } = require('@open-condo/keystone/fields')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema, getById } = require('@open-condo/keystone/schema')


const access = require('@condo/domains/acquiring/access/Payment')
const {
    PAYMENT_NO_PAIRED_RECEIPT,
    PAYMENT_NO_PAIRED_FROZEN_RECEIPT,
    PAYMENT_CONTEXT_ORGANIZATION_NOT_MATCH,
    PAYMENT_NOT_ALLOWED_TRANSITION,
    PAYMENT_MISSING_REQUIRED_FIELDS,
    PAYMENT_FROZEN_FIELD_INCLUDED,
    PAYMENT_TOO_BIG_IMPLICIT_FEE,
    PAYMENT_NO_PAIRED_CONTEXT,
    PAYMENT_NO_SUPPORTED_CONTEXT,
    PAYMENT_RECIPIENT_MISMATCH,
    PAYMENT_EXPLICIT_FEE_AND_CHARGE_SAME_TIME,
    PAYMENT_OVERRIDING_EXPLICIT_FEES_MUST_BE_EXPLICIT,
} = require('@condo/domains/acquiring/constants/errors')
const {
    PAYMENT_STATUSES,
    PAYMENT_INIT_STATUS,
    PAYMENT_TRANSITIONS,
    PAYMENT_REQUIRED_FIELDS,
    PAYMENT_FROZEN_FIELDS,
} = require('@condo/domains/acquiring/constants/payment')
const { ACQUIRING_CONTEXT_FIELD } = require('@condo/domains/acquiring/schema/fields/relations')
const { AcquiringIntegrationContext } = require('@condo/domains/acquiring/utils/serverSchema')
const { PERIOD_FIELD } = require('@condo/domains/billing/schema/fields/common')
const {
    CURRENCY_CODE_FIELD,
    POSITIVE_MONEY_AMOUNT_FIELD,
    NON_NEGATIVE_MONEY_FIELD,
    IMPORT_ID_FIELD,
} = require('@condo/domains/common/schema/fields')

const Payment = new GQLListSchema('Payment', {
    schemaDoc: 'Information about completed transaction from user to a specific organization',
    fields: {
        amount: {
            ...POSITIVE_MONEY_AMOUNT_FIELD,
            schemaDoc: 'Amount of money from MultiPayment.amountWithOutExplicitFee to pay for billing receipt',
            isRequired: true,
        },

        explicitFee: {
            ...NON_NEGATIVE_MONEY_FIELD,
            schemaDoc: 'Amount of money which payer pays on top of initial "amount", which counts as fee for every service which is not housing and communal services',
            isRequired: false,
        },

        explicitServiceCharge: {
            ...NON_NEGATIVE_MONEY_FIELD,
            schemaDoc: 'Amount of money which payer pays on top of initial "amount", which counts as internal service charge for all payments from housing and communal services category',
            isRequired: false,
        },

        implicitFee: {
            ...NON_NEGATIVE_MONEY_FIELD,
            schemaDoc: 'Amount of money which recipient pays from initial amount for transaction',
            isRequired: false,
            access: { read: access.canReadPaymentsSensitiveData },
            hooks: {
                validateInput: ({ resolvedData, addFieldValidationError, fieldPath, operation, existingItem }) => {
                    if (resolvedData.hasOwnProperty(fieldPath) && resolvedData[fieldPath] !== null) {
                        const amount = Big(operation === 'create' ? resolvedData['amount'] : existingItem['amount'])
                        const fee = Big(resolvedData[fieldPath])
                        if (fee.gt(amount)) {
                            addFieldValidationError(PAYMENT_TOO_BIG_IMPLICIT_FEE)
                        }
                    }
                },
            },
        },

        serviceFee: {
            ...NON_NEGATIVE_MONEY_FIELD,
            schemaDoc: 'The amount of money charged by our service for the provision of service after subtracting from it the shares of all participants in the process. Can be part of explicit fee, implicit fee or explicit service charge',
            isRequired: false,
        },

        currencyCode: CURRENCY_CODE_FIELD,

        advancedAt: {
            schemaDoc: 'Time at which money was advanced to recipient\'s account',
            type: DateTimeUtc,
            isRequired: false,
        },

        accountNumber: {
            schemaDoc: 'Payer\'s account number',
            type: Text,
            isRequired: true,
        },

        period: PERIOD_FIELD,

        purpose: {
            schemaDoc: 'Purpose of payment. Mostly used as title such as "Payment by agreement №123"',
            type: Text,
            isRequired: false,
        },

        receipt: {
            schemaDoc: 'Link to a billing receipt that the user paid for. Can be null in cases of getting payments out of our system',
            type: Relationship,
            ref: 'BillingReceipt',
            isRequired: false,
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
            hooks: {
                validateInput: ({ resolvedData, addFieldValidationError, fieldPath }) => {
                    if (resolvedData[fieldPath] && !resolvedData['frozenReceipt']) {
                        addFieldValidationError(PAYMENT_NO_PAIRED_FROZEN_RECEIPT)
                    }
                },
            },
        },

        frozenReceipt: {
            schemaDoc: 'Frozen billing receipt, used to resolving conflicts',
            type: Json,
            isRequired: false,
            access: { read: access.canReadPaymentsSensitiveData },
            hooks: {
                validateInput: ({ resolvedData, addFieldValidationError, fieldPath }) => {
                    if (resolvedData[fieldPath] && !resolvedData['receipt']) {
                        addFieldValidationError(PAYMENT_NO_PAIRED_RECEIPT)
                    }
                },
            },
        },

        multiPayment: {
            schemaDoc: 'Link to a payment related MultiPayment. Required field to update, but initially created unlinked',
            type: Relationship,
            ref: 'MultiPayment.payments',
            kmigratorOptions: { null: true, on_delete: 'models.PROTECT' },
        },

        context: {
            ...ACQUIRING_CONTEXT_FIELD,
            isRequired: false,
            kmigratorOptions: { null: true, on_delete: 'models.PROTECT' },
            hooks: {
                validateInput: async ({ resolvedData, addFieldValidationError, fieldPath, existingItem, operation }) => {
                    if (resolvedData[fieldPath]) {
                        const context = await getById('AcquiringIntegrationContext', resolvedData[fieldPath])
                        // NOTE: CHECKS THAT CONTEXT EXIST AND NOT DELETED ARE DONE AUTOMATICALLY BEFORE
                        const organization = operation === 'create' ? get(resolvedData, 'organization') : existingItem.organization
                        if (context.organization !== organization) {
                            return addFieldValidationError(PAYMENT_CONTEXT_ORGANIZATION_NOT_MATCH)
                        }
                    }
                },
            },
        },

        organization: {
            schemaDoc: 'Direct link to organization, since acquiring context cannot be defined for some payments',
            type: Relationship,
            ref: 'Organization',
            knexOptions: { isNotNullable: true }, // Required relationship only!
            access: {
                read: true,
                create: true,
                update: false,
            },
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
        },

        status: {
            schemaDoc: `Status of payment. Can be: ${PAYMENT_STATUSES.map(status => `"${status}"`).join(', ')}`,
            type: Select,
            dataType: 'string',
            isRequired: true,
            options: PAYMENT_STATUSES,
            defaultValue: PAYMENT_INIT_STATUS,
        },

        order: {
            schemaDoc: 'Payment order. A directive to a bank from a bank account holder instructing the bank to make a payment or series of payments to a third party',
            type: Text,
            isRequired: false,
        },

        recipientBic: {
            schemaDoc: 'Bic of recipient organization, used for matching payments with receipts in case of multiple receipts per account + address',
            type: Text,
            isRequired: true,
        },

        recipientBankAccount: {
            schemaDoc: 'Bank account number of recipient organization, used for matching payments with receipts in case of multiple receipts per account + address',
            type: Text,
            isRequired: true,
        },

        importId: IMPORT_ID_FIELD,
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadPayments,
        create: access.canManagePayments,
        update: access.canManagePayments,
        delete: false,
        auth: true,
    },
    hooks: {
        resolveInput: async ({ resolvedData }) => {
            if (resolvedData['explicitFee'] && !resolvedData['explicitServiceCharge']) {
                resolvedData['explicitServiceCharge'] = '0'
            }
            if (resolvedData['explicitServiceCharge'] && !resolvedData['explicitFee']) {
                resolvedData['explicitFee'] = '0'
            }
            return resolvedData
        },
        validateInput: async ({ resolvedData, context, addValidationError, operation, existingItem, originalInput }) => {
            if (operation === 'create') {
                if (resolvedData['receipt']) {
                    if (!resolvedData['context']) {
                        return addValidationError(PAYMENT_NO_PAIRED_CONTEXT)
                    }
                    const receipt = await getById('BillingReceipt', resolvedData['receipt'])
                    const billingContext = await getById('BillingIntegrationOrganizationContext', receipt.context)
                    const acquiringContexts = await AcquiringIntegrationContext.getAll(context, {
                        id: resolvedData['context'],
                        integration: {
                            supportedBillingIntegrations_some: {
                                id: billingContext.integration,
                            },
                        },
                        organization: { id: resolvedData['organization'] },
                    })
                    if (!acquiringContexts.length) {
                        return addValidationError(PAYMENT_NO_SUPPORTED_CONTEXT)
                    }
                    if (get(receipt, ['recipient', 'bic']) !== resolvedData['recipientBic']
                        || get(receipt, ['recipient', 'bankAccount']) !== resolvedData['recipientBankAccount']) {
                        return addValidationError(PAYMENT_RECIPIENT_MISMATCH)
                    }
                }
            } else if (operation === 'update') {
                const oldStatus = existingItem.status
                const newStatus = get(resolvedData, 'status', oldStatus)
                // we can not use resolvedData.hasOwnProperty('status') check here as adminUi sends status if it is not changed
                if (oldStatus !== newStatus) {
                    if (!PAYMENT_TRANSITIONS[oldStatus].includes(newStatus)) {
                        return addValidationError(`${PAYMENT_NOT_ALLOWED_TRANSITION} Cannot move from "${oldStatus}" status to "${newStatus}"`)
                    }
                }
                const newItem = {
                    ...existingItem,
                    ...resolvedData,
                }
                const requiredFields = PAYMENT_REQUIRED_FIELDS[newStatus]
                let requiredMissing = false
                for (const field of requiredFields) {
                    if (!newItem.hasOwnProperty(field) || newItem[field] === null) {
                        addValidationError(`${PAYMENT_MISSING_REQUIRED_FIELDS} Field ${field} was not provided`)
                        requiredMissing = true
                    }
                }
                if (requiredMissing) return
                if (requiredFields.includes('explicitFee') || requiredFields.includes('explicitServiceCharge')) {
                    // Only 1 should be greater than 0
                    const hasPositiveExplicitFee = resolvedData.explicitFee && Big(resolvedData.explicitFee).gt(0)
                    const hasPositiveExplicitServiceCharge = resolvedData.explicitServiceCharge && Big(resolvedData.explicitServiceCharge).gt(0)
                    if (hasPositiveExplicitFee && hasPositiveExplicitServiceCharge) {
                        return addValidationError(PAYMENT_EXPLICIT_FEE_AND_CHARGE_SAME_TIME)
                    }
                    const restrictedFeeOverride = hasPositiveExplicitFee
                        && !originalInput.explicitServiceCharge
                        && get(existingItem, 'explicitServiceCharge')
                        && !Big(existingItem.explicitServiceCharge).eq('0')
                    const restrictedChargeOverride = hasPositiveExplicitServiceCharge
                        && !originalInput.explicitFee
                        && get(existingItem, 'explicitFee')
                        && !Big(existingItem.explicitFee).eq('0')
                    if (restrictedFeeOverride || restrictedChargeOverride) {
                        return addValidationError(PAYMENT_OVERRIDING_EXPLICIT_FEES_MUST_BE_EXPLICIT)
                    }
                }
                const frozenFields = PAYMENT_FROZEN_FIELDS[oldStatus]
                for (const field of frozenFields) {
                    if (resolvedData.hasOwnProperty(field)) {
                        addValidationError(`${PAYMENT_FROZEN_FIELD_INCLUDED} (${field})`)
                    }
                }
            }
        },
    },
})

module.exports = {
    Payment,
}
