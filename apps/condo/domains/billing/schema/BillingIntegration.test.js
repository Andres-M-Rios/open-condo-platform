/**
 * Generated by `createschema billing.BillingIntegration name:Text;`
 */

const { getRandomString } = require('@core/keystone/test.utils')
const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')
const { makeLoggedInAdminClient, makeClient } = require('@core/keystone/test.utils')
const { BillingIntegration, createTestBillingIntegration, updateTestBillingIntegration } = require('@condo/domains/billing/utils/testSchema')
const { expectToThrowAuthenticationErrorToObjects, expectToThrowAccessDeniedErrorToObj, expectToThrowAuthenticationErrorToObj  } = require('@condo/domains/common/utils/testSchema')

describe('BillingIntegration', () => {
    test('admin: create BillingIntegration', async () => {
        const admin = await makeLoggedInAdminClient()
        const [integration, attrs] = await createTestBillingIntegration(admin)
        expect(integration).toEqual(expect.objectContaining({
            name: attrs.name,
            detailsTitle: attrs.detailsTitle,
        }))
    })

    test('user: create BillingIntegration', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await createTestBillingIntegration(client)
        })
    })

    test('anonymous: create BillingIntegration', async () => {
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObj(async () => {
            await createTestBillingIntegration(client)
        })
    })

    test('support: create BillingIntegration', async () => {
        const support = await makeClientWithSupportUser()
        const [integration, attrs] = await createTestBillingIntegration(support)
        expect(integration).toEqual(expect.objectContaining({
            name: attrs.name,
        }))
    })

    test('support: update BillingIntegration', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestBillingIntegration(admin)

        const support = await makeClientWithSupportUser()
        const payload = { name: getRandomString() }
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestBillingIntegration(support, objCreated.id, payload)
        })
    })

    test('user: read BillingIntegration', async () => {
        const admin = await makeLoggedInAdminClient()
        const [obj, attrs] = await createTestBillingIntegration(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const objs = await BillingIntegration.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })

        expect(objs.length >= 1).toBeTruthy()
        expect(objs).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: obj.id,
                sender: attrs.sender,
                createdBy: expect.objectContaining({ id: admin.user.id }),
                updatedBy: expect.objectContaining({ id: admin.user.id }),
                createdAt: obj.createdAt,
                updatedAt: obj.updatedAt,
                name: attrs.name,
            }),
        ]))
    })

    test('anonymous: read BillingIntegration', async () => {
        const client = await makeClient()

        await expectToThrowAuthenticationErrorToObjects(async () => {
            await BillingIntegration.getAll(client)
        })
    })

    test('user: update BillingIntegration', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestBillingIntegration(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { name: getRandomString() }
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestBillingIntegration(client, objCreated.id, payload)
        })
    })

    test('anonymous: update BillingIntegration', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestBillingIntegration(admin)

        const client = await makeClient()
        const payload = {}
        await expectToThrowAuthenticationErrorToObj(async () => {
            await updateTestBillingIntegration(client, objCreated.id, payload)
        })
    })

    test('user: delete BillingIntegration', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestBillingIntegration(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await BillingIntegration.delete(client, objCreated.id)
        })
    })

    test('anonymous: delete BillingIntegration', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestBillingIntegration(admin)

        const client = await makeClient()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await BillingIntegration.delete(client, objCreated.id)
        })
    })
})
