/**
 * Generated by `createschema billing.BillingRecipient 'organization:Relationship:Organization:CASCADE; tin:Text; iec:Text; bic:Text; context?:Relationship:BillingIntegrationOrganizationContext:SET_NULL; bankAccount:Text; name?:Text; approved:Checkbox; meta?:Json;'`
 */

const { makeClient, makeLoggedInAdminClient } = require('@core/keystone/test.utils')

const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const {
    makeClientWithSupportUser,
    makeClientWithNewRegisteredAndLoggedInUser,
} = require('@condo/domains/user/utils/testSchema')
const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAccessDeniedErrorToObj,
} = require('@condo/domains/common/utils/testSchema')

const {
    BillingRecipient,
    createTestBillingRecipient,
    updateTestBillingRecipient,
    makeContextWithOrganizationAndIntegrationAsAdmin,
    createTestBillingIntegrationOrganizationContext,
    makeOrganizationIntegrationManager,
    makeClientWithIntegrationAccess,
} = require('@condo/domains/billing/utils/testSchema')


describe('BillingRecipient', () => {
    describe('Create', () => {
        test('admin can create BillingRecipient', async () => {
            const admin = await makeLoggedInAdminClient()

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [obj] = await createTestBillingRecipient(admin, context)

            expect(obj.importId).toBeDefined()
            expect(obj.tin).toBeDefined()
            expect(obj.iec).toBeDefined()
            expect(obj.bic).toBeDefined()
            expect(obj.bankAccount).toBeDefined()
            expect(obj.name).toBeDefined()
            expect(obj.isApproved).toBeDefined()
            expect(obj.meta).toBeDefined()
        })

        test('support can create BillingRecipient', async () => {
            const support = await makeClientWithSupportUser()

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [obj] = await createTestBillingRecipient(support, context)

            expect(obj.importId).toBeDefined()
            expect(obj.tin).toBeDefined()
            expect(obj.iec).toBeDefined()
            expect(obj.bic).toBeDefined()
            expect(obj.bankAccount).toBeDefined()
            expect(obj.name).toBeDefined()
            expect(obj.isApproved).toBeDefined()
            expect(obj.meta).toBeDefined()
        })

        test('billing integration can create BillingRecipient', async () => {

            const admin = await makeLoggedInAdminClient()
            const integrationClient = await makeClientWithIntegrationAccess()

            const [ organization ] = await createTestOrganization(admin)
            const [ context ] = await createTestBillingIntegrationOrganizationContext(admin, organization, integrationClient.integration)

            const [obj] = await createTestBillingRecipient(integrationClient, context)

            expect(obj.importId).toBeDefined()
            expect(obj.tin).toBeDefined()
            expect(obj.iec).toBeDefined()
            expect(obj.bic).toBeDefined()
            expect(obj.bankAccount).toBeDefined()
            expect(obj.name).toBeDefined()
            expect(obj.isApproved).toBeDefined()
            expect(obj.meta).toBeDefined()
        })

        test('organization integration manager can\'t create BillingRecipient', async () => {
            const { managerUserClient, integration, organization } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestBillingRecipient(managerUserClient, context)
            })
        })

        test('user can\'t create BillingRecipient', async () => {
            const user = await makeClientWithNewRegisteredAndLoggedInUser()

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestBillingRecipient(user, context)
            })
        })

        test('anonymous can\'t create BillingRecipient', async () => {
            const anonymous = await makeClient()

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            await expectToThrowAuthenticationErrorToObj(async () => {
                await createTestBillingRecipient(anonymous, context)
            })
        })
    })

    describe('Read', () => {
        test('admin can read BillingRecipient', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [ createdObj ] = await createTestBillingRecipient(admin, context)
            const [ readObj ] = await BillingRecipient.getAll(admin, { id: createdObj.id })

            expect(readObj.importId).toEqual(createdObj.importId)
            expect(readObj.tin).toEqual(createdObj.tin)
            expect(readObj.iec).toEqual(createdObj.iec)
            expect(readObj.bic).toEqual(createdObj.bic)
            expect(readObj.bankAccount).toEqual(createdObj.bankAccount)
            expect(readObj.name).toEqual(createdObj.name)
            expect(readObj.isApproved).toEqual(createdObj.isApproved)
        })

        test('support can read BillingRecipient', async () => {
            const support = await makeClientWithSupportUser()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [ createdObj ] = await createTestBillingRecipient(support, context)
            const [ readObj ] = await BillingRecipient.getAll(support, { id: createdObj.id })

            expect(readObj.importId).toEqual(createdObj.importId)
            expect(readObj.tin).toEqual(createdObj.tin)
            expect(readObj.iec).toEqual(createdObj.iec)
            expect(readObj.bic).toEqual(createdObj.bic)
            expect(readObj.bankAccount).toEqual(createdObj.bankAccount)
            expect(readObj.name).toEqual(createdObj.name)
            expect(readObj.isApproved).toEqual(createdObj.isApproved)
        })

        test('organization integration manager can read BillingRecipient', async () => {

            const admin = await makeLoggedInAdminClient()
            const { managerUserClient, integration, organization } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)

            const [ createdObj ] = await createTestBillingRecipient(admin, context)
            const [ readObj ] = await BillingRecipient.getAll(managerUserClient, { id: createdObj.id })

            expect(readObj.importId).toEqual(createdObj.importId)
            expect(readObj.tin).toEqual(createdObj.tin)
            expect(readObj.iec).toEqual(createdObj.iec)
            expect(readObj.bic).toEqual(createdObj.bic)
            expect(readObj.bankAccount).toEqual(createdObj.bankAccount)
            expect(readObj.name).toEqual(createdObj.name)
            expect(readObj.isApproved).toEqual(createdObj.isApproved)
        })

        test('integration service account can read BillingRecipient', async () => {

            const admin = await makeLoggedInAdminClient()
            const integrationClient = await makeClientWithIntegrationAccess()

            const [ organization ] = await createTestOrganization(admin)
            const [ context ] = await createTestBillingIntegrationOrganizationContext(admin, organization, integrationClient.integration)

            const [ createdObj ] = await createTestBillingRecipient(integrationClient, context)
            const [ readObj ] = await BillingRecipient.getAll(integrationClient, { id: createdObj.id })

            expect(readObj.importId).toEqual(createdObj.importId)
            expect(readObj.tin).toEqual(createdObj.tin)
            expect(readObj.iec).toEqual(createdObj.iec)
            expect(readObj.bic).toEqual(createdObj.bic)
            expect(readObj.bankAccount).toEqual(createdObj.bankAccount)
            expect(readObj.name).toEqual(createdObj.name)
            expect(readObj.isApproved).toEqual(createdObj.isApproved)
        })

        test('user can\'t read BillingRecipients', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const user = await makeClientWithNewRegisteredAndLoggedInUser()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            await createTestBillingRecipient(adminClient, context)

            const readObjects = await BillingRecipient.getAll(user)

            expect(readObjects).toHaveLength(0)
        })

        test('anonymous can\'t read BillingRecipients', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const user = await makeClientWithNewRegisteredAndLoggedInUser()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            await createTestBillingRecipient(adminClient, context)

            const readObjects = await BillingRecipient.getAll(user)

            expect(readObjects).toHaveLength(0)
        })
    })

    describe('Update', () => {
        test('admin can update BillingRecipient', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [ createdObj ] = await createTestBillingRecipient(admin, context)
            const [ updatedObj ] = await updateTestBillingRecipient(admin, createdObj.id, { isApproved: true })

            expect(createdObj.id).toEqual(updatedObj.id)
            expect(createdObj.isApproved).toEqual(false)
            expect(updatedObj.isApproved).toEqual(true)
        })

        test('support can update BillingRecipient', async () => {
            const support = await makeClientWithSupportUser()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [ createdObj ] = await createTestBillingRecipient(support, context)
            const [ updatedObj ] = await updateTestBillingRecipient(support, createdObj.id, { isApproved: true })

            expect(createdObj.id).toEqual(updatedObj.id)
            expect(createdObj.isApproved).toEqual(false)
            expect(updatedObj.isApproved).toEqual(true)
        })

        test('integration service account can update BillingRecipient', async () => {
            const admin = await makeLoggedInAdminClient()
            const integrationClient = await makeClientWithIntegrationAccess()

            const [ organization ] = await createTestOrganization(admin)
            const [ context ] = await createTestBillingIntegrationOrganizationContext(admin, organization, integrationClient.integration)

            const [ createdObj ] = await createTestBillingRecipient(integrationClient, context)
            const [ updatedObj ] = await updateTestBillingRecipient(integrationClient, createdObj.id, { isApproved: true })

            expect(createdObj.id).toEqual(updatedObj.id)
            expect(createdObj.isApproved).toEqual(false)
            expect(updatedObj.isApproved).toEqual(true)
        })

        test('organization integration manager can\'t update BillingRecipient', async () => {

            const admin = await makeLoggedInAdminClient()
            const { managerUserClient, integration, organization } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)

            const [ createdObj ] = await createTestBillingRecipient(admin, context)

            await expectToThrowAccessDeniedErrorToObj(async () => {await updateTestBillingRecipient(managerUserClient,
                createdObj.id, { isApproved: true })
            })
        })

        test('user can\'t update BillingRecipients', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const user = await makeClientWithNewRegisteredAndLoggedInUser()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [ createdObj ] = await createTestBillingRecipient(adminClient, context)

            await expectToThrowAccessDeniedErrorToObj(async () => {await updateTestBillingRecipient(user,
                createdObj.id, { isApproved: true })
            })
        })

        test('anonymous can\'t update BillingRecipients', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const user = await makeClientWithNewRegisteredAndLoggedInUser()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [ createdObj ] = await createTestBillingRecipient(adminClient, context)

            await expectToThrowAccessDeniedErrorToObj(async () => {await updateTestBillingRecipient(user,
                createdObj.id, { isApproved: true })
            })
        })
    })

    describe('Delete', () => {
        test('admin can\'t delete BillingRecipients', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()

            const [ createdObj ] = await createTestBillingRecipient(adminClient, context)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await BillingRecipient.delete(adminClient, createdObj.id)
            })
        })
    })
})