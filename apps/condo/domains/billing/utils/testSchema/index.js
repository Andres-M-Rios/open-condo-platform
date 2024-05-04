/**
 * Generated by `createschema billing.BillingIntegration name:Text;`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const fs = require('fs')
const path = require('path')

const { faker } = require('@faker-js/faker')
const get = require('lodash/get')

const { throwIfError } = require('@open-condo/codegen/generate.test.utils')
const { generateGQLTestUtils } = require('@open-condo/codegen/generate.test.utils')
const conf = require('@open-condo/config')
const { makeLoggedInAdminClient, UploadingFile } = require('@open-condo/keystone/test.utils')

const { CONTEXT_FINISHED_STATUS } = require('@condo/domains/acquiring/constants/context')
const { BillingIntegration: BillingIntegrationGQL } = require('@condo/domains/billing/gql')
const { BillingIntegrationAccessRight: BillingIntegrationAccessRightGQL } = require('@condo/domains/billing/gql')
const { BillingIntegrationOrganizationContext: BillingIntegrationOrganizationContextGQL } = require('@condo/domains/billing/gql')
const { BillingIntegrationProblem: BillingIntegrationProblemGQL } = require('@condo/domains/billing/gql')
const { BillingProperty: BillingPropertyGQL } = require('@condo/domains/billing/gql')
const { BillingAccount: BillingAccountGQL } = require('@condo/domains/billing/gql')
const { BillingReceipt: BillingReceiptGQL } = require('@condo/domains/billing/gql')
const { BillingOrganization: BillingOrganizationGQL } = require('@condo/domains/billing/gql')
const { ResidentBillingReceipt: ResidentBillingReceiptGQL } = require('@condo/domains/billing/gql')
const { BillingRecipient: BillingRecipientGQL } = require('@condo/domains/billing/gql')
const { BillingCategory: BillingCategoryGQL } = require('@condo/domains/billing/gql')
const { BillingReceiptFile: BillingReceiptFileGQL } = require('@condo/domains/billing/gql')
const {
    REGISTER_BILLING_RECEIPTS_MUTATION,
    REGISTER_BILLING_RECEIPT_FILE_MUTATION,
    SEND_NEW_RECEIPT_MESSAGES_TO_RESIDENT_SCOPES_MUTATION,
    SEND_NEW_BILLING_RECEIPT_FILES_NOTIFICATIONS_MUTATION,
    VALIDATE_QRCODE_MUTATION,
    SUM_BILLING_RECEIPTS_QUERY,
} = require('@condo/domains/billing/gql')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganizationEmployee, createTestOrganizationEmployeeRole } = require('@condo/domains/organization/utils/testSchema')
const { registerNewOrganization } = require('@condo/domains/organization/utils/testSchema/Organization')
/* AUTOGENERATE MARKER <IMPORT> */
const { FLAT_UNIT_TYPE } = require('@condo/domains/property/constants/common')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { buildFakeAddressAndMeta } = require('@condo/domains/property/utils/testSchema/factories')
const { registerResidentByTestClient } = require('@condo/domains/resident/utils/testSchema')
const { registerServiceConsumerByTestClient } = require('@condo/domains/resident/utils/testSchema')
const { makeClientWithResidentUser, makeClientWithServiceUser } = require('@condo/domains/user/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')

const BillingIntegration = generateGQLTestUtils(BillingIntegrationGQL)
const BillingIntegrationAccessRight = generateGQLTestUtils(BillingIntegrationAccessRightGQL)
const BillingIntegrationOrganizationContext = generateGQLTestUtils(BillingIntegrationOrganizationContextGQL)
const BillingIntegrationProblem = generateGQLTestUtils(BillingIntegrationProblemGQL)
const BillingProperty = generateGQLTestUtils(BillingPropertyGQL)
const BillingAccount = generateGQLTestUtils(BillingAccountGQL)
const BillingReceipt = generateGQLTestUtils(BillingReceiptGQL)
const BillingOrganization = generateGQLTestUtils(BillingOrganizationGQL)
const ResidentBillingReceipt = generateGQLTestUtils(ResidentBillingReceiptGQL)
const BillingRecipient = generateGQLTestUtils(BillingRecipientGQL)
const BillingCategory = generateGQLTestUtils(BillingCategoryGQL)
const BillingReceiptFile = generateGQLTestUtils(BillingReceiptFileGQL)
/* AUTOGENERATE MARKER <CONST> */



