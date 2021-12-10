/**
 * Generated by `createschema acquiring.AcquiringIntegration 'name:Text;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const faker = require('faker')
const get = require('lodash/get')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestResident, createTestServiceConsumer } = require('@condo/domains/resident/utils/testSchema')
const {
    createTestBillingIntegration,
    createTestBillingIntegrationOrganizationContext,
    createTestBillingAccount,
    createTestBillingProperty,
    createTestBillingReceipt,
} = require('@condo/domains/billing/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')
const { createTestOrganizationEmployee, createTestOrganizationEmployeeRole } = require('@condo/domains/organization/utils/testSchema')

const { generateGQLTestUtils, throwIfError } = require('@condo/domains/common/utils/codegeneration/generate.test.utils')
const { MULTIPAYMENT_INIT_STATUS } = require('@condo/domains/acquiring/constants/payment')
const { makeLoggedInAdminClient } = require('@core/keystone/test.utils')
const { makeClientWithResidentUser } = require('@condo/domains/user/utils/testSchema')
const { registerNewOrganization } = require('@condo/domains/organization/utils/testSchema/Organization')

const { AcquiringIntegration: AcquiringIntegrationGQL } = require('@condo/domains/acquiring/gql')
const { AcquiringIntegrationAccessRight: AcquiringIntegrationAccessRightGQL } = require('@condo/domains/acquiring/gql')
const { AcquiringIntegrationContext: AcquiringIntegrationContextGQL } = require('@condo/domains/acquiring/gql')
const { MultiPayment: MultiPaymentGQL } = require('@condo/domains/acquiring/gql')
const { Payment: PaymentGQL } = require('@condo/domains/acquiring/gql')

const dayjs = require('dayjs')
const Big = require('big.js')
const { MULTIPAYMENT_DONE_STATUS } = require(
    '@condo/domains/acquiring/constants/payment')
const { PAYMENT_DONE_STATUS } = require(
    '@condo/domains/acquiring/constants/payment')
const { REGISTER_MULTI_PAYMENT_MUTATION } = require('@condo/domains/acquiring/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const AcquiringIntegration = generateGQLTestUtils(AcquiringIntegrationGQL)
const AcquiringIntegrationAccessRight = generateGQLTestUtils(AcquiringIntegrationAccessRightGQL)
const AcquiringIntegrationContext = generateGQLTestUtils(AcquiringIntegrationContextGQL)
const MultiPayment = generateGQLTestUtils(MultiPaymentGQL)
const Payment = generateGQLTestUtils(PaymentGQL)
/* AUTOGENERATE MARKER <CONST> */

function getRandomHiddenCard() {
    const prefix = Math.floor(Math.random() * 9000 + 1000)
    const suffix = Math.floor(Math.random() * 9000 + 1000)
    return `${prefix}********${suffix}`
}

function getRandomFeeDistribution() {
    const border = Math.random() * 6
    const result = []
    for (let i = 0; i < border; i++) {
        result.push({
            recipient: faker.company.companyName(),
            percent: String(Math.round(Math.random() * 99 + 1) / 100)
        })
    }
    return result
}

async function createTestAcquiringIntegration (client, billings, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!billings) throw new Error('no billings')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const name = faker.company.companyName().replace(/ /, '-').toUpperCase() + ' TEST ACQUIRING'
    const hostUrl = faker.internet.url()
    const billingsIds = billings.map(billing => ({id: billing.id}))
    const attrs = {
        dv: 1,
        sender,
        name,
        hostUrl,
        supportedBillingIntegrations: { connect: billingsIds },
        explicitFeeDistributionSchema: getRandomFeeDistribution(),
        ...extraAttrs
    }
    const obj = await AcquiringIntegration.create(client, attrs)
    return [obj, attrs]
}

async function updateTestAcquiringIntegration (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await AcquiringIntegration.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestAcquiringIntegrationAccessRight (client, integration, user, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!integration || !integration.id) throw new Error('no integration')
    if (!user || !user.id) throw new Error('no user')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        integration: { connect: {id: integration.id } },
        user: { connect: { id: user.id } },
        ...extraAttrs,
    }
    const obj = await AcquiringIntegrationAccessRight.create(client, attrs)
    return [obj, attrs]
}

