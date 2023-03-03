const { getItems } = require('@keystonejs/server-side-graphql-client')
const Big = require('big.js')
const dayjs = require('dayjs')
const { isNil, get } = require('lodash')

const {
    PAYMENT_DONE_STATUS,
    PAYMENT_WITHDRAWN_STATUS,
} = require('@condo/domains/acquiring/constants/payment')
const {
    RECURRENT_PAYMENT_INIT_STATUS,
    RECURRENT_PAYMENT_DONE_STATUS,
    RECURRENT_PAYMENT_ERROR_NEED_RETRY_STATUS,
    RECURRENT_PAYMENT_ERROR_STATUS,
} = require('@condo/domains/acquiring/constants/recurrentPayment')
const {
    dvAndSender,
    PAYMENT_ERROR_UNKNOWN_CODE,
    PAYMENT_ERROR_LIMIT_EXCEEDED_CODE,
    PAYMENT_ERROR_CONTEXT_NOT_FOUND_CODE,
    PAYMENT_ERROR_CONTEXT_DISABLED_CODE,
    PAYMENT_ERROR_CARD_TOKEN_NOT_VALID_CODE,
    PAYMENT_ERROR_CAN_NOT_REGISTER_MULTI_PAYMENT_CODE,
} = require('@condo/domains/acquiring/tasks/utils/constants')
const {
    RecurrentPayment,
    RecurrentPaymentContext,
    Payment,
    registerMultiPayment: registerMultiPaymentMutation,
    MultiPayment,
} = require('@condo/domains/acquiring/utils/serverSchema')
const {
    BillingReceipt,
} = require('@condo/domains/billing/utils/serverSchema')

async function getReadyForProcessingContextPage (context, date, pageSize, offset, extraArgs = {}) {
    // calculate payment day
    const paymentDay = dayjs(date).date()
    const endOfMonthPaymentDay = dayjs(date).endOf('month').date()

    // proceed conditions
    const paymentDayCondition = paymentDay !== endOfMonthPaymentDay
        ? { paymentDay }
        : { paymentDay_gte: paymentDay }

    return await RecurrentPaymentContext.getAll(
        context, {
            enabled: true,
            autoPayReceipts: false,
            deletedAt: null,
            ...paymentDayCondition,
            ...extraArgs,
        }, {
            sortBy: 'id_ASC',
            first: pageSize,
            skip: offset,
        }
    )
}

async function getServiceConsumer (context, id) {
    const consumers = await getItems({
        context,
        listKey: 'ServiceConsumer',
        where: {
            id,
        },
        returnFields: 'id accountNumber billingIntegrationContext { id } resident { user { id } } deletedAt',
    })

    if (consumers.length === 0) {
        throw Error(`ServiceConsumer not found for id ${id}`)
    }
    const [consumer] = consumers

    if (consumer.deletedAt) {
        throw Error(`Found deleted serviceConsumer for id ${id}`)
    }

    return consumer
}

async function getReceiptsForServiceConsumer (context, date, { id: serviceConsumerId }, billingCategory) {
    const periodDate = dayjs(date)
    const period = periodDate.format('YYYY-MM-01')
    const serviceConsumer = await getServiceConsumer(context, serviceConsumerId)

    // select all ids
    const billingCategoryId = get(billingCategory, 'id')
    const billingAccountNumber = get(serviceConsumer, 'accountNumber')
    const billingIntegrationContextId = get(serviceConsumer, 'billingIntegrationContext.id')

    // validate them
    if (isNil(billingIntegrationContextId)) {
        throw Error(`Can not retrieve billing receipts for service consumer ${serviceConsumerId} since billingIntegrationContextId is empty`)
    }
    if (!billingAccountNumber) {
        throw Error(`Can not retrieve billing receipts for service consumer ${serviceConsumerId} since billingAccountNumber is empty`)
    }

    // prepare conditions
    const billingCategoryCondition = billingCategoryId ? { category: { id: billingCategoryId } } : {}
    const billingAccountCondition = { account: { number: billingAccountNumber } }
    const billingIntegrationContextCondition = { context: { id: billingIntegrationContextId } }
    const periodCondition = { period }

    // select data
    return await BillingReceipt.getAll(context, {
        ...billingCategoryCondition,
        ...billingAccountCondition,
        ...billingIntegrationContextCondition,
        ...periodCondition,
    })
}

async function filterPaidBillingReceipts (context, billingReceipts) {
    if (billingReceipts.length === 0) {
        return billingReceipts
    }

    // request payments that have specific statuses and receipts id in a list
    const payments = await Payment.getAll(context, {
        receipt: {
            id_in: billingReceipts.map(receipt => receipt.id),
        },
        status_in: [PAYMENT_DONE_STATUS, PAYMENT_WITHDRAWN_STATUS],
    })

    // map to receipt ids
    const payedBillIds = payments.map(payment => payment.receipt.id)

    return billingReceipts.filter(receipt => {
        const { id } = receipt

        return !payedBillIds.includes(id)
    })
}

