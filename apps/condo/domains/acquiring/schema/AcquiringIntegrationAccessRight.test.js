/**
 * Generated by `createschema acquiring.AcquiringIntegrationAccessRight 'user:Relationship:User:PROTECT;'`
 */

const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser, makeClientWithServiceUser } = require('@condo/domains/user/utils/testSchema')
const { makeLoggedInAdminClient, makeClient } = require('@open-condo/keystone/test.utils')

const {
    AcquiringIntegrationAccessRight,
    createTestAcquiringIntegrationAccessRight,
    updateTestAcquiringIntegrationAccessRight,
    createTestAcquiringIntegration,
} = require('@condo/domains/acquiring/utils/testSchema')
const {
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAccessDeniedErrorToObjects,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowValidationFailureError,
    expectToThrowGQLError,
} = require('@open-condo/keystone/test.utils')
const {
    createTestBillingIntegration,
} = require('@condo/domains/billing/utils/testSchema')
const { NON_SERVICE_USER_ERROR } = require('@condo/domains/miniapp/constants')

describe('AcquiringIntegrationAccessRight', () => {
    describe('CRUD tests', () => {
        describe('create', () => {
            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()

                const client = await makeClientWithNewRegisteredAndLoggedInUser()

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAcquiringIntegrationAccessRight(client, integration, serviceUserClient.user)
                })
            })
            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()

                const anonymousClient = await makeClient()

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestAcquiringIntegrationAccessRight(anonymousClient, integration, serviceUserClient.user)
                })
            })
            test('support can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()

                const support = await makeClientWithSupportUser()
                const [integrationAccessRight] = await createTestAcquiringIntegrationAccessRight(support, integration, serviceUserClient.user)
                expect(integrationAccessRight).toEqual(
                    expect.objectContaining({
                        integration: { id: integration.id },
                        user: { id: serviceUserClient.user.id },
                    }),
                )
            })
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()

                const [integrationAccessRight] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)
                expect(integrationAccessRight).toEqual(
                    expect.objectContaining({
                        integration: { id: integration.id },
                        user: { id: serviceUserClient.user.id },
                    }),
                )
            })
        })
        describe('read',  () => {
            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)
                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await AcquiringIntegrationAccessRight.getAll(serviceUserClient)
                })
            })
            test('anonymous can\'t', async () => {
                const anonymousClient = await makeClient()
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await AcquiringIntegrationAccessRight.getAll(anonymousClient)
                })
            })
            test('support can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()

                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                const support = await makeClientWithSupportUser()

                const rights = await AcquiringIntegrationAccessRight.getAll(support, { id: right.id })
                expect(rights).toBeDefined()
                expect(rights).toHaveLength(1)
                expect(rights[0]).toHaveProperty('id', right.id)
            })
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()

                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                const rights = await AcquiringIntegrationAccessRight.getAll(admin, { id: right.id })
                expect(rights).toBeDefined()
                expect(rights).toHaveLength(1)
                expect(rights[0]).toHaveProperty('id', right.id)
            })
        })
        describe('update', () => {
            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                const client = await makeClientWithNewRegisteredAndLoggedInUser()

                const payload = {}
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAcquiringIntegrationAccessRight(client, right.id, payload)
                })
            })
            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                const anonymousClient = await makeClient()

                const payload = {}
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestAcquiringIntegrationAccessRight(anonymousClient, right.id, payload)
                })
            })
            test('support can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                const support = await makeClientWithSupportUser()
                const secondServiceUserClient = await makeClientWithServiceUser()
                const payload = {
                    user: { connect: { id: secondServiceUserClient.user.id } },
                }
                const [newRight] = await updateTestAcquiringIntegrationAccessRight(support, right.id, payload)
                expect(newRight).toEqual(expect.objectContaining({
                    user: { id: secondServiceUserClient.user.id },
                }))
            })
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                const payload = {
                    user: { connect: { id: serviceUserClient.user.id } },
                }
                const [newRights] = await updateTestAcquiringIntegrationAccessRight(admin, right.id, payload)
                expect(newRights).toEqual(expect.objectContaining({
                    user: { id: serviceUserClient.user.id },
                }))
            })
        })
        describe('hard delete', () => {
            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AcquiringIntegrationAccessRight.delete(client, right.id)
                })
            })
            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                const anonymousClient = await makeClient()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AcquiringIntegrationAccessRight.delete(anonymousClient, right.id)
                })
            })
            test('support can\'t', async () => {
                const support = await makeClientWithSupportUser()
                const [billingIntegration] = await createTestBillingIntegration(support)
                const [integration] = await createTestAcquiringIntegration(support, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                const [right] = await createTestAcquiringIntegrationAccessRight(support, integration, serviceUserClient.user)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AcquiringIntegrationAccessRight.delete(support, right.id)
                })
            })
            test('admin can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
                const serviceUserClient = await makeClientWithServiceUser()
                const [right] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AcquiringIntegrationAccessRight.delete(admin, right.id)
                })
            })
        })
    })
    describe('Validation tests', () => {
        test('Should have correct dv field (=== 1)', async () => {
            const admin = await makeLoggedInAdminClient()
            const [billingIntegration] = await createTestBillingIntegration(admin)
            const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
            const serviceUserClient = await makeClientWithServiceUser()
            await expectToThrowGQLError(async () => await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user, {
                dv: 2,
            }), {
                'code': 'BAD_USER_INPUT',
                'type': 'DV_VERSION_MISMATCH',
                'message': 'Wrong value for data version number',
                'mutation': 'createAcquiringIntegrationAccessRight',
                'messageForUser': '',
                'variable': ['data', 'dv'],
            })
            const [rights] = await createTestAcquiringIntegrationAccessRight(admin, integration, serviceUserClient.user)
            await expectToThrowGQLError(async () => await updateTestAcquiringIntegrationAccessRight(admin, rights.id, {
                dv: 2,
            }), {
                'code': 'BAD_USER_INPUT',
                'type': 'DV_VERSION_MISMATCH',
                'message': 'Wrong value for data version number',
                'mutation': 'updateAcquiringIntegrationAccessRight',
                'messageForUser': '',
                'variable': ['data', 'dv'],
            })
        })
        test('Cannot be created for non-service user', async () => {
            const admin = await makeLoggedInAdminClient()
            const [billingIntegration] = await createTestBillingIntegration(admin)
            const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
            const nonServiceUserClient = await makeClientWithNewRegisteredAndLoggedInUser()
            await expectToThrowValidationFailureError(async () => {
                await createTestAcquiringIntegrationAccessRight(admin, integration, nonServiceUserClient.user)
            }, NON_SERVICE_USER_ERROR)
        })
    })
})
