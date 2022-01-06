/**
 * Generated by `createschema resident.ServiceConsumer 'resident:Relationship:Resident:CASCADE; billingAccount?:Relationship:BillingAccount:SET_NULL; accountNumber:Text;'`
 */

const faker = require('faker')

const { addResidentAccess, makeClientWithResidentUser } = require('@condo/domains/user/utils/testSchema')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestBillingAccount, createTestBillingProperty, makeContextWithOrganizationAndIntegrationAsAdmin, makeClientWithPropertyAndBilling } = require('@condo/domains/billing/utils/testSchema')
const { createTestOrganization, createTestOrganizationEmployee, createTestOrganizationEmployeeRole } = require('@condo/domains/organization/utils/testSchema')
const {
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
} = require('@condo/domains/common/utils/testSchema')
const { createTestServiceConsumer, createTestResident, updateTestServiceConsumer, makeClientWithServiceConsumer, registerResidentByTestClient, registerServiceConsumerByTestClient, ServiceConsumer } = require('../utils/testSchema')

const { makeClient } = require('@core/keystone/test.utils')
const { makeLoggedInAdminClient } = require('@core/keystone/test.utils')


describe('ServiceConsumer', () => {

    describe('Create',  () => {
        it('can be created by admin', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [billingProperty] = await createTestBillingProperty(adminClient, context)
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)
            const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            const [consumer] = await createTestServiceConsumer(adminClient, resident, userClient.organization, { billingAccount: { connect: { id: billingAccount.id } } })

            expect(consumer.resident.id).toEqual(resident.id)
            expect(consumer.organization.id).toEqual(userClient.organization.id)
            expect(consumer.billingAccount.id).toEqual(billingAccount.id)
        })

        it('cannot be created by regular user', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithProperty()
            const [organization] = await createTestOrganization(adminClient)
            const [anotherOrganization] = await createTestOrganization(adminClient)
            const [role] = await createTestOrganizationEmployeeRole(adminClient, organization)
            await createTestOrganizationEmployee(adminClient, organization, userClient.user, role)
            const [resident] = await createTestResident(adminClient, userClient.user, anotherOrganization, userClient.property)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestServiceConsumer(userClient, resident, userClient.organization)
            })
        })

        it('cannot be created by anonymous', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithProperty()
            const anonymous = await makeClient()
            const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [billingProperty] = await createTestBillingProperty(adminClient, context)
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)

            await expectToThrowAuthenticationErrorToObj(async () => {
                await createTestServiceConsumer(anonymous, resident, userClient.organization, { billingAccount: { connect: { id: billingAccount.id } } })
            })
        })
    })

    describe('Read', () => {
        it('can be read by admin', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const serviceConsumerClient = await makeClientWithServiceConsumer()

            const objs = await ServiceConsumer.getAll(
                adminClient,
                { id: serviceConsumerClient.serviceConsumer.id },
                { sortBy: ['updatedAt_DESC'] }
            )

            expect(objs.length === 1).toBeTruthy()
            expect(objs[0].id).toBeDefined()
            expect(objs[0].organization).toBeDefined()
            expect(objs[0].resident).toBeDefined()
        })

        it('can be read by user with type === resident who created it', async () => {
            const client = await makeClientWithServiceConsumer()
            await makeClientWithServiceConsumer() // Create second service consumer

            const objs = await ServiceConsumer.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })

            expect(objs.length === 1).toBeTruthy()
            expect(objs[0].id).toMatch(client.serviceConsumer.id)
            expect(objs[0].id).toBeDefined()
            expect(objs[0].organization).toBeDefined()
            expect(objs[0].resident).toBeDefined()
        })

        it('cannot be read by anonymous', async () => {
            const anonymous = await makeClient()
            await makeClientWithServiceConsumer()

            await expectToThrowAuthenticationErrorToObjects(async () => {
                await ServiceConsumer.getAll(anonymous, {}, { sortBy: ['updatedAt_DESC'] })
            })
        })
    })

    describe('Update', () => {
        it('can be updated by admin', async () => {
            const PAYMENT_CATEGORY = faker.random.alphaNumeric(8)
            const ACCOUNT_NUMBER = faker.random.alphaNumeric(8)

            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClientWithServiceConsumer()

            const [updatedConsumer] = await updateTestServiceConsumer(adminClient, client.serviceConsumer.id, {
                accountNumber: ACCOUNT_NUMBER,
                paymentCategory: PAYMENT_CATEGORY,
            })

            expect(updatedConsumer.id).toEqual(client.serviceConsumer.id)
            expect(updatedConsumer.accountNumber).toEqual(ACCOUNT_NUMBER)
            expect(updatedConsumer.paymentCategory).toEqual(PAYMENT_CATEGORY)
        })

        it('cannot be updated by user with type === resident even if this is his own serviceConsumer', async () => {
            const client = await makeClientWithServiceConsumer()

            await addResidentAccess(client.user)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestServiceConsumer(client, client.serviceConsumer.id, { accountNumber: faker.random.alphaNumeric(8) })
            })
        })

        it('cannot be updated by user with type === resident', async () => {
            const client1 = await makeClientWithServiceConsumer()
            const client2 = await makeClientWithServiceConsumer()

            await addResidentAccess(client1.user)
            await addResidentAccess(client2.user)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestServiceConsumer(client2, client1.serviceConsumer.id, { accountNumber: faker.random.alphaNumeric(8) })
            })
        })

        it('cannot be updated by other users', async () => {
            const client = await makeClientWithServiceConsumer()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestServiceConsumer(client, client.serviceConsumer.id, { accountNumber: faker.random.alphaNumeric(8) })
            })
        })

        it('cannot be updated by anonymous', async () => {
            const anonymousClient = await makeClient()
            const client = await makeClientWithServiceConsumer()

            await expectToThrowAuthenticationErrorToObj(async () => {
                await updateTestServiceConsumer(anonymousClient, client.serviceConsumer.id, { accountNumber: faker.random.alphaNumeric(8) })
            })
        })
    })

    describe('SoftDelete', () => {
        it('can be soft-deleted by user with type === resident if this is his own serviceConsumer', async () => {
            const client1 = await makeClientWithServiceConsumer()

            const [deleted] = await updateTestServiceConsumer(client1, client1.serviceConsumer.id, { deletedAt: 'true' })

            expect(deleted.id).toEqual(client1.serviceConsumer.id)
            expect(deleted.deletedAt).toBeDefined()
        })

        it('cannot be soft-deleted by user with type === resident if this is not his own serviceConsumer', async () => {
            const client1 = await makeClientWithServiceConsumer()
            const client2 = await makeClientWithServiceConsumer()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestServiceConsumer(client1, client2.serviceConsumer.id, { deletedAt: 'true' })
            })
        })
    })

    describe('Delete', () => {
        it('cannot be deleted by anybody', async () => {
            const client = await makeClientWithServiceConsumer()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await ServiceConsumer.delete(client, client.serviceConsumer.id)
            })
        })
    })

    describe('real-life cases', () => {
        it('Client lives in organization A and pays for water to organization B. When getting his ServiceConsumers client has access to inner fields', async () => {
            const UNIT_NAME = '22'

            const { organizationClient: managementCompanyOrganizationClient } = await makeClientWithPropertyAndBilling({ billingAccountAttrs: { unitName: UNIT_NAME } })
            const { organizationClient: waterCompanyOrganizationClient } = await makeClientWithPropertyAndBilling({ billingAccountAttrs: { unitName: UNIT_NAME } })

            const residentClient = await makeClientWithResidentUser()
            const [ resident ] = await registerResidentByTestClient(residentClient, {
                address: managementCompanyOrganizationClient.property.address,
                addressMeta: managementCompanyOrganizationClient.property.addressMeta,
                unitName: UNIT_NAME,
            })

            await registerServiceConsumerByTestClient(residentClient, {
                residentId: resident.id,
                accountNumber: managementCompanyOrganizationClient.billingAccount.number,
                organizationId: managementCompanyOrganizationClient.organization.id,
            })

            await registerServiceConsumerByTestClient(residentClient, {
                residentId: resident.id,
                accountNumber: waterCompanyOrganizationClient.billingAccount.number,
                organizationId: waterCompanyOrganizationClient.organization.id,
            })

            const objs = await ServiceConsumer.getAll(residentClient, {}, { sortBy: ['createdAt_ASC'] })

            expect(objs).toHaveLength(2)
            expect(objs[0].organization.id).toEqual(managementCompanyOrganizationClient.organization.id)
            expect(objs[1].organization.id).toEqual(waterCompanyOrganizationClient.organization.id)
        })
    })
})