const bannerVariants = [
    { bannerColor: '#9b9dfa', bannerTextColor: 'WHITE' },
    { bannerColor: 'linear-gradient(90deg, #4cd174 0%, #6db8f2 100%)', bannerTextColor: 'BLACK' },
    { bannerColor: '#d3e3ff', bannerTextColor: 'BLACK' },
]

function randomChoice (choices) {
    const index = Math.floor(Math.random() * choices.length)
    return choices[index]
}

async function createTestBillingIntegration (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const name = faker.company.name().replace(/ /, '-').toUpperCase() + ' TEST BILLING INTEGRATION'
    const currencyCode = 'RUB'

    const attrs = {
        dv: 1,
        sender,
        name,
        currencyCode,
        isHidden: true,
        shortDescription: faker.commerce.productDescription(),
        detailedDescription: faker.lorem.paragraphs(2),
        instruction: faker.lorem.paragraphs(5),
        targetDescription: faker.company.catchPhrase(),
        receiptsLoadingTime: `${faker.datatype.number({ min: 10, max: 100 })} days`,
        ...randomChoice(bannerVariants),
        ...extraAttrs,
    }
    const obj = await BillingIntegration.create(client, attrs)
    return [obj, attrs]
}

async function updateTestBillingIntegration (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingIntegration.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestBillingIntegrationAccessRight (client, integration, user, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!integration || !integration.id) throw new Error('no integration')
    if (!user || !user.id) throw new Error('no user')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        integration: { connect: { id: integration.id } },
        user: { connect: { id: user.id } },
        ...extraAttrs,
    }
    const obj = await BillingIntegrationAccessRight.create(client, attrs)
    return [obj, attrs]
}

async function updateTestBillingIntegrationAccessRight (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingIntegrationAccessRight.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestBillingIntegrationOrganizationContext (client, organization, integration, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!organization || !organization.id) throw new Error('no organization.id')
    if (!integration || !integration.id) throw new Error('no integration.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const settings = { dv: 1, 'billing data source': 'https://api.dom.gosuslugi.ru/' }
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
    const obj = await BillingIntegrationOrganizationContext.create(client, attrs)
    return [obj, attrs]
}

async function updateTestBillingIntegrationOrganizationContext (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingIntegrationOrganizationContext.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestBillingIntegrationProblem (client, context, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!context || !context.id) throw new Error('no context')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const title = faker.lorem.sentence(3)
    const message = faker.lorem.sentences(3)
    const meta = { username: faker.lorem.word(), server: faker.internet.url(), ip: faker.internet.ipv6() }

    const attrs = {
        dv: 1,
        sender,
        context: { connect: { id: context.id } },
        title, message, meta,
        ...extraAttrs,
    }
    const obj = await BillingIntegrationProblem.create(client, attrs)
    return [obj, attrs]
}

async function updateTestBillingIntegrationProblem (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingIntegrationProblem.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestBillingProperty (client, context, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const { address, addressMeta } = buildFakeAddressAndMeta()

    const attrs = {
        dv: 1,
        sender,
        context: { connect: { id: context.id } },
        raw: { foo: faker.lorem.words() },
        globalId: faker.random.alphaNumeric(10),
        address, addressMeta,
        meta: {
            test: 123,
        },
        ...extraAttrs,
    }
    const obj = await BillingProperty.create(client, attrs)
    return [obj, attrs]
}

async function createTestBillingProperties (client, contexts, extraAttrsArray = []) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrsArray = []

    for (let i = 0; i < contexts.length; i++) {
        attrsArray.push({
            data: {
                dv: 1,
                sender,
                context: { connect: { id: contexts[i].id } },
                raw: { foo: faker.lorem.words() },
                globalId: faker.random.alphaNumeric(10),
                address: faker.address.streetAddress(true),
                meta: {
                    test: 123,
                },
                ...get(extraAttrsArray, `${i}`, {}),
            },
        })
    }
    const objs = await BillingProperty.createMany(client, attrsArray)
    return [objs, attrsArray]
}

async function updateTestBillingProperty (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingProperty.update(client, id, attrs)
    return [obj, attrs]
}

async function updateTestBillingProperties (client, attrsArray) {
    if (!client) throw new Error('no client')
    if (!attrsArray.every(element => element.id)) throw new Error('no id for all elements')
    if (!attrsArray.every(element => element.data)) throw new Error('no data for all elements')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const extendedAttrsArray = attrsArray.map(element => ({
        id: element.id,
        data: {
            dv: 1,
            sender,
            ...element.data,
        },
    }))

    const obj = await BillingProperty.updateMany(client, extendedAttrsArray)
    return [obj, extendedAttrsArray]
}

async function createTestBillingAccount (client, context, property, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        context: { connect: { id: context.id } },
        property: { connect: { id: property.id } },
        raw: { foo: faker.lorem.words() },
        number: faker.random.alphaNumeric(8),
        unitName: faker.random.alphaNumeric(8),
        unitType: FLAT_UNIT_TYPE,
        meta: {
            dv: 1,
            test: 123,
        },
        ...extraAttrs,
    }
    const obj = await BillingAccount.create(client, attrs)
    return [obj, attrs]
}

