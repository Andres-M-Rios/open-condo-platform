/**
 * Generated by `createservice acquiring.RegisterMultiPaymentService`
 */

const { getById } = require('@core/keystone/schema')

const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('@condo/domains/acquiring/access/RegisterMultiPaymentService')
const { DV_UNKNOWN_VERSION_ERROR } = require('@condo/domains/common/constants/errors')
const {
    REGISTER_MP_MISSING_REQUIRED_GROUPED_RECEIPTS,
    REGISTER_MP_EMPTY_RECEIPTS,
    REGISTER_MP_CONSUMERS_DUPLICATE,
    REGISTER_MP_RECEIPTS_DUPLICATE,
    REGISTER_MP_REAL_CONSUMER_MISMATCH,
    REGISTER_MP_NO_ACQUIRING_CONSUMERS,
    REGISTER_MP_MULTIPLE_INTEGRATIONS,
    REGISTER_MP_CANNOT_GROUP_RECEIPTS,
    REGISTER_MP_UNSUPPORTED_BILLING,
    REGISTER_MP_REAL_RECEIPTS_MISMATCH,
    REGISTER_MP_DELETED_RECEIPTS,
    REGISTER_MP_MULTIPLE_CURRENCIES,
    REGISTER_MP_BILLING_ACCOUNTS_NO_MATCH,
    REGISTER_MP_INVALID_SENDER,
    REGISTER_MP_DELETED_CONSUMERS,
    REGISTER_MP_DELETED_ACQUIRING_CONTEXTS,
    REGISTER_MP_DELETED_ACQUIRING_INTEGRATION,
    REGISTER_MP_DELETED_BILLING_CONTEXT,
    REGISTER_MP_DELETED_BILLING_INTEGRATION,
    REGISTER_MP_NEGATIVE_TO_PAY,
} = require('@condo/domains/acquiring/constants/errors')
const { DEFAULT_MULTIPAYMENT_SERVICE_CATEGORY } = require('@condo/domains/acquiring/constants/payment')
const {
    FEE_CALCULATION_PATH,
    WEB_VIEW_PATH,
    DIRECT_PAYMENT_PATH,
} = require('@condo/domains/acquiring/constants/links')
const { JSON_STRUCTURE_FIELDS_CONSTRAINTS } = require('@condo/domains/common/utils/validation.utils')
// TODO(savelevMatthew): REPLACE WITH SERVER SCHEMAS AFTER GQL REFACTORING
const { find } = require('@core/keystone/schema')
const { Payment, MultiPayment, AcquiringIntegration } = require('@condo/domains/acquiring/utils/serverSchema')
const { getAcquiringIntegrationContextFormula, FeeDistribution } = require('@condo/domains/acquiring/utils/serverSchema/feeDistribution')
const { freezeBillingReceipt } = require('@condo/domains/acquiring/utils/freezeBillingReceipt')
const get = require('lodash/get')
const Big = require('big.js')
const validate = require('validate.js')
const { GQLError, GQLErrorCode: { BAD_USER_INPUT } } = require('@core/keystone/errors')
const { REQUIRED, NOT_UNIQUE, NOT_FOUND, DV_VERSION_MISMATCH } = require('@condo/domains/common/constants/errors')
const { WRONG_FORMAT } = require('../../common/constants/errors')
const { MULTIPLE_ACQUIRING_INTEGRATION_CONTEXTS, RECEIPTS_ARE_DELETED, RECEIPTS_HAVE_NEGATIVE_TO_PAY_VALUE,
    ACQUIRING_INTEGRATION_DOES_NOT_SUPPORTS_BILLING_INTEGRATION, RECEIPTS_HAS_MULTIPLE_CURRENCIES,
    RECEIPT_HAS_DELETED_BILLING_INTEGRATION, BILLING_RECEIPT_DOES_NOT_HAVE_COMMON_BILLING_ACCOUNT_WITH_SERVICE_CONSUMER,
    BILLING_INTEGRATION_ORGANIZATION_CONTEXT_IS_DELETED, ACQUIRING_INTEGRATION_CONTEXT_IS_MISSING,
    ACQUIRING_INTEGRATION_IS_DELETED, RECEIPTS_CANNOT_BE_GROUPED_BY_ACQUIRING_INTEGRATION,
    CANNOT_FIND_ALL_BILLING_RECEIPTS, ACQUIRING_INTEGRATION_CONTEXT_IS_DELETED,
} = require('../constants/errors')