async function updateTestAcquiringIntegrationAccessRight (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await AcquiringIntegrationAccessRight.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestAcquiringIntegrationContext (client, organization, integration, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!organization || !organization.id) throw new Error('no organization.id')
    if (!integration || !integration.id) throw new Error('no integration.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const settings = { dv: 1 }
    const state = { dv: 1 }

    const attrs = {
        dv: 1,
        sender,
        integration: { connect: { id: integration.id } },
        organization: { connect: { id: organization.id } },
        settings,
        state,
        ...extraAttrs,
    }
    const obj = await AcquiringIntegrationContext.create(client, attrs)
    return [obj, attrs]
}

async function updateTestAcquiringIntegrationContext (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await AcquiringIntegrationContext.update(client, id, attrs)
    return [obj, attrs]
}

async function makeAcquiringContext () {
    const admin = await makeLoggedInAdminClient()
    const [integration] = await createTestAcquiringIntegration(admin)
    const [organization] = await registerNewOrganization(admin)
    const [context] = await createTestAcquiringIntegrationContext(admin, organization, integration)
    return context
}

async function makeAcquiringContextAndIntegrationManager() {
    const admin = await makeLoggedInAdminClient()
    const [integration] = await createTestAcquiringIntegration(admin)
    const [organization] = await registerNewOrganization(admin)
    const [context] = await createTestAcquiringIntegrationContext(admin, organization, integration)
    const client = await makeClientWithNewRegisteredAndLoggedInUser()
    const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
        canManageIntegrations: true,
    })
    await createTestOrganizationEmployee(admin, organization, client.user, role)

    return {
        context,
        client
    }
}

async function addAcquiringIntegrationAndContext(client, organization, allowedBillingIntegrationIds = []) {
    if (!organization || !organization.id) {
        throw ('No organization')
    }

    const [ acquiringIntegration ] = await createTestAcquiringIntegration(client, allowedBillingIntegrationIds)
    const [ acquiringIntegrationContext ] = await createTestAcquiringIntegrationContext(client, organization, acquiringIntegration)

    return {
        acquiringIntegration,
        acquiringIntegrationContext,
        client
    }
}

async function makeAcquiringContextAndIntegrationAccount() {
    const admin = await makeLoggedInAdminClient()
    const [integration] = await createTestAcquiringIntegration(admin)
    const [context] = await createTestAcquiringIntegrationContext(admin, organization, integration)
    const client = await makeClientWithNewRegisteredAndLoggedInUser()
    await createTestAcquiringIntegrationAccessRight(admin, integration, client.user)
    return {
        context,
        client
    }
}

async function createTestMultiPayment (client, payments, user, integration, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!payments) throw new Error('no payments')
    if (!user) throw new Error('no user')
    if (!integration) throw new Error('no integration')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const amountWithoutExplicitFee = payments.reduce((acc, cur) => acc.plus(cur.amount), Big(0)).toString()
    const explicitFee = payments.reduce((acc, cur) => acc.plus(cur.explicitFee || '0'), Big(0)).toString()

    const attrs = {
        dv: 1,
        sender,
        amountWithoutExplicitFee,
        explicitFee,
        currencyCode: 'RUB',
        serviceCategory: 'TEST DOCUMENT',
        status: MULTIPAYMENT_INIT_STATUS,
        user: { connect: { id: user.id } },
        payments: { connect: payments.map(payment => ({id: payment.id})) },
        integration: { connect: { id: integration.id } },
        ...extraAttrs,
    }
    const obj = await MultiPayment.create(client, attrs)
    return [obj, attrs]
}

// todo @toplenboren (why do we need to use params? maybe add some generic solution?)
async function updateTestMultiPayment (client, id, extraAttrs = {}, params = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await MultiPayment.update(client, id, attrs, params)
    return [obj, attrs]
}