async function createTestBillingAccounts (client, contexts, properties, extraAttrsArray = []) {
    if (!client) throw new Error('no client')
    if (!Array.isArray(contexts) || !contexts.length) throw new Error('no contexts')
    if (!Array.isArray(properties) || !properties.length) throw new Error('no properties')
    if (contexts.length !== properties.length) throw new Error('Contexts and properties not equal length')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrsArray = []

    for (let i = 0; i < contexts.length; i++) {
        attrsArray.push({
            data: {
                dv: 1,
                sender,
                context: { connect: { id: contexts[i].id } },
                property: { connect: { id: properties[i].id } },
                raw: { foo: faker.lorem.words() },
                number: faker.random.alphaNumeric(8),
                unitName: faker.random.alphaNumeric(8),
                unitType: FLAT_UNIT_TYPE,
                meta: {
                    dv: 1,
                    test: 123,
                },
                ...get(extraAttrsArray, `${i}`, {}),
            },
        })
    }
    const objs = await BillingAccount.createMany(client, attrsArray)
    return [objs, attrsArray]
}

async function updateTestBillingAccount (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingAccount.update(client, id, attrs)
    return [obj, attrs]
}

async function updateTestBillingAccounts (client, attrsArray) {
    if (!client) throw new Error('no client')
    if (!attrsArray.every(element => element.id)) throw new Error('no id for all elements')
    if (!attrsArray.every(element => element.data)) throw new Error('no data for all elements')

    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const extendedAttrsArray = attrsArray.map(element => ({
        id: element.id,
        data: {
            dv: 1,
            sender,
            ...element.data,
        },
    }))

    const obj = await BillingAccount.updateMany(client, extendedAttrsArray)
    return [obj, extendedAttrsArray]
}

async function createTestBillingReceipt (client, context, property, account, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        context: { connect: { id: context.id } },
        property: { connect: { id: property.id } },
        account: { connect: { id: account.id } },
        raw: { foo: faker.lorem.words() },
        period: '2020-12-01',
        importId: faker.random.alphaNumeric(8),
        toPay: (faker.datatype.number() + 50).toString(),
        recipient: createTestRecipient(),
        services: generateServicesData(1),
        toPayDetails: {
            formula: 'charge + penalty',
            charge: faker.datatype.number().toString(),
            penalty: faker.datatype.number().toString(),
        },
        ...extraAttrs,
    }
    const obj = await BillingReceipt.create(client, attrs)
    return [obj, attrs]
}

