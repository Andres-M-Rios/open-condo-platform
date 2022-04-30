/**
 * Generated by `createschema billing.BillingCategory 'name:Text'`
 */

const faker = require('faker')
const { expectToThrowAuthenticationErrorToObjects } = require(
    '@condo/domains/common/utils/testSchema')

const { makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')
const { expectToThrowAuthenticationErrorToObj } = require('@condo/domains/common/utils/testSchema')
const { makeLoggedInAdminClient, makeLoggedInClient, makeClient } = require('@core/keystone/test.utils')

const { BillingCategory, createTestBillingCategory, updateTestBillingCategory } = require('@condo/domains/billing/utils/testSchema')
const { expectToThrowAccessDeniedErrorToObjects, expectToThrowAccessDeniedErrorToObj } = require('@condo/domains/common/utils/testSchema')

describe('BillingCategory', () => {

    describe('Create', () => {
        test('can be created by Admin', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)
            expect(category).toBeDefined()
            expect(category.name).not.toBeNull()
            expect(category.id).not.toBeNull()
        })

        test('can be created by support', async () => {
            const support = await makeClientWithSupportUser()
            const [category] = await createTestBillingCategory(support)
            expect(category).toBeDefined()
        })

        test('cannot be created by user', async () => {
            const user = await makeLoggedInClient()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestBillingCategory(user)
            })
        })
    })

    describe('Read', () => {
        test('can be read by admin', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)
            const categories = await BillingCategory.getAll(admin, { id: category.id })
            expect(categories).toHaveLength(1)
        })

        test('can be read by user', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)
            const user = await makeLoggedInClient()
            const categories = await BillingCategory.getAll(user, { id: category.id })
            expect(categories).toHaveLength(1)
        })

        test('cannot be read by anonymous', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)

            const client = await makeClient()
            await expectToThrowAuthenticationErrorToObjects(async () => {
                await BillingCategory.getAll(client, { id: category.id })
            })
        })
    })

    describe('Update', () => {
        test('can be updated by admin', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)

            const payload = { name: faker.lorem.words() }
            const [updated] = await updateTestBillingCategory(admin, category.id, payload)

            expect(updated.id).toEqual(category.id)
            expect(updated.name).toEqual(payload.name)
        })

        test('can be updated by support', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)

            const support = await makeClientWithSupportUser()
            const payload = { name: faker.lorem.words() }
            const [updated] = await updateTestBillingCategory(support, category.id, payload)

            expect(updated.id).toEqual(category.id)
            expect(updated.name).toEqual(payload.name)
        })

        test('cannot be updated by user', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)

            const user = await makeLoggedInClient()

            const payload = { name: faker.lorem.words() }

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestBillingCategory(user, category.id, payload)
            })
        })

        test('cannot be updated by anonymous', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)

            const anonymous = await makeClient()
            const payload = { name: faker.lorem.words() }

            await expectToThrowAuthenticationErrorToObj(async () => {
                await updateTestBillingCategory(anonymous, category.id, payload)
            })
        })
    })

    describe('Delete', () => {
        test('cannot be deleted by admin', async () => {
            const admin = await makeLoggedInAdminClient()
            const [category] = await createTestBillingCategory(admin)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await BillingCategory.delete(admin, category.id)
            })
        })
    })
})
