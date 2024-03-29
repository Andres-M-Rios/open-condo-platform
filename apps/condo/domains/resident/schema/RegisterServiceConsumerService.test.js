/**
 * Generated by `createservice resident.RegisterServiceConsumerService --type mutations`
 */
const { faker } = require('@faker-js/faker')


const { makeClient, expectToThrowGQLError } = require('@open-condo/keystone/test.utils')
const { makeLoggedInAdminClient } = require('@open-condo/keystone/test.utils')
const {
    catchErrorFrom,
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
} = require('@open-condo/keystone/test.utils')

const { CONTEXT_FINISHED_STATUS } = require('@condo/domains/acquiring/constants/context')
const { addAcquiringIntegrationAndContext } = require('@condo/domains/acquiring/utils/testSchema')
const { addBillingIntegrationAndContext } = require('@condo/domains/billing/utils/testSchema')
const {
    createTestBillingProperty,
    createTestBillingAccount,
    createTestBillingIntegration,
    createTestBillingIntegrationOrganizationContext,
    makeContextWithOrganizationAndIntegrationAsAdmin,
    updateTestBillingIntegrationOrganizationContext,
} = require('@condo/domains/billing/utils/testSchema')
const { NOT_FOUND } = require('@condo/domains/common/constants/errors')
const {
    COLD_WATER_METER_RESOURCE_ID,
    HOT_WATER_METER_RESOURCE_ID,
} = require('@condo/domains/meter/constants/constants')
const { MeterResource, createTestMeter, Meter } = require('@condo/domains/meter/utils/testSchema')
const { SERVICE_PROVIDER_TYPE } = require('@condo/domains/organization/constants/common')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const {
    createTestProperty,
    makeClientWithProperty,
} = require('@condo/domains/property/utils/testSchema')
const {
    registerServiceConsumerByTestClient,
    updateTestServiceConsumer,
    createTestResident,
    updateTestResident,
    registerResidentServiceConsumersByTestClient,
} = require('@condo/domains/resident/utils/testSchema')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { updateTestUser, makeClientWithResidentUser } = require('@condo/domains/user/utils/testSchema')