async function createTestBillingReceipts (client, contexts, properties, accounts, extraAttrsArray = []) {
    if (!client) throw new Error('no client')
    if (!Array.isArray(contexts) || !contexts.length) throw new Error('no contexts')
    if (!Array.isArray(properties) || !properties.length) throw new Error('no properties')
    if (!Array.isArray(accounts) || !accounts.length) throw new Error('no properties')
    if (contexts.length !== properties.length) throw new Error('Contexts and properties not equal length')
    if (contexts.length !== accounts.length) throw new Error('Contexts and accounts not equal length')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrsArray = []

    for (let i = 0; i < contexts.length; i++) {
        attrsArray.push({
            data: {
                dv: 1,
                sender,
                context: { connect: { id: contexts[i].id } },
                property: { connect: { id: properties[i].id } },
                account: { connect: { id: accounts[i].id } },
                raw: { foo: faker.lorem.words() },
                period: '2021-12-01',
                importId: faker.random.alphaNumeric(8),
                toPay: (faker.datatype.number() + 50).toString(),
                recipient: createTestRecipient(),
                services: generateServicesData(1),
                toPayDetails: {
                    formula: 'charge + penalty',
                    charge: faker.datatype.number().toString(),
                    penalty: faker.datatype.number().toString(),
                },
                ...get(extraAttrsArray, `${i}`, {}),
            },
        })
    }
    const objs = await BillingReceipt.createMany(client, attrsArray)
    return [objs, attrsArray]
}

async function updateTestBillingReceipt (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingReceipt.update(client, id, attrs)
    return [obj, attrs]
}

async function updateTestBillingReceipts (client, attrsArray) {
    if (!client) throw new Error('no client')
    if (!attrsArray.every(element => element.id)) throw new Error('no id for all elements')
    if (!attrsArray.every(element => element.data)) throw new Error('no data for all elements')

    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const extendedAttrsArray = attrsArray.map(element => ({
        id: element.id,
        data: {
            dv: 1,
            sender,
            ...element.data,
        },
    }))

    const obj = await BillingReceipt.updateMany(client, extendedAttrsArray)
    return [obj, extendedAttrsArray]
}

async function createTestBillingCategory (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        name: faker.lorem.words(),
        ...extraAttrs,
    }
    const obj = await BillingCategory.create(client, attrs)
    return [obj, attrs]
}

async function updateTestBillingCategory (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingCategory.update(client, id, attrs)
    return [obj, attrs]
}

const PUBLIC_FILE = path.resolve(conf.PROJECT_ROOT, 'apps/condo/domains/common/test-assets/dino.png')
const PRIVATE_FILE = path.resolve(conf.PROJECT_ROOT, 'apps/condo/domains/common/test-assets/simple-text-file.txt')

async function createTestBillingReceiptFile (client, receipt, context, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!receipt && !extraAttrs.importId) throw new Error('no way to set receipt')
    if (!context) throw new Error('no context')
    const receiptConnection = receipt ? { receipt: { connect: { id: receipt.id } } } : {}
    const contextConnection = { context: { connect: { id: context.id } } }
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        sensitiveDataFile:  new UploadingFile(PRIVATE_FILE),
        publicDataFile:  new UploadingFile(PUBLIC_FILE),
        controlSum: faker.random.alphaNumeric(20),
        ...receiptConnection,
        ...contextConnection,
        ...extraAttrs,
    }
    const obj = await BillingReceiptFile.create(client, attrs)
    return [obj, attrs]
}

async function updateTestBillingReceiptFile (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingReceiptFile.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestBillingRecipient (client, context, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!context.id) throw new Error('no context')

    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const recipient = createTestRecipient()
    const attrs = {
        dv: 1,
        sender,
        context: { connect: { id: context.id } },
        importId: faker.datatype.uuid(),
        ...recipient,
        purpose: `Payment for service from ${recipient.name}`,
        ...extraAttrs,
    }
    const obj = await BillingRecipient.create(client, attrs)
    return [obj, attrs]
}

async function updateTestBillingRecipient (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await BillingRecipient.update(client, id, attrs)
    return [obj, attrs]
}

