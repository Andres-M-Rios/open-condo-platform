/**
 * Generated by `createschema address.Address 'source:Text; address:Text; key:Text; meta:Json'`
 */

const faker = require('faker')
const get = require('lodash/get')
const set = require('lodash/set')

const {
    makeLoggedInAdminClient,
    makeClient,
    UUID_RE,
    DATETIME_RE,
    catchErrorFrom,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAccessDeniedErrorToObjects,
} = require('@open-condo/keystone/test.utils')

const { OVERRIDING_ROOT } = require('@address-service/domains/address/constants')
const {
    Address,
    AddressSource,
    createTestAddress,
    updateTestAddress,
} = require('@address-service/domains/address/utils/testSchema')
const { createOrUpdateAddressWithSource } = require('@address-service/domains/common/utils/services/search/searchServiceUtils')
const { createReturnObject } = require('@address-service/domains/common/utils/services/search/searchServiceUtils')
const {
    makeClientWithNewRegisteredAndLoggedInUser,
    makeClientWithSupportUser,
} = require('@address-service/domains/user/utils/testSchema')

let adminClient, supportClient, userClient, anonymousClient, sender

describe('Address', () => {
    beforeAll(async () => {
        adminClient = await makeLoggedInAdminClient()
        supportClient = await makeClientWithSupportUser()
        userClient = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymousClient = await makeClient()
        sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    })

    describe('CRUD tests', () => {
        describe('create', () => {
            test('admin can', async () => {
                // 2) action
                const [obj, attrs] = await createTestAddress(adminClient)

                // 3) check
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
                    await createTestAddress(supportClient)
                })
            })

            test('user can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAddress(userClient)
                })
            })

            test('anonymous can\'t', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestAddress(anonymousClient)
                })
            })
        })

        describe('update', () => {
            test('admin can', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                const [obj, attrs] = await updateTestAddress(adminClient, objCreated.id)

                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
            })

            test('support can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAddress(supportClient, objCreated.id)
                })
            })

            test('user can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAddress(userClient, objCreated.id)
                })
            })

            test('anonymous can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestAddress(anonymousClient, objCreated.id)
                })
            })
        })

        describe('hard delete', () => {
            test('admin can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Address.delete(adminClient, objCreated.id)
                })
            })

            test('user can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Address.delete(userClient, objCreated.id)
                })
            })

            test('anonymous can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Address.delete(anonymousClient, objCreated.id)
                })
            })
        })

        describe('read', () => {
            test('admin can', async () => {
                const [obj, attrs] = await createTestAddress(adminClient)

                const objs = await Address.getAll(adminClient, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: obj.id,
                    }),
                ]))
            })

            test('support can', async () => {
                const [obj, attrs] = await createTestAddress(adminClient)

                const objs = await Address.getAll(supportClient, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: obj.id,
                    }),
                ]))
            })

            test('user can\'t', async () => {
                const [obj, attrs] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await Address.getAll(userClient, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })

            test('anonymous can\'t', async () => {
                const [obj, attrs] = await createTestAddress(adminClient)

                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await Address.getAll(anonymousClient, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })
        })
    })

    describe('Overriding', async () => {
        test('throw an error if no field to override', async () => {
            await catchErrorFrom(
                async () => {
                    await createTestAddress(
                        adminClient,
                        {
                            meta: { data: { existingField: 'some-val' } },
                            overrides: { nonExistingField: 'some-new-val' },
                        },
                    )
                },
                (caught) => {
                    expect(caught).toEqual(expect.objectContaining({
                        errors: [expect.objectContaining({
                            name: 'ValidationFailureError',
                            path: ['obj'],
                            data: expect.objectContaining({
                                messages: ['meta.data does not contains nonExistingField'],
                            }),
                        })],
                        data: { obj: null },
                    }))
                },
            )
        })

        test('throw an error if try to override with the same value', async () => {
            await catchErrorFrom(
                async () => {
                    await createTestAddress(
                        adminClient,
                        {
                            meta: { data: { someField: 'some-val' } },
                            overrides: { someField: 'some-val' },
                        },
                    )
                },
                (caught) => {
                    expect(caught).toEqual(expect.objectContaining({
                        errors: [expect.objectContaining({
                            name: 'ValidationFailureError',
                            path: ['obj'],
                            data: expect.objectContaining({
                                messages: ['You trying to override field meta.data.someField with the same value'],
                            }),
                        })],
                        data: { obj: null },
                    }))
                },
            )
        })

        test('fields structure is correct after overriding', async () => {
            const [obj] = await createTestAddress(
                adminClient,
                {
                    meta: { data: { someField: 'some-val', a: { a1: 'a1' } } },
                    overrides: { someField: 'some-new-val', 'a.a1': 'a2' },
                },
            )

            let overridden = {}
            Object.entries(get(obj, 'overrides', {}) || {}).forEach(([path, value]) => {
                // 1. Keep overridden value
                set(overridden, path, get(obj, `${OVERRIDING_ROOT}.${path}`))
                // 2. Do override
                set(obj, `${OVERRIDING_ROOT}.${path}`, value)
            })

            const ret = await createReturnObject({
                context: adminClient,
                addressModel: obj,
                overridden,
                AddressSourceServerUtils: AddressSource,
            })

            expect(ret).toEqual(expect.objectContaining({
                addressMeta: {
                    data: {
                        someField: 'some-new-val',
                        a: {
                            a1: 'a2',
                        },
                    },
                },
                overridden: {
                    addressMeta: {
                        data: {
                            someField: 'some-val',
                            a: {
                                a1: 'a1',
                            },
                        },
                    },
                },
            }))
        })
    })

    describe('Use cases', async () => {
        test('The house keeps the firstly created address', async () => {
            const source1 = faker.random.alphaNumeric(42)
            const source2 = faker.random.alphaNumeric(42)
            const address1 = `${faker.address.cityName()} ${faker.address.streetAddress(true)}`
            const address2 = `${faker.address.cityName()} ${faker.address.streetAddress(true)}`

            const fakeSearchResult = {
                value: '',
                unrestricted_value: '',
                data: {
                    country: faker.address.country(),
                    region: faker.address.state(),
                    area: faker.address.state(),
                    city: faker.address.cityName(),
                    city_district: faker.address.cityName(),
                    settlement: faker.address.cityName(),
                    street: faker.address.streetName(),
                    house: faker.random.alphaNumeric(2),
                    block: faker.random.alphaNumeric(3),
                },
                provider: {
                    name: 'test',
                    rawData: {},
                },
            }

            const key = faker.random.alphaNumeric(48)

            const addressData1 = {
                address: address1,
                meta: fakeSearchResult,
                key,
            }

            const addressData2 = {
                address: address2,
                meta: fakeSearchResult,
                key,
            }

            const addressModel = await createOrUpdateAddressWithSource(adminClient, Address, AddressSource, addressData1, source1, {
                dv: 1,
                sender,
            })
            const possiblyChangedModel = await createOrUpdateAddressWithSource(adminClient, Address, AddressSource, addressData2, source2, {
                dv: 1,
                sender,
            })

            expect(possiblyChangedModel.address).toEqual(address1)
            expect(possiblyChangedModel.address).not.toEqual(address2)
            expect(possiblyChangedModel.key).toEqual(addressModel.key)

            const sources = await AddressSource.getAll(adminClient, { address: { id: addressModel.id } })

            expect(sources).toHaveLength(2)
            expect(sources).toEqual(expect.arrayContaining([
                expect.objectContaining({ source: source1 }),
                expect.objectContaining({ source: source2 }),
            ]))
        })
    })
})