async function getReadyForProcessingPaymentsPage (context, pageSize, offset, extraArgs) {
    return await RecurrentPayment.getAll(context, {
        OR: [ { payAfter: null }, { payAfter_lte: dayjs().toISOString() }],
        tryCount_lt: 5,
        status_in: [RECURRENT_PAYMENT_INIT_STATUS, RECURRENT_PAYMENT_ERROR_NEED_RETRY_STATUS],
        ...extraArgs,
    }, {
        sortBy: 'id_ASC',
        first: pageSize,
        skip: offset,
    })
}

async function registerMultiPayment (context, recurrentPayment) {
    const {
        id,
        billingReceipts,
        recurrentPaymentContext: {
            id: recurrentPaymentContextId,
        },
    } = recurrentPayment

    // retrieve context
    const recurrentContext = await RecurrentPaymentContext.getOne(context, {
        id: recurrentPaymentContextId,
        deletedAt: null,
    })

    // validate context
    if (!recurrentContext) {
        return {
            registered: false,
            errorCode: PAYMENT_ERROR_CONTEXT_NOT_FOUND_CODE,
            errorMessage: `RecurrentPaymentContext not found for RecurrentPayment(${id})`,
        }
    } else if (!recurrentContext.enabled) {
        return {
            registered: false,
            errorCode: PAYMENT_ERROR_CONTEXT_DISABLED_CODE,
            errorMessage: `RecurrentPaymentContext (${recurrentContext.id}) is disabled`,
        }
    }

    // filter billing receipts, since some of them can be already paid
    const notPaidReceipts = await filterPaidBillingReceipts(context, billingReceipts)

    // no bills to pay case
    if (notPaidReceipts.length === 0) {
        return { registered:false }
    }

    // get user context for registering multi payment
    const { resident: { user } } = await getServiceConsumer(context, recurrentContext.serviceConsumer.id)
    const userContext = await context.createContext({
        authentication: {
            item: user,
            listKey: 'User',
        },
    })

    // create multi payment
    const registerRequest = {
        ...dvAndSender,
        groupedReceipts: [{
            serviceConsumer: { id: recurrentContext.serviceConsumer.id },
            receipts: notPaidReceipts.map(receipt => ({ id: receipt.id })),
        }],
        recurrentPaymentContext: { id: recurrentContext.id },
    }

    // do register
    let registerResponse = null
    let registerError = null
    try {
        registerResponse = await registerMultiPaymentMutation(userContext, registerRequest)
    } catch (e) {
        registerError = get(e, 'errors[0].message') || get(e, 'message')
    }

    // failed to register multi payment
    if (!registerResponse || !registerResponse.multiPaymentId) {
        return {
            registered:false,
            errorCode: PAYMENT_ERROR_CAN_NOT_REGISTER_MULTI_PAYMENT_CODE,
            errorMessage: `Can not register multi payment: ${registerError}`,
        }
    }

    // get multi payment
    const multiPayment = await MultiPayment.getOne(context, {
        id: registerResponse.multiPaymentId,
    })

    // check limits for recurrent context
    // in case if limit is set up
    if (recurrentContext.limit && Big(multiPayment.amount).gt(Big(recurrentContext.limit))) {
        return {
            registered: false,
            errorCode: PAYMENT_ERROR_LIMIT_EXCEEDED_CODE,
            errorMessage: `RecurrentPaymentContext limit exceeded for multi payment ${multiPayment.id}`,
        }
    }

    return {
        registered: true,
        ...registerResponse,
    }
}

async function setRecurrentPaymentAsSuccess (context, recurrentPayment) {
    const {
        id,
        tryCount,
    } = recurrentPayment

    await RecurrentPayment.update(context, id, {
        ...dvAndSender,
        tryCount: tryCount + 1,
        status: RECURRENT_PAYMENT_DONE_STATUS,
    })

    // todo: send push notification to user
}

async function setRecurrentPaymentAsFailed (context, recurrentPayment, errorMessage, errorCode = PAYMENT_ERROR_UNKNOWN_CODE) {
    const {
        id,
        tryCount,
    } = recurrentPayment

    const nextTryCount = tryCount + 1
    let nextStatus = RECURRENT_PAYMENT_ERROR_NEED_RETRY_STATUS

    // cases when we have to deny retry
    if (nextTryCount >= 5
        || errorCode === PAYMENT_ERROR_LIMIT_EXCEEDED_CODE
        || errorCode === PAYMENT_ERROR_CONTEXT_NOT_FOUND_CODE
        || errorCode === PAYMENT_ERROR_CONTEXT_DISABLED_CODE
        || errorCode === PAYMENT_ERROR_CARD_TOKEN_NOT_VALID_CODE) {
        nextStatus = RECURRENT_PAYMENT_ERROR_STATUS
    }

    // update tryCount/status/state
    await RecurrentPayment.update(context, id, {
        ...dvAndSender,
        tryCount: nextTryCount,
        status: nextStatus,
        state: {
            errorCode,
            errorMessage,
        },
    })

    // todo send push notification to user
}

module.exports = {
    getReadyForProcessingContextPage,
    getServiceConsumer,
    getReceiptsForServiceConsumer,
    filterPaidBillingReceipts,
    getReadyForProcessingPaymentsPage,
    registerMultiPayment,
    setRecurrentPaymentAsSuccess,
    setRecurrentPaymentAsFailed,
}