async function makeClientWithIntegrationAccess () {
    const admin = await makeLoggedInAdminClient()
    const [integration, integrationAttrs] = await createTestBillingIntegration(admin)

    const client = await makeClientWithServiceUser()

    // add access
    await createTestBillingIntegrationAccessRight(admin, integration, client.user)

    client.integration = integration
    client.integrationAttrs = integrationAttrs
    return client
}

async function registerBillingReceiptsByTestClient (client, args, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!args) throw new Error('no data')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...args,
    }
    const { data, errors } = await client.mutate(REGISTER_BILLING_RECEIPTS_MUTATION, { data: attrs })

    if (!extraAttrs.raw) {
        throwIfError(data, errors)
    }

    return [data.result, errors, attrs]
}

async function registerBillingReceiptFileByTestClient (client, args = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        context: { id: faker.datatype.uuid() },
        receipt: { id: faker.datatype.uuid() },
        base64EncodedPDF: fs.readFileSync(PRIVATE_FILE).toString('base64'),
        ...args,
    }
    const { data, errors } = await client.mutate(REGISTER_BILLING_RECEIPT_FILE_MUTATION, { data: attrs })
    throwIfError(data, errors)
    return [data.result, attrs]
}

function createRegisterBillingReceiptsPayload (extraAttrs = {}) {
    const address = extraAttrs.address || faker.random.alphaNumeric(24)
    return {
        importId: faker.random.alphaNumeric(24),

        address,
        normalizedAddress: address,

        unitType: FLAT_UNIT_TYPE,
        accountNumber: faker.random.alphaNumeric(10),
        unitName: faker.random.alphaNumeric(14),

        toPay: '100.00',

        year: 2022,
        month: 3,

        category: { id: '928c97ef-5289-4daa-b80e-4b9fed50c629' },

        tin: faker.random.numeric(8),
        routingNumber: faker.random.alphaNumeric(8),
        bankAccount: faker.random.alphaNumeric(8),

        tinMeta: {
            iec: faker.random.alphaNumeric(8),
        },

        ...extraAttrs,
    }
}

/**
 * Simplifies creating series of instances
 */

async function addBillingIntegrationAndContext (client, organization, integrationExtraAttrs = {}, contextExtraAttrs = {}) {
    if (!organization || !organization.id) {
        throw new Error('No organization')
    }

    const [ billingIntegration ] = await createTestBillingIntegration(client, integrationExtraAttrs)
    const [ billingIntegrationContext ] = await createTestBillingIntegrationOrganizationContext(client, organization, billingIntegration, contextExtraAttrs)

    return {
        billingIntegration,
        billingIntegrationContext,
        client,
    }
}

async function makeContextWithOrganizationAndIntegrationAsAdmin ( integrationAttrs = {}, organizationAttrs = {}, contextAttrs = {}, processingBillingContext = false ) {
    let context
    const admin = await makeLoggedInAdminClient()
    const [integration] = await createTestBillingIntegration(admin, integrationAttrs)
    const [organization] = await registerNewOrganization(admin, organizationAttrs)
    ;[context] = await createTestBillingIntegrationOrganizationContext(admin, organization, integration, contextAttrs)
    if (!processingBillingContext) [context] = await updateTestBillingIntegrationOrganizationContext(admin, context.id, { status: CONTEXT_FINISHED_STATUS })

    return {
        context,
        integration,
        organization,
        admin,
    }
}

async function makeServiceUserForIntegration (integration) {
    const admin = await makeLoggedInAdminClient()
    const client = await makeClientWithServiceUser()
    const [accessRight] = await createTestBillingIntegrationAccessRight(admin, integration, client.user)
    client.accessRight = accessRight

    return client
}

async function makeOrganizationIntegrationManager ({ context, employeeRoleArgs } = {}) {
    const admin = await makeLoggedInAdminClient()
    let organization
    let integration
    if (context) {
        organization = get(context, ['organization'])
        integration = get(context, ['integration'])
    } else {
        [organization] = await createTestOrganization(admin)
        const [billingIntegration] = await createTestBillingIntegration(admin)
        integration = billingIntegration
    }
    const roleArgs = employeeRoleArgs || {
        canManageIntegrations: true,
        canReadBillingReceipts: true,
        canReadPayments: true,
    }
    const [role] = await createTestOrganizationEmployeeRole(admin, organization, roleArgs)
    const managerUserClient = await makeClientWithNewRegisteredAndLoggedInUser()
    const [managerEmployee] = await createTestOrganizationEmployee(admin, organization, managerUserClient.user, role)

    return { organization, integration, managerUserClient, managerEmployee }
}

