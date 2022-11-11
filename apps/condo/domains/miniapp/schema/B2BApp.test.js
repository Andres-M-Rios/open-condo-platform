/**
 * Generated by `createschema miniapp.B2BApp 'name:Text;'`
 */

const { makeLoggedInAdminClient, makeClient } = require('@open-condo/keystone/test.utils')
const { makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')

const { B2BApp, createTestB2BApp, updateTestB2BApp } = require('@condo/domains/miniapp/utils/testSchema')
const {
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowValidationFailureError,
} = require('@open-condo/keystone/test.utils')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')
const {
    MAP_GENERATION_FEATURE,
    LOCAL_APP_NO_INSTRUCTION_OR_MESSAGE_ERROR,
    GLOBAL_APP_NO_APP_URL_ERROR,
    NON_GLOBAL_APP_WITH_FEATURES_ERROR,
} = require('@condo/domains/miniapp/constants')

const faker = require('faker')


describe('B2BApp', () => {
    describe('CRUD', () => {
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
        describe('Create', () => {
            const createPayload = {
                name: faker.company.companyName().replace(/ /, '-').toUpperCase() + ' B2B APP',
                shortDescription: faker.commerce.productDescription(),
                developer: faker.company.companyName(),
                instruction: faker.datatype.string(),
                connectedMessage: faker.company.catchPhrase(),
            }
            test('Admin can', async () => {
                const [app] = await createTestB2BApp(admin, createPayload)
                expect(app).toBeDefined()
                expect(app).toEqual(expect.objectContaining(createPayload))
            })
            test('Support can', async () => {
                const [app] = await createTestB2BApp(support, createPayload)
                expect(app).toBeDefined()
                expect(app).toEqual(expect.objectContaining(createPayload))
            })
            test('User cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestB2BApp(user)
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestB2BApp(anonymous)
                })
            })
        })
        describe('Read', () => {
            let app
            beforeAll(async () => {
                [app] = await createTestB2BApp(admin)
            })
            test('Admin can', async () => {
                const apps = await B2BApp.getAll(admin, {
                    id: app.id,
                })
                expect(apps).toBeDefined()
                expect(apps).toHaveLength(1)
                expect(apps[0]).toHaveProperty('id', app.id)
                expect(apps[0]).toHaveProperty('name', app.name)
            })
            test('Support can', async () => {
                const apps = await B2BApp.getAll(support, {
                    id: app.id,
                })
                expect(apps).toBeDefined()
                expect(apps).toHaveLength(1)
                expect(apps[0]).toHaveProperty('id', app.id)
                expect(apps[0]).toHaveProperty('name', app.name)
            })
            test('User can', async () => {
                const apps = await B2BApp.getAll(user, {
                    id: app.id,
                })
                expect(apps).toBeDefined()
                expect(apps).toHaveLength(1)
                expect(apps[0]).toHaveProperty('id', app.id)
                expect(apps[0]).toHaveProperty('name', app.name)
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await B2BApp.getAll(anonymous, {
                        id: app.id,
                    })
                })
            })
        })
        describe('Update', () => {
            let createdApp
            const updatePayload = {
                name: faker.company.companyName().replace(/ /, '-').toUpperCase() + ' B2B APP',
            }
            beforeEach(async () => {
                [createdApp] = await createTestB2BApp(admin)
            })
            test('Admin can', async () => {
                const [app] = await updateTestB2BApp(admin, createdApp.id, updatePayload)
                expect(app).toBeDefined()
                expect(app).toEqual(expect.objectContaining(updatePayload))
            })
            test('Support can', async () => {
                const [app] = await updateTestB2BApp(support, createdApp.id, updatePayload)
                expect(app).toBeDefined()
                expect(app).toEqual(expect.objectContaining(updatePayload))
            })
            test('User cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestB2BApp(user, createdApp.id, updatePayload)
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestB2BApp(anonymous, createdApp.id, updatePayload)
                })
            })
        })
        describe('Delete', () => {
            let app
            beforeAll(async () => {
                [app] = await createTestB2BApp(admin)
            })
            test('Nobody can', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2BApp.delete(admin, app.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2BApp.delete(support, app.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2BApp.delete(user, app.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2BApp.delete(anonymous, app.id)
                })
            })
        })
    })
    describe('Validations', () => {
        test('Each non-global app must have appUrl or instruction and connectedMessage', async () => {
            const admin = await makeLoggedInAdminClient()
            await expectToThrowValidationFailureError(async () => {
                await createTestB2BApp(admin, {
                    isGlobal: false,
                    appUrl: null,
                    connectedMessage: null,
                    instruction: faker.datatype.string(),
                })
            }, LOCAL_APP_NO_INSTRUCTION_OR_MESSAGE_ERROR)
            await expectToThrowValidationFailureError(async () => {
                await createTestB2BApp(admin, {
                    isGlobal: false,
                    appUrl: null,
                    connectedMessage: faker.company.catchPhrase(),
                    instruction: null,
                })
            }, LOCAL_APP_NO_INSTRUCTION_OR_MESSAGE_ERROR)
            const [validApp] = await createTestB2BApp(admin, {
                isGlobal: false,
                appUrl: faker.internet.url(),
                connectedMessage: null,
                instruction: faker.datatype.string(),
            })
            await expectToThrowValidationFailureError(async () => {
                await updateTestB2BApp(admin, validApp.id, {
                    appUrl: null,
                })
            }, LOCAL_APP_NO_INSTRUCTION_OR_MESSAGE_ERROR)
        })
        test('Each global app must have appUrl', async () => {
            const admin = await makeLoggedInAdminClient()
            await expectToThrowValidationFailureError(async () => {
                await createTestB2BApp(admin, {
                    isGlobal: true,
                    appUrl: null,
                })
            }, GLOBAL_APP_NO_APP_URL_ERROR)
            const [validApp] = await createTestB2BApp(admin, {
                isGlobal: true,
                appUrl: faker.internet.url(),
            })
            await expectToThrowValidationFailureError(async () => {
                await updateTestB2BApp(admin, validApp.id, {
                    appUrl: null,
                })
            }, GLOBAL_APP_NO_APP_URL_ERROR)
        })
        describe('Features', () => {
            let admin
            beforeAll(async () => {
                admin = await makeLoggedInAdminClient()
            })
            test('Global B2B app may have features', async () => {
                const [app] = await createTestB2BApp(admin, {
                    appUrl: faker.internet.url(),
                    isGlobal: true,
                    features: [MAP_GENERATION_FEATURE],
                })

                expect(app).toHaveProperty('features', [MAP_GENERATION_FEATURE])

                const [secondApp] = await createTestB2BApp(admin, {
                    appUrl: faker.internet.url(),
                    isGlobal: true,
                })
                expect(secondApp).toHaveProperty('features', null)
                const [updatedApp] = await updateTestB2BApp(admin, secondApp.id, {
                    features: [MAP_GENERATION_FEATURE],
                })
                expect(updatedApp).toHaveProperty('features', [MAP_GENERATION_FEATURE])
            })
            test('Non-global B2B apps cannot have features', async () => {
                await expectToThrowValidationFailureError(async () => {
                    await createTestB2BApp(admin, {
                        isGlobal: false,
                        features: [MAP_GENERATION_FEATURE],
                    })
                }, NON_GLOBAL_APP_WITH_FEATURES_ERROR)

                const [app] = await createTestB2BApp(admin, { isGlobal: false })
                await expectToThrowValidationFailureError(async () => {
                    await updateTestB2BApp(admin, app.id, {
                        features: [MAP_GENERATION_FEATURE],
                    })
                }, NON_GLOBAL_APP_WITH_FEATURES_ERROR)
            })
            test('Must reset if app stop being global', async () => {
                const [globalApp] = await createTestB2BApp(admin, {
                    appUrl: faker.internet.url(),
                    isGlobal: true,
                    features: [MAP_GENERATION_FEATURE],
                })
                expect(globalApp).toHaveProperty('features', [MAP_GENERATION_FEATURE])
                const [updatedApp] = await updateTestB2BApp(admin, globalApp.id, {
                    isGlobal: false,
                })
                expect(updatedApp).toHaveProperty('features', null)
            })
        })
    })
})