async function createTestPayment (client, organization, receipt=null, context=null, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!organization || !organization.id) throw new Error('no organization.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const amount = receipt ? receipt.toPay : String(Math.round(Math.random() * 100000) / 100 + 100)
    const explicitFee = String(Math.floor(Math.random() * 100) / 2)
    const implicitFee = String(Math.floor(Math.random() * 100) / 2)
    const period = dayjs().format('YYYY-MM-01')
    const contextId = get(context, 'id')
    const receiptId = get(receipt, 'id')

    const attrs = {
        dv: 1,
        sender,
        amount,
        explicitFee,
        implicitFee,
        currencyCode: 'RUB',
        advancedAt: dayjs().toISOString(),
        accountNumber: String(faker.datatype.number()),
        receipt: receiptId ? { connect: { id: receipt.id } } : null,
        frozenReceipt: receiptId ? { dv: 1, data: receipt } : null,
        organization: { connect: { id: organization.id } },
        context: contextId ? { connect: {id: contextId} } : null,
        period,
        ...extraAttrs,
    }
    const obj = await Payment.create(client, attrs)
    return [obj, attrs]
}

async function updateTestPayment (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await Payment.update(client, id, attrs)
    return [obj, attrs]
}

async function registerMultiPaymentByTestClient(client, groupedReceipts, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        groupedReceipts,
        ...extraAttrs,
    }
    const { data, errors } = await client.mutate(REGISTER_MULTI_PAYMENT_MUTATION, { data: attrs })
    throwIfError(data, errors)
    return [data.result, attrs]
}
/* AUTOGENERATE MARKER <FACTORY> */

// Utils used to generate bunch of entities for working with MultiPayments
async function makePayer (receiptsAmount = 1) {
    const client = await makeClientWithResidentUser()
    const admin = await makeLoggedInAdminClient()

    const [organization] = await registerNewOrganization(admin)
    const [property] = await createTestProperty(admin, organization)

    const [billingIntegration] = await createTestBillingIntegration(admin)
    const [billingContext] = await createTestBillingIntegrationOrganizationContext(admin, organization, billingIntegration)
    const [billingProperty] = await createTestBillingProperty(admin, billingContext, {address: property.address})
    const [billingAccount] = await createTestBillingAccount(admin, billingContext, billingProperty)
    const billingReceipts = []
    for (let i = 0; i < receiptsAmount; i++) {
        const [receipt] = await createTestBillingReceipt(admin, billingContext, billingProperty, billingAccount)
        billingReceipts.push(receipt)
    }

    const [acquiringIntegration] = await createTestAcquiringIntegration(admin, [billingIntegration])
    const [acquiringContext] = await createTestAcquiringIntegrationContext(admin, organization, acquiringIntegration)

    const [resident] = await createTestResident(admin, client.user, organization, property)
    const [serviceConsumer] = await createTestServiceConsumer(admin, resident, organization , {
        billingAccount: { connect: { id: billingAccount.id } },
        acquiringIntegrationContext: { connect: {id: acquiringContext.id} },
        billingIntegrationContext: { connect: { id: billingContext.id } }
    })

    return {
        admin,
        client,
        organization,
        property,
        acquiringIntegration,
        acquiringContext,
        billingIntegration,
        billingContext,
        billingProperty,
        billingAccount,
        billingReceipts,
        resident,
        serviceConsumer,
    }
}

async function makePayerWithMultipleConsumers(consumersAmount = 1, receiptsAmount = 1) {
    const client = await makeClientWithResidentUser()
    const admin = await makeLoggedInAdminClient()
    const billings = []
    const result = []
    for (let i = 0; i < consumersAmount; i++) {
        const [organization] = await registerNewOrganization(admin)
        const [property] = await createTestProperty(admin, organization)
        const [billingIntegration] = await createTestBillingIntegration(admin)
        billings.push(billingIntegration)
        const [billingContext] = await createTestBillingIntegrationOrganizationContext(admin, organization, billingIntegration)
        const [billingProperty] = await createTestBillingProperty(admin, billingContext, {address: property.address})
        const [billingAccount] = await createTestBillingAccount(admin, billingContext, billingProperty)
        const billingReceipts = []
        for (let j = 0; j < receiptsAmount; j++) {
            const [receipt] = await createTestBillingReceipt(admin, billingContext, billingProperty, billingAccount)
            billingReceipts.push(receipt)
        }
        result.push({
            organization,
            property,
            billingIntegration,
            billingContext,
            billingProperty,
            billingAccount,
            billingReceipts
        })
    }
    const [acquiringIntegration] = await createTestAcquiringIntegration(admin, billings, {
        canGroupReceipts: true
    })
    for (let i = 0; i < consumersAmount; i++) {
        const organization = result[i].organization
        const property = result[i].property
        const billingAccount = result[i].billingAccount
        const billingContext = result[i].billingContext
        const [acquiringContext] = await createTestAcquiringIntegrationContext(admin, organization, acquiringIntegration)
        const [resident] = await createTestResident(admin, client.user, organization, property)
        const [serviceConsumer] = await createTestServiceConsumer(admin, resident, organization, {
            acquiringIntegrationContext: { connect: {id: acquiringContext.id} },
            billingIntegrationContext: { connect: { id: billingContext.id } },
            billingAccount: { connect: { id: billingAccount.id } },
        })
        result[i].acquiringContext = acquiringContext
        result[i].resident = resident
        result[i].serviceConsumer = serviceConsumer
    }
    const commonData = {
        client,
        admin,
        acquiringIntegration
    }
    return {
        commonData,
        batches: result
    }
}