async function createReceiptsReader (organization) {
    const admin = await makeLoggedInAdminClient()
    const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
        canReadBillingReceipts: true,
    })
    const client = await makeClientWithNewRegisteredAndLoggedInUser()
    await createTestOrganizationEmployee(admin, organization, client.user, role)
    return client
}

async function makeClientWithPropertyAndBilling ({ billingIntegrationContextArgs, billingPropertyArgs, billingAccountAttrs }) {
    const integrationClient = await makeClientWithIntegrationAccess()
    const integration = integrationClient.integration

    const client = await makeClientWithProperty()

    const [ context ] = await createTestBillingIntegrationOrganizationContext(client, client.organization, integration, billingIntegrationContextArgs)
    const [ property ] = await createTestBillingProperty(integrationClient, context, billingPropertyArgs)
    const [ account ] = await createTestBillingAccount(integrationClient, context, property, billingAccountAttrs)

    client.billingIntegration = integration
    client.billingIntegrationContext = context
    client.billingProperty = property
    client.billingAccount = account

    return { organizationClient: client, integrationClient: integrationClient }
}

function createTestRecipient (extra = {}) {
    const range = (length) => ({ min: Math.pow(10, length - 1), max: Math.pow(10, length) - 1 })
    const validRecipient = {
        name: faker.company.name(),
        tin: faker.datatype.number(range(10)).toString(),
        iec: faker.datatype.number(range(9)).toString(),
        bic: faker.finance.bic().toString(),
        bankAccount: faker.finance.account(12).toString(),
        bankName: faker.company.name(),
        territoryCode: faker.datatype.number().toString(),
        offsettingAccount: faker.finance.account(12).toString(),
    }
    return {
        ...validRecipient,
        ...extra,
    }
}

async function makeResidentClientWithOwnReceipt (existingResidentClient) {

    let residentClient = existingResidentClient
    if (!residentClient) {
        residentClient = await makeClientWithResidentUser()
    }

    const adminClient = await makeLoggedInAdminClient()
    const { context: contextCreated, integration, organization } = await makeContextWithOrganizationAndIntegrationAsAdmin()
    const [context] = await updateTestBillingIntegrationOrganizationContext(adminClient, contextCreated.id, { status: CONTEXT_FINISHED_STATUS })

    const [property] = await createTestProperty(adminClient, organization)

    const address = property.address
    const addressMeta = property.addressMeta

    const [resident] = await registerResidentByTestClient(residentClient, {
        address,
        addressMeta,
    })

    const unitName = resident.unitName
    const unitType = resident.unitType

    const [billingProperty] = await createTestBillingProperty(adminClient, context, {
        address,
    })
    const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty, {
        unitName,
        unitType,
    })
    const accountNumber = billingAccount.number

    const [serviceConsumer] = await registerServiceConsumerByTestClient(residentClient, {
        residentId: resident.id,
        accountNumber,
        organizationId: organization.id,
    })

    const [receipt] = await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)

    return {
        adminClient,
        residentClient,
        property,
        integration,
        context,
        organization,
        resident,
        billingProperty,
        billingAccount,
        serviceConsumer,
        receipt,
    }
}

/**
 *
 * @param client
 * @param extraAttrs
 * @returns {Promise<(*|{dv: number, sender: {dv: number, fingerprint: *}})[]>}
 */
async function sendNewReceiptMessagesToResidentScopesByTestClient (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')

    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = { dv: 1, sender, ...extraAttrs }
    const { data, errors } = await client.mutate(SEND_NEW_RECEIPT_MESSAGES_TO_RESIDENT_SCOPES_MUTATION, { data: attrs })

    if (!extraAttrs.raw)  throwIfError(data, errors)

    return [data.result, attrs]
}

