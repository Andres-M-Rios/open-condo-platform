/**
 * Generated by `createschema address.AddressSource 'source:Text;'`
 */

const {
    makeLoggedInAdminClient,
    makeClient,
    UUID_RE,
    DATETIME_RE,
    expectToThrowGQLError,
    catchErrorFrom,
} = require('@open-condo/keystone/test.utils')

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

const faker = require('faker')

let adminClient, supportClient, userClient, anonymousClient

describe('AddressSource', () => {
    beforeAll(async () => {
        adminClient = await makeLoggedInAdminClient()
        supportClient = await makeClientWithSupportUser()
        userClient = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymousClient = await makeClient()
    })

    describe('CRUD tests', () => {
        describe('create', () => {
            test('admin can', async () => {
                const [obj, attrs] = await createTestAddressSource(adminClient)

                expect(obj.id).toMatch(UUID_RE)
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(1)
                expect(obj.newId).toEqual(null)
                expect(obj.deletedAt).toEqual(null)
                expect(obj.createdBy).toEqual(expect.objectContaining({ id: adminClient.user.id }))
                expect(obj.updatedBy).toEqual(expect.objectContaining({ id: adminClient.user.id }))
                expect(obj.createdAt).toMatch(DATETIME_RE)
                expect(obj.updatedAt).toMatch(DATETIME_RE)
            })

            test('support can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAddressSource(supportClient)
                })
            })

            test('user can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAddressSource(userClient)
                })
            })

            test('anonymous can\'t', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestAddressSource(anonymousClient)
                })
            })

            test('Can not create two sources with the same address', async () => {
                const source = `${faker.address.city()}, ${faker.address.streetName()}, ${faker.datatype.number()}, ${faker.datatype.number()}`
                await createTestAddressSource(adminClient, { source })

                await catchErrorFrom(async () => {
                    await createTestAddressSource(adminClient, { source })
                }, ({ errors, data }) => {
                    expect(errors).toHaveLength(1)
                    expect(errors[0].message).toMatch('Source with the same address already exists')
                    expect(data).toEqual({ 'obj': null })
                })
            })
        })

        describe('update', () => {
            test('admin can', async () => {
                const [objCreated] = await createTestAddressSource(adminClient)

                const [obj, attrs] = await updateTestAddressSource(adminClient, objCreated.id)

                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
            })

            test('support can\'t', async () => {
                const [objCreated] = await createTestAddressSource(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAddressSource(supportClient, objCreated.id)
                })
            })

            test('user can\'t', async () => {
                const [objCreated] = await createTestAddressSource(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAddressSource(userClient, objCreated.id)
                })
            })

            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [objCreated] = await createTestAddressSource(admin)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestAddressSource(anonymousClient, objCreated.id)
                })
            })
        })

        describe('hard delete', () => {
            test('admin can\'t', async () => {
                const [objCreated] = await createTestAddressSource(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AddressSource.delete(adminClient, objCreated.id)
                })
            })

            test('user can\'t', async () => {
                const [objCreated] = await createTestAddressSource(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AddressSource.delete(userClient, objCreated.id)
                })
            })

            test('anonymous can\'t', async () => {
                const [objCreated] = await createTestAddressSource(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AddressSource.delete(anonymousClient, objCreated.id)
                })
            })
        })

        describe('read', () => {
            test('admin can', async () => {
                const [obj, attrs] = await createTestAddressSource(adminClient)

                const objs = await AddressSource.getAll(adminClient, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: obj.id,
                    }),
                ]))
            })

            test('support can', async () => {
                const [obj, attrs] = await createTestAddressSource(adminClient)

                const objs = await AddressSource.getAll(supportClient, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: obj.id,
                    }),
                ]))
            })

            test('user can\'t', async () => {
                const [obj, attrs] = await createTestAddressSource(adminClient)

                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await AddressSource.getAll(userClient, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })

            test('anonymous can\'t', async () => {
                const [obj, attrs] = await createTestAddressSource(adminClient)

                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await AddressSource.getAll(anonymousClient, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })
        })
    })

    describe('Validation tests', () => {
        test('Should have correct dv field (=== 1)', async () => {
            await expectToThrowGQLError(async () => {
                await createTestAddressSource(adminClient, {
                    dv: 100500,
                })
            }, {
                'code': 'BAD_USER_INPUT',
                'type': 'DV_VERSION_MISMATCH',
                'message': 'Wrong value for data version number',
                'mutation': 'createAddressSource',
                'messageForUser': '',
                'variable': ['data', 'dv'],
            })
        })
    })
})
