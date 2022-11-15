/**
 * Generated by `createschema address.AddressSource 'source:Text;'`
 */

const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE } = require('@open-condo/keystone/test.utils')

const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAccessDeniedErrorToObjects,
} = require('@open-condo/keystone/test.utils')

const {
    makeClientWithNewRegisteredAndLoggedInUser,
    makeClientWithSupportUser,
} = require('@address-service/domains/user/utils/testSchema')

const {
    AddressSource,
    createTestAddressSource,
    updateTestAddressSource,
} = require('@address-service/domains/address/utils/testSchema')

describe('AddressSource', () => {
    describe('CRUD tests', () => {
        describe('create', () => {
            test('admin can', async () => {
                // 1) prepare data
                const admin = await makeLoggedInAdminClient()

                // 2) action
                const [obj, attrs] = await createTestAddressSource(admin)

                // 3) check
                expect(obj.id).toMatch(UUID_RE)
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(1)
                expect(obj.newId).toEqual(null)
                expect(obj.deletedAt).toEqual(null)
                expect(obj.createdBy).toEqual(expect.objectContaining({ id: admin.user.id }))
                expect(obj.updatedBy).toEqual(expect.objectContaining({ id: admin.user.id }))
                expect(obj.createdAt).toMatch(DATETIME_RE)
                expect(obj.updatedAt).toMatch(DATETIME_RE)
            })

            test('support can\'t', async () => {
                const client = await makeClientWithSupportUser()

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAddressSource(client)
                })
            })

            test('user can\'t', async () => {
                const client = await makeClientWithNewRegisteredAndLoggedInUser()

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAddressSource(client)
                })
            })

            test('anonymous can\'t', async () => {
                const client = await makeClient()

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestAddressSource(client)
                })
            })
        })

        describe('update', () => {
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [objCreated] = await createTestAddressSource(admin)

                const [obj, attrs] = await updateTestAddressSource(admin, objCreated.id)

                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
            })

            test('support can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [objCreated] = await createTestAddressSource(admin)

                const client = await makeClientWithSupportUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAddressSource(client, objCreated.id)
                })
            })

            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [objCreated] = await createTestAddressSource(admin)

                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAddressSource(client, objCreated.id)
                })
            })

            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [objCreated] = await createTestAddressSource(admin)

                const client = await makeClient()
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestAddressSource(client, objCreated.id)
                })
            })
        })

        describe('hard delete', () => {
            test('admin can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [objCreated] = await createTestAddressSource(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AddressSource.delete(admin, objCreated.id)
                })
            })

            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [objCreated] = await createTestAddressSource(admin)

                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AddressSource.delete(client, objCreated.id)
                })
            })

            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [objCreated] = await createTestAddressSource(admin)

                const client = await makeClient()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AddressSource.delete(client, objCreated.id)
                })
            })
        })

        describe('read', () => {
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [obj, attrs] = await createTestAddressSource(admin)

                const objs = await AddressSource.getAll(admin, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: obj.id,
                    }),
                ]))
            })

            test('support can', async () => {
                const client = await makeClientWithSupportUser()

                const admin = await makeLoggedInAdminClient()
                const [obj, attrs] = await createTestAddressSource(admin)

                const objs = await AddressSource.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: obj.id,
                    }),
                ]))
            })

            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [obj, attrs] = await createTestAddressSource(admin)

                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await AddressSource.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })

            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [obj, attrs] = await createTestAddressSource(admin)

                const client = await makeClient()
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await AddressSource.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })
        })
    })
})