describe('RegisterResidentServiceConsumers', () => {
    let adminClient
    let residentClient
    let anonymousClient

    let organization

    beforeAll(async () => {
        adminClient = await makeLoggedInAdminClient()
        residentClient = await makeClientWithResidentUser()
        anonymousClient = await makeClient()

        organization = (await createTestOrganization(adminClient))[0]
    })

    describe('Admin', () => {
        it('can register ServiceConsumer via this mutation', async () => {
            const [property] = await createTestProperty(adminClient, organization)
            const unitName = faker.random.alphaNumeric(8)
            const accountNumber = faker.random.alphaNumeric(8)

            const [resident] = await createTestResident(adminClient, residentClient.user, property, {
                unitName,
            })

            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {
                accountNumber, unitName,
            })

            const [data] = await registerResidentServiceConsumersByTestClient(adminClient, {
                resident: { id: resident.id },
                accountNumber,
            })

            expect(data).toHaveLength(1)
            expect(data[0]).toHaveProperty(['organization', 'id'], organization.id)
            expect(data[0]).toHaveProperty(['resident', 'id'], resident.id)
            expect(data[0]).toHaveProperty('accountNumber', meter.accountNumber)
        })
    })
    describe('Resident', () => {
        it('can register ServiceConsumer if organization has connected billing', async () => {
            const { organization, context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            await updateTestBillingIntegrationOrganizationContext(adminClient, context.id, { status: CONTEXT_FINISHED_STATUS })
            const [property] = await createTestProperty(adminClient, organization)
            const [billingProperty] = await createTestBillingProperty(adminClient, context, {
                address: property.address,
            })
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)
            const {
                acquiringIntegration,
                acquiringIntegrationContext,
            } = await addAcquiringIntegrationAndContext(adminClient, organization, {}, {
                status: CONTEXT_FINISHED_STATUS,
            })

            const [resident] = await createTestResident(adminClient, residentClient.user, property, {
                unitName: billingAccount.unitName,
            })

            const [data] = await registerResidentServiceConsumersByTestClient(residentClient, {
                resident: { id: resident.id },
                accountNumber: billingAccount.number,
            })

            expect(data).toHaveLength(1)
            expect(data[0]).toHaveProperty(['organization', 'id'], organization.id)
            expect(data[0]).toHaveProperty('accountNumber', billingAccount.number)
            expect(data[0]).toHaveProperty(['resident', 'id'], resident.id)
            expect(data[0]).toHaveProperty(['residentAcquiringIntegrationContext', 'id'], acquiringIntegrationContext.id)
            expect(data[0]).toHaveProperty(['residentAcquiringIntegrationContext', 'integration', 'id'], acquiringIntegration.id)
            expect(data[0]).toHaveProperty(['residentAcquiringIntegrationContext', 'integration', 'hostUrl'], acquiringIntegration.hostUrl)
        })

        it('doesn\'t create same ServiceConsumer twice', async () => {
            const { organization, context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            await updateTestBillingIntegrationOrganizationContext(adminClient, context.id, { status: CONTEXT_FINISHED_STATUS })
            const [property] = await createTestProperty(adminClient, organization)
            const [billingProperty] = await createTestBillingProperty(adminClient, context, {
                address: property.address,
            })
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)
            const [resident] = await createTestResident(adminClient, residentClient.user, property, {
                unitName: billingAccount.unitName,
            })

            const [data] = await registerResidentServiceConsumersByTestClient(residentClient, {
                resident: { id: resident.id },
                accountNumber: billingAccount.number,
            })

            expect(data).toHaveLength(1)

            const [newData] = await registerResidentServiceConsumersByTestClient(residentClient, {
                resident: { id: resident.id },
                accountNumber: billingAccount.number,
            })

            expect(newData).toHaveLength(1)
            expect(newData[0]).toHaveProperty('id', data[0].id)
        })

        it('can restore existing ServiceConsumer after softDelete operation', async () => {
            const { organization, context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            await updateTestBillingIntegrationOrganizationContext(adminClient, context.id, { status: CONTEXT_FINISHED_STATUS })
            const [property] = await createTestProperty(adminClient, organization)
            const [billingProperty] = await createTestBillingProperty(adminClient, context, {
                address: property.address,
            })
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)

            const [resident] = await createTestResident(adminClient, residentClient.user, property, {
                unitName: billingAccount.unitName,
            })

            const [data] = await registerResidentServiceConsumersByTestClient(residentClient, {
                resident: { id: resident.id },
                accountNumber: billingAccount.number,
            })

            expect(data).toHaveLength(1)
            expect(data[0]).toHaveProperty(['resident', 'id'], resident.id)
            expect(data[0]).toHaveProperty(['organization', 'id'], organization.id)
            expect(data[0]).toHaveProperty('accountNumber', billingAccount.number)

            await updateTestServiceConsumer(residentClient, data[0].id, { deletedAt: data[0].createdAt })

            const [restoredData] = await registerResidentServiceConsumersByTestClient(residentClient, {
                resident: { id: resident.id },
                accountNumber: billingAccount.number,
            })

            expect(restoredData).toHaveLength(1)
            expect(restoredData[0]).toHaveProperty('id', data[0].id)
            expect(restoredData[0]).toHaveProperty(['resident', 'id'], data[0].resident.id)
            expect(restoredData[0]).toHaveProperty('accountNumber', data[0].accountNumber)
        })

        it('creates ServiceConsumer if organization has Meter with same accountNumber', async () => {
            const [property] = await createTestProperty(adminClient, organization)
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const unitName = faker.random.alphaNumeric(8)
            const accountNumber = faker.random.alphaNumeric(8)
            const [resident] = await createTestResident(adminClient, residentClient.user, property, {
                unitName,
            })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {
                unitName, accountNumber,
            })

            const [data] = await registerResidentServiceConsumersByTestClient(residentClient, {
                resident: { id: resident.id },
                accountNumber,
            })

            expect(data).toHaveLength(1)
            expect(data[0]).toHaveProperty(['resident', 'id'], resident.id)
            expect(data[0]).toHaveProperty(['organization', 'id'], organization.id)
            expect(data[0]).toHaveProperty('accountNumber', meter.accountNumber)
        })

        it('creates 2 ServiceConsumers for 2 organizations based on resident address equality', async () => {
            const [serviceProviderOrganization] = await createTestOrganization(adminClient, {
                type: SERVICE_PROVIDER_TYPE,
            })
            const [property] = await createTestProperty(adminClient, organization)
            const [serviceProviderProperty] = await createTestProperty(adminClient, serviceProviderOrganization, {
                address: property.address,
            })
            const unitName = faker.random.alphaNumeric(8)
            const accountNumber = faker.random.alphaNumeric(8)

            // Resident can't be created to organization with type = service-provider
            const [resident] = await createTestResident(adminClient, residentClient.user, property, {
                unitName,
            })

            const [coldResource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [hotResource] = await MeterResource.getAll(adminClient, { id: HOT_WATER_METER_RESOURCE_ID })

            // Same accountNumber, address and unitName
            await createTestMeter(adminClient, organization, property, coldResource, {
                accountNumber, unitName,
            })
            await createTestMeter(adminClient, serviceProviderOrganization, serviceProviderProperty, hotResource, {
                accountNumber, unitName,
            })

            const [data] = await registerResidentServiceConsumersByTestClient(residentClient, {
                resident: { id: resident.id },
                accountNumber,
            })

            expect(data).toHaveLength(2)
            expect(data.find(e => e.organization.id === organization.id)).toBeDefined()
            expect(data.find(e => e.organization.id === serviceProviderOrganization.id)).toBeDefined()
        })
    })
    describe('Anonymous', () => {
        it('can\'t execute this mutation', async () => {
            await expectToThrowAuthenticationErrorToObjects(async () => {
                await registerResidentServiceConsumersByTestClient(anonymousClient, {
                    resident: { id: faker.datatype.uuid() },
                    accountNumber: faker.random.alphaNumeric(8),
                })
            })
        })
    })

    describe('Validations', () => {
        it('throw an error when no billingAccount and Meters were found', async () => {
            const userClient = await makeClientWithProperty()

            const [integration] = await createTestBillingIntegration(adminClient)
            await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)

            await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
            const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
                unitName: '21',
            })

            const payload = {
                resident: { id: resident.id },
                accountNumber: '221231232',
            }

            await expectToThrowGQLError(async () => {
                await registerResidentServiceConsumersByTestClient(userClient, payload)
            }, {
                mutation: 'registerResidentServiceConsumers',
                variable: ['data', 'accountNumber'],
                code: 'BAD_USER_INPUT',
                type: NOT_FOUND,
                message: 'Can\'t find billingAccount and any meters with this accountNumber, unitName and address',
                messageForUser: 'api.resident.RegisterServiceConsumerService.BILLING_ACCOUNT_OR_METER_NOT_FOUND',
            }, 'objs')
        })

        it('throw an error when accountNumber is empty', async () => {
            const userClient = await makeClientWithProperty()
            await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
            const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
                unitName: faker.random.alphaNumeric(8),
            })

            const payload = {
                resident: { id: resident.id },
                accountNumber: '',
            }

            await expectToThrowGQLError(async () => {
                await registerResidentServiceConsumersByTestClient(userClient, payload)
            }, {
                mutation: 'registerServiceConsumer',
                variable: ['data', 'accountNumber'],
                code: 'BAD_USER_INPUT',
                type: 'WRONG_FORMAT',
                message: 'Argument "accountNumber" is null or empty',
            }, 'objs')
        })

        it('throw error when try to create ServiceConsumer for deleted resident', async () => {
            const userClient = await makeClientWithProperty()
            await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
            const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
                unitName: faker.random.alphaNumeric(8),
            })

            await updateTestResident(adminClient, resident.id, { deletedAt: resident.createdAt })

            await expectToThrowGQLError(async () => {
                await registerResidentServiceConsumersByTestClient(userClient, {
                    resident: { id: resident.id }, accountNumber: faker.random.alphaNumeric(8),
                })
            }, {
                mutation: 'registerServiceConsumer',
                variable: ['data', 'residentId'],
                code: 'BAD_USER_INPUT',
                type: NOT_FOUND,
                message: 'Cannot find Resident for current user',
            }, 'objs')
        })

        it('throw error when try createServiceConsumer with BillingIntegrationOrganizationContext not in finished status', async () => {
            const { organization, context } = await makeContextWithOrganizationAndIntegrationAsAdmin({}, {}, {}, true)
            const [property] = await createTestProperty(adminClient, organization)
            const [billingProperty] = await createTestBillingProperty(adminClient, context, {
                address: property.address,
            })
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)
            await addAcquiringIntegrationAndContext(adminClient, organization, {}, {
                status: CONTEXT_FINISHED_STATUS,
            })

            const [resident] = await createTestResident(adminClient, residentClient.user, property, {
                unitName: billingAccount.unitName,
            })

            expect(context).not.toEqual(CONTEXT_FINISHED_STATUS)

            await expectToThrowGQLError(async () => {
                await registerResidentServiceConsumersByTestClient(residentClient, {
                    resident: { id: resident.id },
                    accountNumber: billingAccount.number,
                })
            }, {
                mutation: 'registerResidentServiceConsumers',
                variable: ['data', 'accountNumber'],
                code: 'BAD_USER_INPUT',
                type: NOT_FOUND,
                message: 'Can\'t find billingAccount and any meters with this accountNumber, unitName and address',
                messageForUser: 'api.resident.RegisterServiceConsumerService.BILLING_ACCOUNT_OR_METER_NOT_FOUND',
            }, 'objs')
        })
    })
})

