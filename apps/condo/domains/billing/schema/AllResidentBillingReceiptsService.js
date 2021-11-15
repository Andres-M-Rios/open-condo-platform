/**
 * Generated by `createservice billing.BillingReceiptsService --type queries`
 */

const { ServiceConsumer } = require('@condo/domains/resident/utils/serverSchema')
const { BillingReceipt } = require('@condo/domains/billing/utils/serverSchema')
const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('../access/AllResidentBillingReceipts')
const { generateQuerySortBy } = require('@condo/domains/common/utils/codegeneration/generate.gql')
const { generateQueryWhereInput } = require('@condo/domains/common/utils/codegeneration/generate.gql')
const { pick, get } = require('lodash')
const {
    BILLING_RECEIPT_RECIPIENT_FIELD_NAME,
    BILLING_RECEIPT_TO_PAY_DETAILS_FIELD_NAME,
    BILLING_RECEIPT_SERVICES_FIELD,
} = require('@condo/domains/billing/constants')

const fieldsObj = {
    id: 'ID',
    period: 'String',
    toPay: 'String',
    printableNumber: 'String',
    serviceConsumer: 'ServiceConsumer',
}


const GetAllResidentBillingReceiptsService = new GQLCustomSchema('GetAllResidentBillingReceiptsService', {
    types: [
        {
            access: true,
            type: generateQueryWhereInput('ResidentBillingReceipt', fieldsObj),
        },
        {
            access: true,
            type: generateQuerySortBy('ResidentBillingReceipt', Object.keys(fieldsObj)),
        },
        {
            access: true,
            type: `type ResidentBillingReceiptOutput { dv: String!, recipient: ${BILLING_RECEIPT_RECIPIENT_FIELD_NAME}!, id: ID!, period: String!, toPay: String!, printableNumber: String, toPayDetails: ${BILLING_RECEIPT_TO_PAY_DETAILS_FIELD_NAME}, services: ${BILLING_RECEIPT_SERVICES_FIELD}, serviceConsumer: ServiceConsumer! }`,
        },
    ],
    
    queries: [
        {
            access: access.canGetAllResidentBillingReceipts,
            schema: 'allResidentBillingReceipts (where: ResidentBillingReceiptWhereInput, first: Int, skip: Int, sortBy: [SortResidentBillingReceiptsBy!]): [ResidentBillingReceiptOutput]',
            resolver: async (parent, args, context = {}) => {
                const { where, first, skip, sortBy } = args

                const serviceConsumerWhere = get(where, 'serviceConsumer', {})
                const receiptsWhere = pick(where, ['id', 'period', 'toPay', 'printableNumber'])

                const userId = get(context, ['authedItem', 'id'])
                if (!userId) { // impossible, but who knows
                    throw new Error('Invalid user id!')
                }

                // We can't really use getting service consumer with all access here, since we do not show billingAccount to our user
                const GET_ONLY_OWN_SERVICE_CONSUMER_WHERE = { user: { id: userId } }
                if (!serviceConsumerWhere.resident) {
                    serviceConsumerWhere.resident = GET_ONLY_OWN_SERVICE_CONSUMER_WHERE
                    serviceConsumerWhere.deletedAt = null
                } else {
                    serviceConsumerWhere.resident.user = GET_ONLY_OWN_SERVICE_CONSUMER_WHERE.user
                    serviceConsumerWhere.deletedAt = null
                }

                const allServiceConsumers = (await ServiceConsumer.getAll(context, serviceConsumerWhere))
                    .filter(consumer => get(consumer, ['billingAccount', 'id']))
                if (!Array.isArray(allServiceConsumers) || !allServiceConsumers.length) {
                    return []
                }
                const billingReceipts = []
                for (let i = 0; i < allServiceConsumers.length; ++i) {
                    const receiptsQuery = { ...receiptsWhere, ...{ account: { id: allServiceConsumers[i].billingAccount.id } } }

                    const billingReceiptsForConsumer = await BillingReceipt.getAll(
                        context,
                        receiptsQuery,
                        {
                            sortBy, first, skip,
                        }
                    )

                    billingReceipts.push(
                        billingReceiptsForConsumer.map(
                            receipt => ({
                                id: receipt.id,
                                dv: receipt.dv,
                                recipient: receipt.recipient,
                                period: receipt.period,
                                toPay: receipt.toPay,
                                toPayDetails: receipt.toPayDetails,
                                services: receipt.services,
                                printableNumber: receipt.printableNumber,
                                serviceConsumer: allServiceConsumers[i],
                            })
                        ))
                }

                return billingReceipts.flat()
            },
        },
    ],
})

module.exports = {
    GetAllResidentBillingReceiptsService,
}
