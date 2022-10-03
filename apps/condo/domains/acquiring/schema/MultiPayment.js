/**
 * Generated by `createschema acquiring.MultiPayment 'amount:Decimal; commission?:Decimal; time:DateTimeUtc; cardNumber:Text; serviceCategory:Text;'`
 */

const { Text, DateTimeUtc, Select, Relationship, Virtual } = require('@keystonejs/fields')
const { getById, find } = require('@condo/keystone/schema')
const { Json } = require('@condo/keystone/fields')
const { GQLListSchema } = require('@condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@condo/keystone/plugins')
const {
    CURRENCY_CODE_FIELD,
    NON_NEGATIVE_MONEY_FIELD,
    POSITIVE_MONEY_AMOUNT_FIELD,
    IMPORT_ID_FIELD,
} = require('@condo/domains/common/schema/fields')
const { RESIDENT, STAFF } = require('@condo/domains/user/constants/common')
const {
    AVAILABLE_PAYMENT_METHODS,
    MULTIPAYMENT_STATUSES,
    MULTIPAYMENT_DONE_STATUS,
    MULTIPAYMENT_INIT_STATUS,
    MULTIPAYMENT_TRANSITIONS,
    MULTIPAYMENT_REQUIRED_FIELDS,
    MULTIPAYMENT_FROZEN_FIELDS,
    PAYMENT_DONE_STATUS,
    PAYMENT_INIT_STATUS,
} = require('@condo/domains/acquiring/constants/payment')
const {
    MULTIPAYMENT_EMPTY_PAYMENTS,
    MULTIPAYMENT_TOO_BIG_IMPLICIT_FEE,
    MULTIPAYMENT_MULTIPLE_CURRENCIES,
    MULTIPAYMENT_NOT_UNIQUE_RECEIPTS,
    MULTIPAYMENT_TOTAL_AMOUNT_MISMATCH,
    MULTIPAYMENT_MULTIPLE_ACQUIRING_INTEGRATIONS,
    MULTIPAYMENT_ACQUIRING_INTEGRATIONS_MISMATCH,
    MULTIPAYMENT_CANNOT_GROUP_RECEIPTS,
    MULTIPAYMENT_NOT_ALLOWED_TRANSITION,
    MULTIPAYMENT_MISSING_REQUIRED_FIELDS,
    MULTIPAYMENT_FROZEN_FIELD_INCLUDED,
    MULTIPAYMENT_UNDONE_PAYMENTS,
    MULTIPAYMENT_EXPLICIT_FEE_MISMATCH,
    MULTIPAYMENT_INCONSISTENT_IMPLICIT_FEE,
    MULTIPAYMENT_INCONSISTENT_SERVICE_FEE,
    MULTIPAYMENT_IMPLICIT_FEE_MISMATCH,
    MULTIPAYMENT_SERVICE_FEE_MISMATCH,
    MULTIPAYMENT_DELETED_PAYMENTS,
    MULTIPAYMENT_NON_INIT_PAYMENTS,
    MULTIPAYMENT_PAYMENTS_ALREADY_WITH_MP,
    MULTIPAYMENT_EXPLICIT_SERVICE_CHARGE_MISMATCH,
} = require('@condo/domains/acquiring/constants/errors')
const { ACQUIRING_INTEGRATION_FIELD } = require('./fields/relations')
const access = require('@condo/domains/acquiring/access/MultiPayment')
const get = require('lodash/get')
const Big = require('big.js')