async function validateQRCodeByTestClient (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const { data, errors } = await client.mutate(VALIDATE_QRCODE_MUTATION, { data: attrs })
    throwIfError(data, errors)
    return [data.result, attrs]
}


/** used to generate random services
 * @param {number} count the number of services to create
 * @param {string} toPay specific toPay amount. If not passed a random amount is used**/
function generateServicesData (count = 3, toPay = ''){
    const services = []

    for (let i = 0; i < count; i++){
        services.push({
            id: faker.datatype.number().toString(),
            name: faker.random.alphaNumeric(),
            toPay: toPay !== '' ? toPay : faker.datatype.number().toString(),
            toPayDetails: {
                formula: 'charge + penalty',
                charge: faker.datatype.number().toString(),
                penalty: faker.datatype.number().toString(),
            },
        })
    }
    return services
}

async function makeClientWithResidentAndServiceConsumer (property, billingAccount, organization = null) {
    const residentUser = await makeClientWithResidentUser()
    const [resident] = await registerResidentByTestClient(residentUser, {
        address: property.address,
        addressMeta: property.addressMeta,
        unitName: billingAccount.unitName,
    })
    residentUser.resident = resident
    const [serviceConsumer] = await registerServiceConsumerByTestClient(residentUser, {
        residentId: resident.id,
        accountNumber: billingAccount.number,
        organizationId: organization.id,
    })
    residentUser.serviceConsumer = serviceConsumer
    return residentUser
}

async function sendNewBillingReceiptFilesNotificationsByTestClient (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const { data, errors } = await client.mutate(SEND_NEW_BILLING_RECEIPT_FILES_NOTIFICATIONS_MUTATION, { data: attrs })
    throwIfError(data, errors)
    return [data.result, attrs]
}


async function sumBillingReceiptsByTestClient (client, where = {}) {
    if (!client) throw new Error('no client')

    const { data, errors } = await client.query(SUM_BILLING_RECEIPTS_QUERY, { where })
    throwIfError(data, errors)
    return data.result
}

module.exports = {
    BillingIntegration, createTestBillingIntegration, updateTestBillingIntegration,
    BillingIntegrationAccessRight, createTestBillingIntegrationAccessRight, updateTestBillingIntegrationAccessRight,
    makeClientWithIntegrationAccess,
    makeClientWithResidentAndServiceConsumer,
    BillingIntegrationOrganizationContext, createTestBillingIntegrationOrganizationContext, updateTestBillingIntegrationOrganizationContext,
    BillingProperty, createTestBillingProperty, createTestBillingProperties, updateTestBillingProperty, updateTestBillingProperties,
    BillingIntegrationProblem, createTestBillingIntegrationProblem, updateTestBillingIntegrationProblem,
    BillingAccount, createTestBillingAccount, createTestBillingAccounts, updateTestBillingAccount, updateTestBillingAccounts,
    BillingReceipt, createTestBillingReceipt, createTestBillingReceipts, updateTestBillingReceipt, updateTestBillingReceipts,
    makeContextWithOrganizationAndIntegrationAsAdmin,
    makeOrganizationIntegrationManager, addBillingIntegrationAndContext,
    BillingOrganization,
    ResidentBillingReceipt,
    createReceiptsReader,
    makeClientWithPropertyAndBilling,
    BillingRecipient, createTestBillingRecipient, updateTestBillingRecipient,
    createTestRecipient,
    BillingCategory, createTestBillingCategory, updateTestBillingCategory,
    makeResidentClientWithOwnReceipt,
    makeServiceUserForIntegration,
    registerBillingReceiptsByTestClient,
    createRegisterBillingReceiptsPayload,
    generateServicesData,
    sendNewReceiptMessagesToResidentScopesByTestClient,
    BillingReceiptFile, createTestBillingReceiptFile, updateTestBillingReceiptFile,
    PUBLIC_FILE, PRIVATE_FILE,
    validateQRCodeByTestClient,
    sendNewBillingReceiptFilesNotificationsByTestClient,
    sumBillingReceiptsByTestClient,
    registerBillingReceiptFileByTestClient,
/* AUTOGENERATE MARKER <EXPORTS> */
}