describe('RegisterServiceConsumerService', () => {
    let adminClient
    let integration

    beforeAll(async () => {
        adminClient = await makeLoggedInAdminClient()
        integration = (await createTestBillingIntegration(adminClient))[0]
    })

    it('does not create same service consumer twice', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration, { status: CONTEXT_FINISHED_STATUS })
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: userClient.organization.id,
        }

        const out = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out).not.toEqual(undefined)

        const out2 = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out2.id).toEqual(out.id)
    })

    it('allows to create service consumers with same resident and accountNumber for multiple organizations', async () => {
        const userClient = await makeClientWithProperty()

        const USER_UNIT_NAME = String(faker.datatype.number())
        const USER_ACCOUNT_NUMBER = String(faker.datatype.number())

        // Org 1 = management company organization

        const organization1 = userClient.organization

        const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })


        await createTestMeter(adminClient, organization1, userClient.property, resource, {
            unitName: USER_UNIT_NAME,
            accountNumber: USER_ACCOUNT_NUMBER,
        })
        await createTestBillingIntegrationOrganizationContext(adminClient, organization1, integration, { status: CONTEXT_FINISHED_STATUS })

        // Org 2 = just some other org, which provides some services for this resident (like intercom service)

        const [organization2] = await createTestOrganization(adminClient, { type: SERVICE_PROVIDER_TYPE })

        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, organization2, integration, { status: CONTEXT_FINISHED_STATUS })
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty, {
            number: USER_ACCOUNT_NUMBER,
            unitName: USER_UNIT_NAME,
        })

        // Prepare resident and create serviceConsumers

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: organization2.id,
        }

        const [out] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out.id).toBeDefined()

        const payload2 = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: organization1.id,
        }

        const [out2] = await registerServiceConsumerByTestClient(userClient, payload2)
        expect(out2.id).toBeDefined()

        expect(out.id === out2.id).toBeFalsy()
    })

    it('can create, delete and create service consumer', async () => {
        const userClient = await makeClientWithProperty()

        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration, { status: CONTEXT_FINISHED_STATUS })
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: userClient.organization.id,
        }
        const [out] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out).not.toEqual(undefined)

        await updateTestServiceConsumer(userClient, out.id, { deletedAt: 'true' })

        const [out2] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out2.id).toEqual(out.id)
    })

    it('creates serviceConsumer with billingAccount for separate organization', async () => {
        const userClient = await makeClientWithProperty()

        const [ organization ] = await createTestOrganization(adminClient)

        const { billingIntegrationContext } = await addBillingIntegrationAndContext(adminClient, organization, {}, { status: CONTEXT_FINISHED_STATUS })

        const [billingProperty] = await createTestBillingProperty(adminClient, billingIntegrationContext)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, billingIntegrationContext, billingProperty)

        const { acquiringIntegration, acquiringIntegrationContext } = await addAcquiringIntegrationAndContext(adminClient, organization, {}, { status: CONTEXT_FINISHED_STATUS })

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: organization.id,
        }

        const [ out ] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out).toBeDefined()
        expect(out.accountNumber).toEqual(payload.accountNumber)
        expect(out.resident.id).toEqual(payload.residentId)
        expect(out.organization.id).toEqual(payload.organizationId)
        expect(out.residentAcquiringIntegrationContext.id).toEqual(acquiringIntegrationContext.id)
        expect(out.residentAcquiringIntegrationContext.integration).toBeDefined()
        expect(out.residentAcquiringIntegrationContext.integration.id).toEqual(acquiringIntegration.id)
        expect(out.residentAcquiringIntegrationContext.integration.hostUrl).toEqual(acquiringIntegration.hostUrl)
    })

    it('creates serviceConsumer with billingAccount and Meters', async () => {
        const userClient = await makeClientWithProperty()

        const USER_UNIT_NAME = String(faker.datatype.number())
        const USER_ACCOUNT_NUMBER = String(faker.datatype.number())

        const { billingIntegration, billingIntegrationContext } = await addBillingIntegrationAndContext(adminClient, userClient.organization)
        const [billingProperty] = await createTestBillingProperty(adminClient, billingIntegrationContext)
        await createTestBillingAccount(adminClient, billingIntegrationContext, billingProperty, {
            number: USER_ACCOUNT_NUMBER,
            unitName: USER_UNIT_NAME,
        })

        await addAcquiringIntegrationAndContext(adminClient, userClient.organization)

        const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
        await createTestMeter(adminClient, userClient.organization, userClient.property, resource, {
            unitName: USER_UNIT_NAME,
            accountNumber: USER_ACCOUNT_NUMBER,
        })
        await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, billingIntegration, { status: CONTEXT_FINISHED_STATUS })

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: USER_UNIT_NAME,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: USER_ACCOUNT_NUMBER,
            organizationId: userClient.organization.id,
            extra: { paymentCategory: 'Housing' },
        }
        const [ out ] = await registerServiceConsumerByTestClient(userClient, payload)
        const [ meter ] = await Meter.getAll(userClient)

        expect(out).toBeDefined()
        expect(out.accountNumber).toEqual(payload.accountNumber)
        expect(out.resident.id).toEqual(payload.residentId)
        expect(out.organization.id).toEqual(payload.organizationId)
        expect(out.paymentCategory).toEqual('Housing')
        // TODO(zuch): Fix test
        //expect(out.residentBillingAccount.id).toEqual(billingAccountAttrs.id)
        //expect(out.residentOrganization.id).toEqual(userClient.organization.id)
        //expect(out.residentAcquiringIntegrationContext.id).toEqual(acquiringIntegrationContext.id)
        //expect(out.residentAcquiringIntegrationContext.integration).toEqual(acquiringIntegration.id)
        expect(meter).toBeDefined()
        expect(meter.number).toBeDefined()
    })

    it('creates serviceConsumer with billingAccount without Meters', async () => {
        const userClient = await makeClientWithProperty()

        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration, { status: CONTEXT_FINISHED_STATUS })

        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: userClient.organization.id,
        }
        const [ out ] = await registerServiceConsumerByTestClient(userClient, payload)

        expect(out).toBeDefined()
        expect(out.accountNumber).toEqual(payload.accountNumber)
        expect(out.resident.id).toEqual(payload.residentId)
        expect(out.organization.id).toEqual(payload.organizationId)
    })

    it('dont create serviceConsumer if billingIntegrationOrganizationContext is not finished', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)

        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: userClient.organization.id,
        }

        await expectToThrowGQLError(async () => {
            await registerServiceConsumerByTestClient(userClient, payload)
        }, {
            mutation: 'registerServiceConsumer',
            variable: ['data', 'accountNumber'],
            code: 'BAD_USER_INPUT',
            type: 'NOT_FOUND',
            message: 'Can\'t find billingAccount and any meters with this accountNumber, unitName and organization combination',
            messageForUser: 'api.resident.RegisterServiceConsumerService.BILLING_ACCOUNT_NOT_FOUND',
        })
    })

    it('creates serviceConsumer without billingAccount when Meters are found', async () => {
        const userClient = await makeClientWithProperty()

        const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })

        const USER_UNIT_NAME = String(faker.datatype.number())
        const USER_ACCOUNT_NUMBER = String(faker.datatype.number())

        await createTestMeter(adminClient, userClient.organization, userClient.property, resource, {
            unitName: USER_UNIT_NAME,
            accountNumber: USER_ACCOUNT_NUMBER,
        })
        await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: USER_UNIT_NAME,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: USER_ACCOUNT_NUMBER,
            organizationId: userClient.organization.id,
        }

        const [ out ] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out).toBeDefined()
        expect(out.accountNumber).toEqual(payload.accountNumber)
        expect(out.resident.id).toEqual(payload.residentId)
        expect(out.organization.id).toEqual(payload.organizationId)
        expect(out.residentBillingAccount).toBeNull()
    })

    it('fails with error when billingAccount not found, and Meters are not found', async () => {
        const userClient = await makeClientWithProperty()

        await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration, { status: CONTEXT_FINISHED_STATUS })

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: '21',
        })

        const payload = {
            residentId: resident.id,
            accountNumber: '221231232',
            organizationId: userClient.organization.id,
        }

        await catchErrorFrom(async () => {
            await registerServiceConsumerByTestClient(userClient, payload)
        }, ({ errors }) => {
            expect(errors).toMatchObject([{
                message: 'Can\'t find billingAccount and any meters with this accountNumber, unitName and organization combination',
                name: 'GQLError',
                path: ['obj'],
                extensions: {
                    mutation: 'registerServiceConsumer',
                    variable: ['data', 'accountNumber'],
                    code: 'BAD_USER_INPUT',
                    type: 'NOT_FOUND',
                    message: 'Can\'t find billingAccount and any meters with this accountNumber, unitName and organization combination',
                },
            }])
        })
    })

    it('fails with error when creating serviceConsumer for nullish data', async () => {
        const userClient = await makeClientWithProperty()

        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration, { status: CONTEXT_FINISHED_STATUS })
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payloadWithNullishAccountName = {
            residentId: resident.id,
            accountNumber: '',
            organizationId: userClient.organization.id,
        }

        await catchErrorFrom(async () => {
            await registerServiceConsumerByTestClient(userClient, payloadWithNullishAccountName)
        }, ({ errors }) => {
            expect(errors).toMatchObject([{
                message: 'Argument "accountNumber" is null or empty',
                name: 'GQLError',
                path: ['obj'],
                extensions: {
                    mutation: 'registerServiceConsumer',
                    variable: ['data', 'accountNumber'],
                    code: 'BAD_USER_INPUT',
                    type: 'WRONG_FORMAT',
                    message: 'Argument "accountNumber" is null or empty',
                },
            }])
        })
    })

    it('cannot be invoked by non-resident user', async () => {
        const userClient = await makeClientWithProperty()

        const payload = {
            residentId: 'test-id',
            accountNumber: 'test-number',
            organizationId: userClient.organization.id,
        }

        await expectToThrowAccessDeniedErrorToObj(async () => {
            await registerServiceConsumerByTestClient(userClient, payload)
        })
    })

    it('cannot be invoked by anonymous', async () => {
        const userClient = await makeClient()
        const userClient2 = await makeClientWithProperty()

        const payload = {
            residentId: 'test-id',
            accountNumber: 'test-number',
            organizationId: userClient2.organization.id,
        }

        await expectToThrowAuthenticationErrorToObj(async () => {
            await registerServiceConsumerByTestClient(userClient, payload)
        })
    })
})