const errors = {
    DV_VERSION_MISMATCH: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'dv'],
        code: BAD_USER_INPUT,
        type: DV_VERSION_MISMATCH,
        message: 'Wrong value for data version number',
    },
    WRONG_SENDER_FORMAT: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'sender'],
        code: BAD_USER_INPUT,
        type: WRONG_FORMAT,
        message: 'Invalid format of "sender" field value. {details}',
        correctExample: '{ dv: 1, fingerprint: \'example-fingerprint-alphanumeric-value\'}',
    },
    MISSING_REQUIRED_GROUPED_RECEIPTS: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts'],
        code: BAD_USER_INPUT,
        type: REQUIRED,
        message: 'Missing required value for "groupedReceipts" field',
    },
    MISSING_REQUIRED_RECEIPTS_IN_GROUPED_RECEIPTS: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts'],
        code: BAD_USER_INPUT,
        type: REQUIRED,
        message: 'Each group of receipts should contain at least 1 receipt',
    },
    DUPLICATED_CONSUMER: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'consumerId'],
        code: BAD_USER_INPUT,
        type: NOT_UNIQUE,
        message: 'There are some groupedReceipts with same consumerId',
    },
    DUPLICATED_RECEIPT: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts'],
        code: BAD_USER_INPUT,
        type: NOT_UNIQUE,
        message: 'Found duplicated receipt ids. Note, each receipt can only occur in single ServiceConsumer per mutation run and cannot be noticed twice',
    },
    MISSING_CONSUMERS: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'consumerId'],
        code: BAD_USER_INPUT,
        type: NOT_FOUND,
        message: 'Cannot find specified ServiceConsumers with following ids: {ids}',
    },
    DELETED_CONSUMERS: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'consumerId'],
        code: BAD_USER_INPUT,
        type: NOT_FOUND,
        message: 'Some of specified ServiceConsumers with ids {ids} were deleted, so you cannot pay for them anymore',
    },
    ACQUIRING_INTEGRATION_CONTEXT_IS_MISSING: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'consumerId'],
        code: BAD_USER_INPUT,
        type: ACQUIRING_INTEGRATION_CONTEXT_IS_MISSING,
        message: 'ServiceConsumers with ids {ids} does not have AcquiringIntegrationContext',
    },
    ACQUIRING_INTEGRATION_CONTEXT_IS_DELETED: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'consumerId'],
        code: BAD_USER_INPUT,
        type: ACQUIRING_INTEGRATION_CONTEXT_IS_DELETED,
        message: 'Some ServiceConsumers has deleted AcquiringIntegrationContext',
    },
    MULTIPLE_ACQUIRING_INTEGRATION_CONTEXTS: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'consumerId'],
        code: BAD_USER_INPUT,
        type: MULTIPLE_ACQUIRING_INTEGRATION_CONTEXTS,
        message: 'Listed consumerIds are linked to different acquiring integrations',
    },
    ACQUIRING_INTEGRATION_IS_DELETED: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'consumerId'],
        code: BAD_USER_INPUT,
        type: ACQUIRING_INTEGRATION_IS_DELETED,
        message: 'Cannot pay via deleted acquiring integration with id "{id}"',
    },
    RECEIPTS_CANNOT_BE_GROUPED_BY_ACQUIRING_INTEGRATION: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'consumerId'],
        code: BAD_USER_INPUT,
        type: RECEIPTS_CANNOT_BE_GROUPED_BY_ACQUIRING_INTEGRATION,
        message: 'Receipts cannot be grouped by AcquiringIntegration with id "{id}", because a value of "canGroupReceipts" field is false',
    },
    CANNOT_FIND_ALL_BILLING_RECEIPTS: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts', '[]', 'id'],
        code: BAD_USER_INPUT,
        type: CANNOT_FIND_ALL_BILLING_RECEIPTS,
        message: 'Cannot find all specified BillingReceipts with ids {missingReceiptIds}',
    },
    RECEIPTS_ARE_DELETED: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts', '[]', 'id'],
        code: BAD_USER_INPUT,
        type: RECEIPTS_ARE_DELETED,
        message: 'Cannot pay for deleted receipts {ids}',
    },
    RECEIPTS_HAVE_NEGATIVE_TO_PAY_VALUE: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts', '[]', 'id'],
        code: BAD_USER_INPUT,
        type: RECEIPTS_HAVE_NEGATIVE_TO_PAY_VALUE,
        message: 'Cannot pay for BillingReceipts {ids} with negative "toPay" value',
    },
    BILLING_RECEIPT_DOES_NOT_HAVE_COMMON_BILLING_ACCOUNT_WITH_SERVICE_CONSUMER: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts', '[]', 'id'],
        code: BAD_USER_INPUT,
        type: BILLING_RECEIPT_DOES_NOT_HAVE_COMMON_BILLING_ACCOUNT_WITH_SERVICE_CONSUMER
        ,
        message: 'BillingReceipt with id "{receiptId}" does not have common BillingAccount with specified ServiceConsumer with id "{serviceConsumerId}"',
    },
    BILLING_INTEGRATION_ORGANIZATION_CONTEXT_IS_DELETED: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts', '[]', 'id'],
        code: BAD_USER_INPUT,
        type: BILLING_INTEGRATION_ORGANIZATION_CONTEXT_IS_DELETED,
        message: 'BillingIntegrationOrganizationContext is deleted for some BillingReceipts',
    },
    ACQUIRING_INTEGRATION_DOES_NOT_SUPPORTS_BILLING_INTEGRATION: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts', '[]', 'id'],
        code: BAD_USER_INPUT,
        type: ACQUIRING_INTEGRATION_DOES_NOT_SUPPORTS_BILLING_INTEGRATION,
        message: 'Some of ServiceConsumer\'s AcquiringIntegration does not supports following BillingReceipt\'s BillingIntegrations: {unsupportedBillingIntegrations}',
    },
    RECEIPT_HAS_DELETED_BILLING_INTEGRATION: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts', '[]', 'id'],
        code: BAD_USER_INPUT,
        type: RECEIPT_HAS_DELETED_BILLING_INTEGRATION,
        message: 'BillingReceipt has deleted BillingIntegration',
    },
    RECEIPTS_HAS_MULTIPLE_CURRENCIES: {
        mutation: 'registerMultiPayment',
        variable: ['data', 'groupedReceipts', '[]', 'receipts', '[]', 'id'],
        code: BAD_USER_INPUT,
        type: RECEIPTS_HAS_MULTIPLE_CURRENCIES,
        message: 'BillingReceipts has multiple currencies',
    },
}


