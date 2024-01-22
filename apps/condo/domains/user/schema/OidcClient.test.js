/**
 * Generated by `createschema user.OidcClient 'clientId:Text; payload:Json; name?:Text; meta?:Json'`
 */

const { faker } = require('@faker-js/faker')

const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE } = require('@open-condo/keystone/test.utils')
const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAccessDeniedErrorToObjects,
    expectToThrowValidationFailureError,
    expectToThrowUniqueConstraintViolationError,
} = require('@open-condo/keystone/test.utils')

const {
    makeClientWithNewRegisteredAndLoggedInUser,
    makeClientWithSupportUser,
} = require('@condo/domains/user/utils/testSchema')
const { OidcClient, createTestOidcClient, updateTestOidcClient } = require('@condo/domains/user/utils/testSchema')

describe('OidcClient', () => {
    let admin
    let support
    let user
    let anonymous
    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        support = await makeClientWithSupportUser()
        user = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymous = await makeClient()
    })
    describe('CRUD tests', () => {
        describe('Create', () => {
            test('Admin can', async () => {
                const [obj, attrs] = await createTestOidcClient(admin)

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
            test('Support can', async () => {
                const [obj, attrs] = await createTestOidcClient(support)

                expect(obj.id).toMatch(UUID_RE)
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.createdBy).toEqual(expect.objectContaining({ id: support.user.id }))
            })
            test('User can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestOidcClient(user)
                })
            })
            test('Anonymous can\'t', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestOidcClient(anonymous)
                })
            })
        })
        describe('Update', () => {
            let oidcClient
            beforeEach(async () => {
                [oidcClient] = await createTestOidcClient(support)
            })
            test('Admin can', async () => {
                const [obj, attrs] = await updateTestOidcClient(admin, oidcClient.id)

                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
            })
            test('Support can', async () => {
                const [obj, attrs] = await updateTestOidcClient(support, oidcClient.id)

                expect(obj.id).toMatch(UUID_RE)
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.updatedBy).toEqual(expect.objectContaining({ id: support.user.id }))
            })
            test('User can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOidcClient(user, oidcClient.id)
                })
            })
            test('Anonymous can\'t', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestOidcClient(anonymous, oidcClient.id)
                })
            })
        })
        test('Hard-delete is prohibited', async () => {
            const [oidcClient] = await createTestOidcClient(support)
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await OidcClient.delete(admin, oidcClient.id)
            })
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await OidcClient.delete(support, oidcClient.id)
            })
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await OidcClient.delete(user, oidcClient.id)
            })
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await OidcClient.delete(anonymous, oidcClient.id)
            })
        })
        describe('Soft-delete', () => {
            let oidcClient
            beforeEach(async () => {
                [oidcClient] = await createTestOidcClient(support)
            })
            test('Admin can', async () => {
                const [softDeleted] = await OidcClient.softDelete(admin, oidcClient.id)

                expect(softDeleted).toHaveProperty('deletedAt')
                expect(softDeleted.deletedAt).not.toBeNull()
            })
            test('Support can', async () => {
                const [softDeleted] = await OidcClient.softDelete(support, oidcClient.id)

                expect(softDeleted).toHaveProperty('deletedAt')
                expect(softDeleted.deletedAt).not.toBeNull()
            })
            test('User can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await OidcClient.softDelete(user, oidcClient.id)
                })
            })
            test('anonymous can\'t', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await OidcClient.softDelete(anonymous, oidcClient.id)
                })
            })
        })
        describe('Read', () => {
            let oidcClient
            beforeAll(async () => {
                [oidcClient] = await createTestOidcClient(support)
            })
            test('Admin can', async () => {
                const readClient = await OidcClient.getOne(admin, { id: oidcClient.id })
                expect(readClient).toHaveProperty('id')
            })
            test('Support can', async () => {
                const readClient = await OidcClient.getOne(support, { id: oidcClient.id })
                expect(readClient).toHaveProperty('id')
            })
            test('User can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await OidcClient.getAll(user, {})
                })
            })
            test('Anonymous can\'t', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await OidcClient.getAll(anonymous, {})
                })
            })
        })
    })
    describe('Validations tests', () => {
        test('Can be created with same name', async () => {
            const name = faker.company.name()
            const [firstClient] = await createTestOidcClient(support, { name })
            expect(firstClient).toHaveProperty('name', name)
            const [secondClient] = await createTestOidcClient(support, { name })
            expect(secondClient).toHaveProperty('name', name)
        })
        test('Can\'t create without clientSecret', async () => {
            const admin = await makeLoggedInAdminClient()
            const clientId = faker.random.alphaNumeric(12)

            await expectToThrowValidationFailureError(async () => {
                await createTestOidcClient(admin, {
                    payload: {
                        client_id: clientId,
                        grant_types: ['implicit', 'authorization_code'],
                        // client_secret: faker.random.alphaNumeric(12), // Trying without this field
                        redirect_uris: ['https://jwt.io/'],
                        response_types: ['code id_token', 'code', 'id_token'],
                        token_endpoint_auth_method: 'client_secret_basic',
                    },
                })
            }, 'Invalid json structure of payload field')
        })
    })
    describe('Constraints test', () => {
        test('clientId field must be unique', async () => {
            const clientId = faker.datatype.uuid()
            const [oidcClient] = await createTestOidcClient(support, { clientId })
            expect(oidcClient).toHaveProperty('clientId', clientId)

            await expectToThrowUniqueConstraintViolationError(async () => {
                await createTestOidcClient(support, { clientId })
            }, 'oidc_client_unique_clientId')

            await OidcClient.softDelete(support, oidcClient.id)

            const [anotherClient] = await createTestOidcClient(support, { clientId })
            expect(anotherClient).toHaveProperty('clientId', clientId)
        })
    })
})