const MultiPayment = new GQLListSchema('MultiPayment', {
    schemaDoc: 'Information about resident\'s payment for single or multiple services/receipts',
    fields: {
        amount: {
            schemaDoc: 'Total amount of withdraw. amount = amountWithoutExplicitFee + explicitFee + explicitServiceCharge',
            type: Virtual,
            resolver: (item) => {
                const explicitFee = get(item, 'explicitFee')
                const explicitServiceCharge = get(item, 'explicitServiceCharge')
                const floatFee = new Big(explicitFee || '0')
                const floatCharge = new Big(explicitServiceCharge || '0')
                const floatAmount = new Big(item.amountWithoutExplicitFee)
                return floatAmount.plus(floatFee).plus(floatCharge).toString()
            },
        },

        explicitFee: {
            ...NON_NEGATIVE_MONEY_FIELD,
            schemaDoc: 'Amount of money which payer pays on top of initial "amount", which counts as fee for total "amount"',
            isRequired: false,
        },

        explicitServiceCharge: {
            ...NON_NEGATIVE_MONEY_FIELD,
            schemaDoc: 'Amount of money which payer pays on top of initial "amount", which counts as internal service charge for all payments',
            isRequired: false,
        },

        serviceFee: {
            ...NON_NEGATIVE_MONEY_FIELD,
            schemaDoc: 'The amount of money charged by service (Doma) for the provision of service after subtracting from it the shares of all participants in the process. Can be part of explicit fee, implicit fee or explicit service charge',
            isRequired: false,
        },

        implicitFee: {
            ...NON_NEGATIVE_MONEY_FIELD,
            schemaDoc: 'Total amount of money charged to recipients from amountWithoutExplicitFee of multipayment as fee for transaction',
            isRequired: false,
            access: { read: access.canReadMultiPaymentsSensitiveData },
            hooks: {
                validateInput: ({ resolvedData, addFieldValidationError, fieldPath, listKey, operation, existingItem }) => {
                    if (resolvedData.hasOwnProperty(fieldPath) && resolvedData[fieldPath] !== null) {
                        const parsedDecimal = Big(resolvedData[fieldPath])
                        if (parsedDecimal.lt(0)) {
                            addFieldValidationError(`[${listKey.toLowerCase()}:${fieldPath}:negative] Field "${fieldPath}" of "${listKey}" must be greater then 0`)
                        }
                        const amount = Big(operation === 'create' ? resolvedData['amountWithoutExplicitFee'] : existingItem['amountWithoutExplicitFee'])
                        const fee = Big(resolvedData[fieldPath])
                        if (fee.gt(amount)) {
                            addFieldValidationError(MULTIPAYMENT_TOO_BIG_IMPLICIT_FEE)
                        }
                    }
                },
            },
        },

        amountWithoutExplicitFee: {
            ...POSITIVE_MONEY_AMOUNT_FIELD,
            schemaDoc: 'The amount of money used to pay bills, initialized by resident.',
            isRequired: true,
        },

        currencyCode: CURRENCY_CODE_FIELD,

        withdrawnAt: {
            schemaDoc: 'Time of money withdraw (UTC)',
            type: DateTimeUtc,
            isRequired: false,
        },

        cardNumber: {
            schemaDoc: 'Number of the card (masked) from which the money was withdrawn. Needed for creating receipt',
            type: Text,
            isRequired: false,
        },

        paymentWay: {
            schemaDoc: 'Payment way, such as `CARD` or `APPLE_PAY`',
            type: Select,
            dataType: 'string',
            isRequired: false,
            options: AVAILABLE_PAYMENT_METHODS,
        },

        payerEmail: {
            schemaDoc: 'Payer email address (optional). Can be used by support to find MultiPayment faster or to send digital receipt',
            type: Text,
            isRequired: false,
        },

        serviceCategory: {
            schemaDoc: 'Name of the payment document, such as `Квитанция`, `Штраф`',
            type: Text,
            isRequired: true,
        },

        transactionId: {
            schemaDoc: 'Transaction ID of money withdraw',
            type: Text,
            isRequired: false,
            access: { read: access.canReadMultiPaymentsSensitiveData },
        },

        importId: IMPORT_ID_FIELD,

        meta: {
            schemaDoc: 'Additional acquiring-specific information',
            type: Json,
            isRequired: false,
            access: { read: access.canReadMultiPaymentsSensitiveData },
        },

        status: {
            schemaDoc: `Status of multipayment. Can be: ${MULTIPAYMENT_STATUSES.map(status => `"${status}"`).join(', ')}`,
            type: Select,
            dataType: 'string',
            isRequired: true,
            options: MULTIPAYMENT_STATUSES,
            defaultValue: MULTIPAYMENT_INIT_STATUS,
        },

        user: {
            schemaDoc: 'Link to user',
            type: Relationship,
            ref: 'User',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
            hooks: {
                validateInput: async ({ operation, resolvedData, fieldPath, addFieldValidationError }) => {
                    if (operation === 'create') {
                        const userId = get(resolvedData, fieldPath)
                        if (!userId) {
                            addFieldValidationError('No user specified')
                            return
                        }
                        const user = await getById('User', userId)
                        const userType = get(user, 'type')
                        if ( userType !== RESIDENT && userType !== STAFF) {
                            addFieldValidationError('Cannot create Multipayment to non-resident type of user')
                        }
                    }
                },
            },
        },

        payments: {
            schemaDoc: 'Link to all related payments',
            type: Relationship,
            ref: 'Payment.multiPayment',
            isRequired: true,
            many: true,
            hooks: {
                validateInput: ({ resolvedData, fieldPath, addFieldValidationError }) => {
                    if (resolvedData[fieldPath] && !resolvedData[fieldPath].length) {
                        addFieldValidationError(MULTIPAYMENT_EMPTY_PAYMENTS)
                    }
                },
            },
        },

        integration: ACQUIRING_INTEGRATION_FIELD,
    },
    hooks: {
        validateInput: async ({ resolvedData, addValidationError, operation, existingItem }) => {
            if (operation === 'create') {
                const paymentsIds = get(resolvedData, 'payments', [])
                const payments = await find('Payment', {
                    id_in: paymentsIds,
                })
                const noInitPayments = payments
                    .filter(payment => payment.status !== PAYMENT_INIT_STATUS)
                    .map(payment => payment.id)
                if (noInitPayments.length) {
                    addValidationError(`${MULTIPAYMENT_NON_INIT_PAYMENTS} Failed ids: ${noInitPayments.join(', ')}`)
                }
                const alreadyWithMPPayments = payments
                    .filter(payment => payment.multiPayment)
                    .map(payment => payment.id)
                if (alreadyWithMPPayments.length) {
                    addValidationError(`${MULTIPAYMENT_PAYMENTS_ALREADY_WITH_MP} Failed ids: ${alreadyWithMPPayments.join(', ')}`)
                }
                const currencyCode = resolvedData['currencyCode']
                const anotherCurrencyPayments = payments.filter(payment => payment.currencyCode !== currencyCode).map(payment => `"${payment.id}"`)
                if (anotherCurrencyPayments.length) {
                    return addValidationError(`${MULTIPAYMENT_MULTIPLE_CURRENCIES} [${anotherCurrencyPayments.join(', ')}]`)
                }
                const receiptsIds = new Set(payments.map(payment => payment.receipt))
                if (receiptsIds.size !== payments.length) {
                    return addValidationError(MULTIPAYMENT_NOT_UNIQUE_RECEIPTS)
                }
                const totalAmount = payments.reduce((acc, cur) => acc.plus(cur.amount), new Big(0))
                if (!totalAmount.eq(resolvedData['amountWithoutExplicitFee'])) {
                    return addValidationError(MULTIPAYMENT_TOTAL_AMOUNT_MISMATCH)
                }
                const contexts = await find('AcquiringIntegrationContext', {
                    id_in: payments.map(payment => payment.context),
                })
                const integrations = new Set(contexts.map(context => context.integration))
                if (integrations.size !== 1) {
                    return addValidationError(MULTIPAYMENT_MULTIPLE_ACQUIRING_INTEGRATIONS)
                }
                const integrationId = contexts[0].integration
                if (resolvedData['integration'] !== integrationId) {
                    return addValidationError(MULTIPAYMENT_ACQUIRING_INTEGRATIONS_MISMATCH)
                }
                const integration = await getById('AcquiringIntegration', integrationId)
                if (!integration.canGroupReceipts && payments.length > 1) {
                    return addValidationError(MULTIPAYMENT_CANNOT_GROUP_RECEIPTS)
                }
            } else if (operation === 'update') {
                const payments = await find('Payment', {
                    multiPayment: { id: existingItem.id },
                })
                const oldStatus = existingItem.status
                const newStatus = get(resolvedData, 'status', oldStatus)
                if (!MULTIPAYMENT_TRANSITIONS[oldStatus].includes(newStatus)) {
                    return addValidationError(`${MULTIPAYMENT_NOT_ALLOWED_TRANSITION} Cannot move from "${oldStatus}" status to "${newStatus}"`)
                }
                const newItem = {
                    ...existingItem,
                    ...resolvedData,
                }
                const requiredFields = MULTIPAYMENT_REQUIRED_FIELDS[newStatus]
                let requiredMissing = false
                for (const field of requiredFields) {
                    if (!newItem.hasOwnProperty(field) || newItem[field] === null) {
                        addValidationError(`${MULTIPAYMENT_MISSING_REQUIRED_FIELDS} Field ${field} was not provided`)
                        requiredMissing = true
                    }
                }
                if (requiredMissing) return
                const frozenFields = MULTIPAYMENT_FROZEN_FIELDS[oldStatus]
                let frozenIncluded = false
                for (const field of frozenFields) {
                    if (resolvedData.hasOwnProperty(field)) {
                        addValidationError(`${MULTIPAYMENT_FROZEN_FIELD_INCLUDED} (${field})`)
                        frozenIncluded = true
                    }
                }
                if (frozenIncluded) return
                if (newStatus === MULTIPAYMENT_DONE_STATUS) {
                    const deletedPayments = payments
                        .filter(payment => payment.deletedAt)
                        .map(payment => payment.id)
                    if (deletedPayments.length) {
                        return addValidationError(`${MULTIPAYMENT_DELETED_PAYMENTS} Failed ids: ${deletedPayments.join(', ')}`)
                    }
                    const undonePayments = payments
                        .filter(payment => payment.status !== PAYMENT_DONE_STATUS)
                        .map(payment => payment.id)
                    if (undonePayments.length) {
                        addValidationError(`${MULTIPAYMENT_UNDONE_PAYMENTS} Undone payments ids: ${undonePayments.join(', ')}`)
                    }

                    const totalExplicitFee = payments.reduce((acc, cur) => acc.plus(cur.explicitFee || '0'), Big(0))
                    if (!newItem.explicitFee || !totalExplicitFee.eq(newItem.explicitFee)) {
                        addValidationError(`${MULTIPAYMENT_EXPLICIT_FEE_MISMATCH}`)
                    }

                    const totalExplicitServiceCharge = payments.reduce((acc, cur) => acc.plus(cur.explicitServiceCharge || '0'), Big(0))
                    if (!newItem.explicitFee || !totalExplicitServiceCharge.eq(newItem.explicitServiceCharge)) {
                        addValidationError(MULTIPAYMENT_EXPLICIT_SERVICE_CHARGE_MISMATCH)
                    }

                    const paymentsWithImplicitFee = payments.filter(payment => payment.implicitFee)
                    if (paymentsWithImplicitFee.length !== payments.length && paymentsWithImplicitFee.length !== 0) {
                        addValidationError(MULTIPAYMENT_INCONSISTENT_IMPLICIT_FEE)
                    }
                    if (paymentsWithImplicitFee.length === payments.length) {
                        const totalImplicitFee = payments.reduce((acc, cur) => acc.plus(cur.implicitFee), Big(0))
                        if (!newItem.implicitFee || !totalImplicitFee.eq(newItem.implicitFee)) {
                            addValidationError(MULTIPAYMENT_IMPLICIT_FEE_MISMATCH)
                        }
                    }

                    const paymentsWithServiceFee = payments.filter(payment => payment.serviceFee)
                    if (paymentsWithServiceFee.length !== payments.length && paymentsWithServiceFee.length !== 0) {
                        addValidationError(MULTIPAYMENT_INCONSISTENT_SERVICE_FEE)
                    }
                    if (paymentsWithServiceFee.length === payments.length) {
                        const totalServiceFee = payments.reduce((acc, cur) => acc.plus(cur.serviceFee), Big(0))
                        if (!newItem.serviceFee || !totalServiceFee.eq(newItem.serviceFee)) {
                            addValidationError(MULTIPAYMENT_SERVICE_FEE_MISMATCH)
                        }
                    }
                }
            }
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadMultiPayments,
        create: access.canManageMultiPayments,
        update: access.canManageMultiPayments,
        delete: false,
        auth: true,
    },
})

module.exports = {
    MultiPayment,
}