const SENDER_FIELD_CONSTRAINTS = {
    ...JSON_STRUCTURE_FIELDS_CONSTRAINTS,
    dv: {
        numericality: {
            noStrings: true,
            equalTo: 1,
        },
    },
}


const RegisterMultiPaymentService = new GQLCustomSchema('RegisterMultiPaymentService', {
    types: [
        {
            access: true,
            type: 'input RegisterMultiPaymentReceiptInfoInput { id: String! }',
        },
        {
            access: true,
            type: 'input RegisterMultiPaymentServiceConsumerInput { consumerId: String!, receipts: [RegisterMultiPaymentReceiptInfoInput!]! }',
        },
        {
            access: true,
            type: 'input RegisterMultiPaymentInput { dv: Int!, sender: SenderFieldInput!, groupedReceipts: [RegisterMultiPaymentServiceConsumerInput!]! }',
        },
        {
            access: true,
            type: 'type RegisterMultiPaymentOutput { dv: Int!, multiPaymentId: String!, webViewUrl: String!, feeCalculationUrl: String!, directPaymentUrl: String! }',
        },
    ],

    mutations: [
        {
            access: access.canRegisterMultiPayment,
            schema: 'registerMultiPayment(data: RegisterMultiPaymentInput!): RegisterMultiPaymentOutput',
            resolver: async (parent, args, context) => {
                const { data } = args
                const { dv, sender, groupedReceipts } = data

                // Stage 0. Check if input is valid
                if (dv !== 1) {
                    throw new GQLError(errors.DV_VERSION_MISMATCH)
                }

                const senderErrors = validate(sender, SENDER_FIELD_CONSTRAINTS)
                if (senderErrors && Object.keys(senderErrors).length) {
                    const details = Object.keys(senderErrors).map(field => {
                        return `${field}: [${senderErrors[field].map(error => `'${error}'`).join(', ')}]`
                    }).join(', ')
                    throw new GQLError({ ...errors.WRONG_SENDER_FORMAT, messageInterpolation: { details } })
                }

                if (!get(groupedReceipts, 'length')) {
                    throw new GQLError(errors.MISSING_REQUIRED_GROUPED_RECEIPTS)
                }
                if (groupedReceipts.some(group => !get(group, ['receipts', 'length']))) {
                    throw new GQLError(errors.MISSING_REQUIRED_RECEIPTS_IN_GROUPED_RECEIPTS)
                }

                // Stage 0.1: Duplicates check
                const consumersIds = groupedReceipts.map(group => group.consumerId)
                const uniqueConsumerIds = new Set(consumersIds)
                if (consumersIds.length !== uniqueConsumerIds.size) {
                    throw new GQLError(errors.DUPLICATED_CONSUMER)
                }
                const receiptsIds = groupedReceipts
                    .flatMap(group => group.receipts)
                    .map(receiptInfo => receiptInfo.id)
                const uniqueReceiptsIds = new Set(receiptsIds)
                if (receiptsIds.length !== uniqueReceiptsIds.size) {
                    throw new GQLError(errors.DUPLICATED_RECEIPT)
                }

                // Stage 1. Check Acquiring
                const consumers = await find('ServiceConsumer', {
                    id_in: consumersIds,
                })
                if (consumers.length !== consumersIds.length) {
                    const existingConsumerIds = consumers.map(consumer => consumer.id)
                    const missingConsumerIds = consumersIds.filter(consumerId => !existingConsumerIds.includes(consumerId))
                    throw new GQLError({ ...errors.MISSING_CONSUMERS, messageInterpolation: { ids: missingConsumerIds.join(', ') } })
                }
                const deletedConsumersIds = consumers.filter(consumer => consumer.deletedAt).map(consumer => consumer.id)
                if (deletedConsumersIds.length) {
                    throw new GQLError({ ...errors.DELETED_CONSUMERS, messageInterpolation: { ids: deletedConsumersIds.join(', ') } })
                }
                const contextMissingConsumers = consumers
                    .filter(consumer => !get(consumer, 'acquiringIntegrationContext'))
                    .map(consumer => consumer.id)
                if (contextMissingConsumers.length) {
                    throw new GQLError({ ...errors.ACQUIRING_INTEGRATION_CONTEXT_IS_MISSING, messageInterpolation: { ids: contextMissingConsumers.join(', ') } })
                }

                const consumersByIds = Object.assign({}, ...consumers.map(obj => ({ [obj.id]: obj })))

                const uniqueAcquiringContextsIds = new Set(consumers.map(consumer => consumer.acquiringIntegrationContext))
                const acquiringContexts = await find('AcquiringIntegrationContext', {
                    id_in: Array.from(uniqueAcquiringContextsIds),
                })

                const deletedAcquiringContextsIds = new Set(acquiringContexts.filter(context => context.deletedAt).map(context => context.id))
                if (deletedAcquiringContextsIds.size) {
                    const failedConsumers = consumers
                        .filter(consumer => deletedAcquiringContextsIds.has(consumer.acquiringIntegrationContext))
                        .map(consumer => ({ consumerId: consumer.id, acquiringContextId: consumer.acquiringIntegrationContext }))
                    throw new GQLError({ ...errors.ACQUIRING_INTEGRATION_CONTEXT_IS_DELETED, data: { failedConsumers } })
                }

                const acquiringContextsByIds = Object.assign({}, ...acquiringContexts.map(obj => ({ [obj.id]: obj })))

                const acquiringIntegrations = new Set(acquiringContexts.map(context => context.integration))
                if (acquiringIntegrations.size !== 1) {
                    throw new GQLError(errors.MULTIPLE_ACQUIRING_INTEGRATION_CONTEXTS)
                }

                // NOTE: Here using serverSchema to get many relation
                const [acquiringIntegration] = await AcquiringIntegration.getAll(context, {
                    id: Array.from(acquiringIntegrations)[0],
                })
                if (acquiringIntegration.deletedAt) {
                    throw new GQLError({ ...errors.ACQUIRING_INTEGRATION_IS_DELETED, messageInterpolation: { id: acquiringIntegration.id } })
                }

                // TODO (savelevMatthew): check that all receipts linked to right consumers?
                // Stage 2. Check BillingReceipts
                if (receiptsIds.length > 1 && !acquiringIntegration.canGroupReceipts) {
                    throw new GQLError({ ...errors.RECEIPTS_CANNOT_BE_GROUPED_BY_ACQUIRING_INTEGRATION, messageInterpolation: { id: acquiringIntegration.id } })
                }
                const receipts = await find('BillingReceipt', {
                    id_in: receiptsIds,
                })
                if (receipts.length !== receiptsIds.length) {
                    const existingReceiptsIds = new Set(receipts.map(receipt => receipt.id))
                    const missingReceipts = receiptsIds.filter(receiptId => !existingReceiptsIds.has(receiptId))
                    throw new GQLError({ ...errors.CANNOT_FIND_ALL_BILLING_RECEIPTS, messageInterpolation: { missingReceiptIds: missingReceipts.join(', ') } })
                }

                const deletedReceiptsIds = receipts.filter(receipt => Boolean(receipt.deletedAt)).map(receipt => receipt.id)
                if (deletedReceiptsIds.length) {
                    throw new GQLError({ ...errors.RECEIPTS_ARE_DELETED, messageInterpolation: { ids: deletedReceiptsIds.join(', ') } })
                }

                const negativeReceiptsIds = receipts
                    .filter(receipt => Big(receipt.toPay).lte(0))
                    .map(receipt => receipt.id)
                if (negativeReceiptsIds.length) {
                    throw new GQLError({ ...errors.RECEIPTS_HAVE_NEGATIVE_TO_PAY_VALUE, messageInterpolation: { ids: negativeReceiptsIds.join(', ') } })
                }

                const receiptsByIds = Object.assign({}, ...receipts.map(obj => ({ [obj.id]: obj })))

                for (const group of groupedReceipts) {
                    for (const receiptInfo of group.receipts) {
                        const receipt = receiptsByIds[receiptInfo.id]

                        const billingAccountId = receipt.account
                        const billingAccount = await getById('BillingAccount', billingAccountId)

                        const consumer = consumersByIds[group.consumerId]
                        const resident = await getById('Resident', consumer.resident)

                        if (
                            billingAccount.number !== consumer.accountNumber
                         || billingAccount.unitName !== resident.unitName
                         || billingAccount.context !== consumer.billingIntegrationContext
                        ) {
                            throw new GQLError({
                                ...errors.BILLING_RECEIPT_DOES_NOT_HAVE_COMMON_BILLING_ACCOUNT_WITH_SERVICE_CONSUMER,
                                messageInterpolation: {
                                    receiptId: receiptInfo.id,
                                    serviceConsumerId: group.consumerId,
                                },
                            })
                        }
                    }
                }

                const uniqueBillingContextsIds = new Set(receipts.map(receipt => receipt.context))
                const billingContexts = await find('BillingIntegrationOrganizationContext', {
                    id_in: Array.from(uniqueBillingContextsIds),
                })
                const billingContextsById = Object.assign({}, ...billingContexts.map(obj => ({ [obj.id]: obj })))
                const deletedBillingContextsIds = new Set(billingContexts.filter(context => context.deletedAt).map(context => context.id))
                if (deletedBillingContextsIds.size) {
                    const failedReceipts = receipts
                        .filter(receipt => deletedBillingContextsIds.has(receipt.context))
                        .map(receipt => ({ receiptId: receipt.id, contextId: receipt.context }))
                    throw new GQLError({ ...errors.BILLING_INTEGRATION_ORGANIZATION_CONTEXT_IS_DELETED, data: { failedReceipts } })
                }
                const supportedBillingIntegrations = get(acquiringIntegration, 'supportedBillingIntegrations', [])
                    .map(integration => integration.id)
                const uniqueBillingIntegrationsIds = new Set(billingContexts.map(context => context.integration))
                const unsupportedBillings = Array.from(uniqueBillingIntegrationsIds)
                    .filter(integration => !supportedBillingIntegrations.includes(integration))
                if (unsupportedBillings.length) {
                    throw new GQLError({ ...errors.ACQUIRING_INTEGRATION_DOES_NOT_SUPPORTS_BILLING_INTEGRATION, messageInterpolation: { unsupportedBillingIntegrations:  unsupportedBillings.join(', ') } })
                }

                const billingIntegrations = await find('BillingIntegration', {
                    id_in: Array.from(uniqueBillingIntegrationsIds),
                })
                const deletedBillingIntegrationsIds = new Set(billingIntegrations.filter(integration => integration.deletedAt).map(integration => integration.id))
                if (deletedBillingIntegrationsIds.size) {
                    const failedReceipts = receipts
                        .filter(receipt => deletedBillingIntegrationsIds.has(billingContextsById[receipt.context].integration))
                        .map(receipt => ({ receiptId: receipt.id, integrationId: billingContextsById[receipt.context].integration }))
                    throw new GQLError({ ...errors.RECEIPT_HAS_DELETED_BILLING_INTEGRATION, data: { failedReceipts } })
                }

                const currencies = new Set(billingIntegrations.map(integration => integration.currencyCode))
                if (currencies.size > 1) {
                    throw new GQLError(errors.RECEIPTS_HAS_MULTIPLE_CURRENCIES)
                }
                const currencyCode = get(billingIntegrations, ['0', 'currencyCode'])

                // Stage 3 Generating payments
                const payments = []
                for (const group of groupedReceipts) {
                    const serviceConsumer = consumersByIds[group.consumerId]
                    const acquiringContext = acquiringContextsByIds[serviceConsumer.acquiringIntegrationContext]
                    const formula = await getAcquiringIntegrationContextFormula(context, serviceConsumer.acquiringIntegrationContext)
                    const feeCalculator = new FeeDistribution(formula)
                    for (const receiptInfo of group.receipts) {
                        const receipt = receiptsByIds[receiptInfo.id]
                        const frozenReceipt = await freezeBillingReceipt(receipt)
                        const billingAccountNumber = get(frozenReceipt, ['data', 'account', 'number'])
                        const { type, explicitFee = '0', implicitFee = '0', fromReceiptAmountFee = '0' } = feeCalculator.calculate(receipt.toPay)
                        const paymentCommissionFields = {
                            ...type === 'service' ? {
                                explicitServiceCharge: String(explicitFee),
                                explicitFee: '0',
                            } : {
                                explicitServiceCharge: '0',
                                explicitFee: String(explicitFee),
                            },
                            implicitFee: String(implicitFee),
                            serviceFee: String(fromReceiptAmountFee),
                        }
                        const payment = await Payment.create(context, {
                            dv: 1,
                            sender,
                            amount: receipt.toPay,
                            currencyCode,
                            accountNumber: billingAccountNumber,
                            period: receipt.period,
                            receipt: { connect: { id: receiptInfo.id } },
                            frozenReceipt,
                            context: { connect: { id: acquiringContext.id } },
                            organization: { connect: { id: acquiringContext.organization } },
                            recipientBic: receipt.recipient.bic,
                            recipientBankAccount: receipt.recipient.bankAccount,
                            ...paymentCommissionFields,
                        })
                        payments.push({ ...payment, serviceFee: paymentCommissionFields.serviceFee })
                    }
                }
                const paymentIds = payments.map(payment => ({ id: payment.id }))
                const totalAmount = payments.reduce((acc, cur) => {
                    return {
                        amountWithoutExplicitFee: acc.amountWithoutExplicitFee.plus(Big(cur.amount)),
                        explicitFee: acc.explicitFee.plus(Big(cur.explicitFee)),
                        explicitServiceCharge: acc.explicitServiceCharge.plus(Big(cur.explicitServiceCharge)),
                        serviceFee: acc.serviceFee.plus(Big(cur.serviceFee)),
                        implicitFee: acc.implicitFee.plus(Big(cur.implicitFee)),
                    }
                }, {
                    amountWithoutExplicitFee: Big('0.0'),
                    explicitFee: Big('0.0'),
                    explicitServiceCharge: Big('0.0'),
                    serviceFee: Big('0.0'),
                    implicitFee: Big('0.0'),
                })
                const multiPayment = await MultiPayment.create(context, {
                    dv: 1,
                    sender,
                    ...Object.fromEntries(Object.entries(totalAmount).map(([key, value]) => ([key, value.toFixed(2)]))),
                    currencyCode,
                    user: { connect: { id: context.authedItem.id } },
                    integration: { connect: { id: acquiringIntegration.id } },
                    payments: { connect: paymentIds },
                    // TODO(DOMA-1574): add correct category
                    serviceCategory: DEFAULT_MULTIPAYMENT_SERVICE_CATEGORY,
                })
                return {
                    dv: 1,
                    multiPaymentId: multiPayment.id,
                    webViewUrl: `${acquiringIntegration.hostUrl}${WEB_VIEW_PATH.replace('[id]', multiPayment.id)}`,
                    feeCalculationUrl: `${acquiringIntegration.hostUrl}${FEE_CALCULATION_PATH.replace('[id]', multiPayment.id)}`,
                    directPaymentUrl: `${acquiringIntegration.hostUrl}${DIRECT_PAYMENT_PATH.replace('[id]', multiPayment.id)}`,
                }
            },
        },
    ],

})

module.exports = {
    RegisterMultiPaymentService,
}