async function makePayerAndPayments (receiptsAmount = 1) {
    const data = await makePayer(receiptsAmount)
    const { admin, billingReceipts, acquiringContext, organization } = data
    const payments = []
    for (let i = 0; i < billingReceipts.length; i++) {
        const [payment] = await createTestPayment(admin, organization, billingReceipts[i], acquiringContext)
        payments.push(payment)
    }

    return {
        ...data,
        payments
    }
}

/**
 * Handles simplified payment case: 1 MultiPayment 1 Receipt 1 Payment
 * As a resident pay for single billing receipt with specified <amount>,
 * As an integrationClient complete payment
 *
 * Currently working with fees is not implemented
 *
 * @param {Object} residentClient
 * @param {Object} integrationClient
 * @param {string} serviceConsumerId
 * @param {string} receiptId
 * @param {Object} extra
 * @return {Promise<{doneMultiPayment: ({data: *, errors: *}|*)}>}
 */
async function completeTestPayment(residentClient, integrationClient, serviceConsumerId, receiptId, extra = {}) {
    const registerMultiPaymentPayload = {
        consumerId: serviceConsumerId,
        receipts: [{id: receiptId}],
    }
    const [ { multiPaymentId } ] = await registerMultiPaymentByTestClient(residentClient, registerMultiPaymentPayload)

    // Acquiring integration makes payment and multiPayment done
    const [ multiPayment ] = await MultiPayment.getAll(integrationClient, { id: multiPaymentId })
    await updateTestPayment(integrationClient, multiPayment.payments[0].id, {
        explicitFee: '0.0',
        advancedAt: dayjs().toISOString(),
        status: PAYMENT_DONE_STATUS,
    })
    const multiPaymentDonePayload = {
        explicitFee: '0.0',
        withdrawnAt: dayjs().toISOString(),
        cardNumber: getRandomHiddenCard(),
        paymentWay: 'CARD',
        transactionId: faker.datatype.uuid(),
        status: MULTIPAYMENT_DONE_STATUS,
    }
    const [ doneMultiPayment ] = await updateTestMultiPayment(integrationClient, multiPayment.id, multiPaymentDonePayload)

    return { doneMultiPayment }
}

module.exports = {
    AcquiringIntegration, createTestAcquiringIntegration, updateTestAcquiringIntegration,
    AcquiringIntegrationAccessRight, createTestAcquiringIntegrationAccessRight, updateTestAcquiringIntegrationAccessRight,
    AcquiringIntegrationContext, createTestAcquiringIntegrationContext, updateTestAcquiringIntegrationContext,
    MultiPayment, createTestMultiPayment, updateTestMultiPayment, addAcquiringIntegrationAndContext,
    makeAcquiringContext,
    makeAcquiringContextAndIntegrationAccount,
    makeAcquiringContextAndIntegrationManager,
    Payment, createTestPayment, updateTestPayment,
    makePayer,
    makePayerAndPayments,
    getRandomHiddenCard,
    registerMultiPaymentByTestClient,
    makePayerWithMultipleConsumers,
    completeTestPayment
/* AUTOGENERATE MARKER <EXPORTS> */
}
