/**
 * Generated by `createschema billing.BillingReceipt 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; importId?:Text; property:Relationship:BillingProperty:CASCADE; account:Relationship:BillingAccount:CASCADE; period:CalendarDay; raw:Json; toPay:Text; services:Json; meta:Json'`
 */

const { createTestBillingIntegrationOrganizationContext } = require('../utils/testSchema')
const { makeOrganizationIntegrationManager } = require('../utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')
const { createTestBillingAccount } = require('../utils/testSchema')
const { createTestBillingProperty } = require('../utils/testSchema')
const { makeContextWithOrganizationAndIntegrationAsAdmin } = require('../utils/testSchema')
const { makeLoggedInAdminClient, makeClient } = require('@core/keystone/test.utils')
const { BillingReceipt, createTestBillingReceipt, updateTestBillingReceipt } = require('@condo/domains/billing/utils/testSchema')
const { expectToThrowAccessDeniedErrorToObj, expectToThrowAuthenticationErrorToObj } = require('@condo/domains/common/utils/testSchema')
const { catchErrorFrom } = require('@condo/domains/common/utils/testSchema')

describe('BillingReceipt', () => {

    describe('Validators', async () => {
        test('organization integration manager: update BillingReceipt toPayDetail', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)
            const payload = {
                toPayDetails: {
                    formula: 'charge+penalty',
                    charge: 12341,
                    penalty: -200,
                },
            }
            const [objUpdated] = await updateTestBillingReceipt(managerUserClient, obj.id, payload)

            expect(obj.id).toEqual(objUpdated.id)
            expect(objUpdated.toPayDetails.formula).toEqual('charge+penalty')
        })

        test('organization integration manager: update BillingReceipt services', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)
            const payload = {
                services: [
                    {
                        id: 'COLD-WATER',
                        name: 'Cold water',
                        toPay: 1000,
                        toPayDetails: {
                            formula: 'charge+penalty',
                            charge: 1000,
                            penalty: 0,
                        },
                    },
                    {
                        id: 'HOT-WATER',
                        name: 'Hot water',
                        toPay: 1800,
                        toPayDetails: {
                            formula: 'charge+penalty',
                            charge: 2000,
                            penalty: 200,
                        },
                    },
                    {
                        id: 'ELECTRICITY',
                        name: 'Electricity to power your toxicity!',
                        toPay: 3000,
                        toPayDetails: {
                            formula: 'charge+penalty',
                            charge: 6000,
                            penalty: -3000,
                        },
                    },
                ],
            }
            const [objUpdated] = await updateTestBillingReceipt(managerUserClient, obj.id, payload)

            expect(obj.id).toEqual(objUpdated.id)
            expect(objUpdated.services[0].id).toEqual('COLD-WATER')
        })

        test('organization integration manager: update BillingReceipt with wrong data in toPayDetails', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)

            // No formula in payload
            const payload = {
                toPayDetails: {
                    charge: 12341,
                    penalty: -200,
                },
            }

            await catchErrorFrom(
                async () => await updateTestBillingReceipt(managerUserClient, obj.id, payload),
                ({ errors, _ }) => {
                    expect(errors[0]).toMatchObject({
                        'message': 'You attempted to perform an invalid mutation',
                    })
                })
        })

        test('organization integration manager: update BillingReceipt with wrong data in period', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)

            // Bad period - month should always equal 1
            const payload = {
                period: '2011-02-15',
            }

            await catchErrorFrom(
                async () => await updateTestBillingReceipt(managerUserClient, obj.id, payload),
                ({ errors, _ }) => {
                    expect(errors[0]).toMatchObject({
                        'message': 'You attempted to perform an invalid mutation',
                    })
                })
        })

        test('organization integration manager: update BillingReceipt with wrong data in services', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)

            // Wrong services toPay details
            const payload = {
                services: [
                    {
                        id: '1',
                        toPay: '1200',
                        name: 'Water',
                        // No formula
                        toPayDetails: {
                            charge: 12341,
                            penalty: -200,
                        },
                    },
                ],
            }

            await catchErrorFrom(
                async () => await updateTestBillingReceipt(managerUserClient, obj.id, payload),
                ({ errors, _ }) => {
                    expect(errors[0]).toMatchObject({
                        'message': 'You attempted to perform an invalid mutation',
                    })
                })
        })

        test('organization integration manager: update BillingReceipt with wrong data in services 2', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)

            // No NAME in services
            const payload = {
                services: [
                    {
                        toPay: '1200',
                        toPayDetails: {
                            formula: 'charge+penalty',
                            charge: 12341,
                            penalty: -200,
                        },
                    },
                ],
            }

            await catchErrorFrom(
                async () => await updateTestBillingReceipt(managerUserClient, obj.id, payload),
                ({ errors, _ }) => {
                    expect(errors[0]).toMatchObject({
                        'message': 'You attempted to perform an invalid mutation',
                    })
                })
        })

        test('organization integration manager: update BillingReceipt period', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)

            const payload = {
                period: '2011-12-01',
            }

            const [objUpdated] = await updateTestBillingReceipt(managerUserClient, obj.id, payload)

            expect(obj.id).toEqual(objUpdated.id)
            expect(objUpdated.period).toEqual('2011-12-01')
        })
    })

    describe('Constrains', async () => {

        const TEST_IMPORT_ID = 'bedrock_220v'

        test('can create billing receipt with import id', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount, { importId: TEST_IMPORT_ID })

            expect(obj.account.id).toEqual(billingAccount.id)
            expect(obj.context.id).toEqual(context.id)
            expect(obj.property.id).toEqual(property.id)

            expect(obj.importId).toEqual(TEST_IMPORT_ID)
        })

        test('can create billing receipt with same import id but in different billing contexts', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)

            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const [receipt] = await createTestBillingReceipt(admin, context, property, billingAccount, { importId: TEST_IMPORT_ID })

            const { context: context2 } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property2] = await createTestBillingProperty(admin, context2)

            const [billingAccount2] = await createTestBillingAccount(admin, context2, property2)
            const [receipt2] = await createTestBillingReceipt(admin, context2, property2, billingAccount2, { importId: TEST_IMPORT_ID })

            expect(receipt.id).not.toEqual(receipt2.id)
            expect(receipt.importId).toEqual(receipt.importId)
            expect(receipt.context).not.toEqual(receipt2.context)
        })

        test('can update receipt with other fields and it does not break importId', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount, { importId: TEST_IMPORT_ID })
            const [updatedObj] = await updateTestBillingReceipt(admin, obj.id, { toPay: '221' })

            expect(obj.importId).toEqual(updatedObj.importId)
            expect(obj.importId).toEqual(updatedObj.importId)
        })

        test('can update receipt import id', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount, { importId: TEST_IMPORT_ID })
            const [updatedObj] = await updateTestBillingReceipt(admin, obj.id, { importId: TEST_IMPORT_ID + '2' })

            expect(obj.id).toEqual(updatedObj.id)
            expect(updatedObj.importId).toEqual(TEST_IMPORT_ID + '2')
        })

        test('can update importId to same importId', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount, { importId: TEST_IMPORT_ID })
            const [updatedObj] = await updateTestBillingReceipt(admin, obj.id, { importId: TEST_IMPORT_ID })

            expect(obj.importId).toEqual(updatedObj.importId)
            expect(obj.importId).toEqual(updatedObj.importId)
        })

        test('can create -> delete -> restore billingReceipt -> change importId', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount, { importId: TEST_IMPORT_ID })
            const [deletedObj] = await updateTestBillingReceipt(admin, obj.id, { deletedAt: 'true' })
            const [foundObj] = await BillingReceipt.getAll(admin, { deletedAt_not: null, importId: TEST_IMPORT_ID })
            const [restoredObj] = await updateTestBillingReceipt(admin, deletedObj.id, { deletedAt: null })
            const [changedObj] = await updateTestBillingReceipt(admin, restoredObj.id, { importId: TEST_IMPORT_ID + '22' })

            expect(obj.importId).toEqual(TEST_IMPORT_ID)
            expect(deletedObj.deletedAt).not.toBeNull()
            expect(foundObj.id).toEqual(obj.id)
            expect(restoredObj.deletedAt).toBeNull()
            expect(changedObj.importId).toEqual( TEST_IMPORT_ID + '22' )
        })

        test('cant create billing receipt with same import id in one context', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)

            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            await createTestBillingReceipt(admin, context, property, billingAccount, { importId: TEST_IMPORT_ID })

            await catchErrorFrom(async () => {
                await createTestBillingReceipt(admin, context, property, billingAccount, { importId: TEST_IMPORT_ID })
            }, (err) => {
                expect(err).toBeDefined()
                expect(err.errors[0].developerMessage).toContain('duplicate key value violates unique constraint')
            })
        })

        test('cant create billing receipt with empty import id', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            await catchErrorFrom(async () => {
                await createTestBillingReceipt(admin, context, property, billingAccount, { importId: '' })
            }, (err) => {
                expect(err).toBeDefined()
            })
        })

        test('cant create billing receipt with undefined import id', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            await catchErrorFrom(async () => {
                await createTestBillingReceipt(admin, context, property, billingAccount, { importId: undefined })
            }, (err) => {
                expect(err).toBeDefined()
            })
        })

        test('cant create billing receipt with null import id', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            await catchErrorFrom(async () => {
                await createTestBillingReceipt(admin, context, property, billingAccount, { importId: null })
            }, (err) => {
                expect(err).toBeDefined()
            })
        })


    })

    describe('Create', async () => {
        test('admin can create BillingReceipt', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount)

            expect(obj.account.id).toEqual(billingAccount.id)
            expect(obj.context.id).toEqual(context.id)
            expect(obj.property.id).toEqual(property.id)
        })

        test('organization integration manager can create BillingReceipt', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)

            expect(obj.account.id).toEqual(billingAccount.id)
            expect(obj.context.id).toEqual(context.id)
            expect(obj.property.id).toEqual(property.id)
        })

        test('user cant create BillingReceipt', async () => {
            const user = await makeClientWithNewRegisteredAndLoggedInUser()
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestBillingReceipt(user, context, property, billingAccount)
            })
        })

        test('anonymous cant create BillingReceipt', async () => {
            const client = await makeClient()
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)

            await expectToThrowAuthenticationErrorToObj(async () => {
                await createTestBillingReceipt(client, context, property, billingAccount)
            })
        })
    })

    describe('Read', () => {
        test('admin can read BillingReceipt', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount)
            const objs = await BillingReceipt.getAll(admin, { id: obj.id })

            expect(objs).toHaveLength(1)
        })

        test('organization integration manager can read BillingReceipt', async () => {
            const { organization, integration, managerUserClient } = await makeOrganizationIntegrationManager()
            const [context] = await createTestBillingIntegrationOrganizationContext(managerUserClient, organization, integration)
            const [property] = await createTestBillingProperty(managerUserClient, context)
            const [billingAccount] = await createTestBillingAccount(managerUserClient, context, property)
            const [obj] = await createTestBillingReceipt(managerUserClient, context, property, billingAccount)
            const objs = await BillingReceipt.getAll(managerUserClient, { id: obj.id })

            expect(objs).toHaveLength(1)
        })

        test('user cant read BillingReceipt', async () => {
            const user = await makeClientWithNewRegisteredAndLoggedInUser()
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const objs = await BillingReceipt.getAll(user, { id: billingAccount.id })

            expect(objs).toHaveLength(0)
        })
    })

    describe('Update', async () => {
        test('admin can update BillingReceipt', async () => {
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount)
            const payload = {
                toPayDetails: {
                    formula: 'calc+recalc',
                },
            }
            const [objUpdated] = await updateTestBillingReceipt(admin, obj.id, payload)

            expect(obj.id).toEqual(objUpdated.id)
            expect(objUpdated.toPayDetails.formula).toEqual('calc+recalc')
        })

        test('user cant update BillingReceipt', async () => {
            const user = await makeClientWithNewRegisteredAndLoggedInUser()
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount)
            const payload = {}
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestBillingReceipt(user, obj.id, payload)
            })
        })

        test('anonymous cant update BillingReceipt', async () => {
            const client = await makeClient()
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount)
            const payload = {}
            await expectToThrowAuthenticationErrorToObj(async () => {
                await updateTestBillingReceipt(client, obj.id, payload)
            })
        })
    })

    describe('Delete', async () => {
        test('user cant delete BillingReceipt', async () => {
            const user = await makeClientWithNewRegisteredAndLoggedInUser()
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await BillingReceipt.delete(user, obj.id)
            })
        })

        test('anonymous cant delete BillingReceipt', async () => {
            const client = await makeClient()
            const admin = await makeLoggedInAdminClient()
            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [property] = await createTestBillingProperty(admin, context)
            const [billingAccount] = await createTestBillingAccount(admin, context, property)
            const [obj] = await createTestBillingReceipt(admin, context, property, billingAccount)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await BillingReceipt.delete(client, obj.id)
            })
        })
    })
})

