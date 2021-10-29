/**
 * Generated by `createschema acquiring.Payment 'amount:Decimal; currencyCode:Text; time:DateTimeUtc; accountNumber:Text; purpose?:Text; receipts:Relationship:BillingReceipt:PROTECT; multiPayment:Relationship:MultiPayment:PROTECT; context:Relationship:AcquiringIntegrationContext:PROTECT;' --force`
 */

const { makePayerAndPayments } = require('../utils/testSchema')
const { createTestOrganizationEmployee, createTestOrganizationEmployeeRole } = require('@condo/domains/organization/utils/testSchema')
const { makeClientWithSupportUser, makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')
const { makeClient } = require('@core/keystone/test.utils')

const {
    Payment,
    createTestPayment,
    updateTestPayment,
    makePayer,
    createTestAcquiringIntegrationAccessRight,
    createTestMultiPayment,
    createTestAcquiringIntegration,
} = require('@condo/domains/acquiring/utils/testSchema')
const {
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowValidationFailureError,
} = require('@condo/domains/common/utils/testSchema')

describe('Payment', () => {
    describe('CRUD tests', () => {
        describe('Create', () => {
            test('admin can', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)
                expect(payment).toBeDefined()
                expect(payment).toHaveProperty('id')
                // TODO (savelevMatthew) Add receipts later (custom gql?)
                // expect(payment).toHaveProperty(['receipt', 'id'], billingReceipts[0].id)
                expect(payment).toHaveProperty(['context', 'id'], acquiringContext.id)
            })
            test('support can\t', async () => {
                const { billingReceipts, acquiringContext } = await makePayer()
                const support = await makeClientWithSupportUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestPayment(support, billingReceipts[0], acquiringContext)
                })
            })
            test('user can\'t', async () => {
                const { billingReceipts, acquiringContext } = await makePayer()
                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestPayment(client, billingReceipts[0], acquiringContext)
                })
            })
            test('anonymous can\'t', async () => {
                const { billingReceipts, acquiringContext } = await makePayer()
                const anonymous = await makeClient()
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestPayment(anonymous, billingReceipts[0], acquiringContext)
                })
            })
        })
        describe('Read', () => {
            test('admin can', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                await createTestPayment(admin, billingReceipts[0], acquiringContext)

                const payments = await Payment.getAll(admin)
                expect(payments).toBeDefined()
                expect(payments).not.toHaveLength(0)
            })
            test('support can', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                await createTestPayment(admin, billingReceipts[0], acquiringContext)

                const support = await makeClientWithSupportUser()
                const payments = await Payment.getAll(support)
                expect(payments).toBeDefined()
                expect(payments).not.toHaveLength(0)
            })
            describe('user', () => {
                describe('resident can see it\'s own payments when it\'s linked to MultiPayment',  () => {
                    test('not linked', async () => {
                        const { admin, billingReceipts, acquiringContext, client } = await makePayer()
                        await createTestPayment(admin, billingReceipts[0], acquiringContext)

                        const payments = await Payment.getAll(client)
                        expect(payments).toBeDefined()
                        expect(payments).toHaveLength(0)
                    })
                    test('linked', async () => {
                        const { admin, payments: firstPayments, acquiringIntegration: firstAcquiringIntegration, client: firstClient } = await makePayerAndPayments()
                        const { payments: secondPayments, client: secondClient } = await makePayerAndPayments()
                        const [firstMultiPayment] = await createTestMultiPayment(admin, firstPayments, firstClient.user, firstAcquiringIntegration)
                        const [secondMultiPayment] = await createTestMultiPayment(admin, secondPayments, secondClient.user, firstAcquiringIntegration)

                        let { data: { objs: firstUserPayments } } = await Payment.getAll(firstClient, {}, { raw:true })
                        expect(firstUserPayments).toBeDefined()
                        expect(firstUserPayments).toHaveLength(1)
                        expect(firstUserPayments).toHaveProperty(['0', 'multiPayment', 'id'], firstMultiPayment.id)
                        let { data: { objs: secondUserPayments } } = await Payment.getAll(secondClient, {}, { raw:true })
                        expect(secondUserPayments).toBeDefined()
                        expect(secondUserPayments).toHaveLength(1)
                        expect(secondUserPayments).toHaveProperty(['0', 'multiPayment', 'id'], secondMultiPayment.id)
                    })
                })
                test('acquiring account can see it\'s own payments', async () => {
                    const { admin, billingReceipts, acquiringContext, acquiringIntegration } = await makePayer()
                    const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)
                    const {
                        billingReceipts: secondReceipts,
                        acquiringContext: secondContext,
                    } = await makePayer()
                    await createTestPayment(admin, secondReceipts[0], secondContext)
                    const integrationClient = await makeClientWithNewRegisteredAndLoggedInUser()
                    await createTestAcquiringIntegrationAccessRight(admin, acquiringIntegration, integrationClient.user)

                    const payments = await Payment.getAll(integrationClient)
                    expect(payments).toBeDefined()
                    expect(payments).toHaveLength(1)
                    expect(payments).toHaveProperty(['0', 'id'], payment.id)
                })
                test('Employee with `canReadPayments` can see organization payments', async () => {
                    const { admin, billingReceipts, acquiringContext, organization } = await makePayer()
                    const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)
                    const {
                        billingReceipts: secondReceipts,
                        acquiringContext: secondContext,
                    } = await makePayer()
                    await createTestPayment(admin, secondReceipts[0], secondContext)
                    const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                        canReadPayments: true,
                    })

                    const employeeClient = await makeClientWithNewRegisteredAndLoggedInUser()
                    await createTestOrganizationEmployee(admin, organization, employeeClient.user, role)
                    const payments = await Payment.getAll(employeeClient)
                    expect(payments).toBeDefined()
                    expect(payments).toHaveLength(1)
                    expect(payments).toHaveProperty(['0', 'id'], payment.id)
                })
                test('can\'t in other cases', async () => {
                    const { admin, billingReceipts, acquiringContext } = await makePayer()
                    await createTestPayment(admin, billingReceipts[0], acquiringContext)

                    const client = await makeClientWithNewRegisteredAndLoggedInUser()
                    const payments = await Payment.getAll(client)
                    expect(payments).toBeDefined()
                    expect(payments).toHaveLength(0)
                })
            })
            test('anonymous can\'t', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                await createTestPayment(admin, billingReceipts[0], acquiringContext)

                const anonymous = await makeClient()
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await Payment.getAll(anonymous)
                })
            })
        })
        describe('Update', () => {
            test('admin can', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)
                const payload = {
                    purpose: 'TEST',
                }
                const [updatedPayment] = await updateTestPayment(admin, payment.id, payload)
                expect(updatedPayment).toBeDefined()
                expect(updatedPayment).toEqual(expect.objectContaining(payload))
            })
            test('support can\'t', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)
                const payload = {}

                const support = await makeClientWithSupportUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestPayment(support, payment.id, payload)
                })
            })
            describe('user',  () => {
                test('acquiring integration can', async () => {
                    const { admin, billingReceipts, acquiringContext, acquiringIntegration } = await makePayer()
                    const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)
                    const integrationClient = await makeClientWithNewRegisteredAndLoggedInUser()
                    await createTestAcquiringIntegrationAccessRight(admin, acquiringIntegration, integrationClient.user)

                    const payload = {
                        purpose: 'TEST',
                    }

                    const [updatedPayment] = await updateTestPayment(integrationClient, payment.id, payload)

                    expect(updatedPayment).toBeDefined()
                    expect(updatedPayment).toEqual(expect.objectContaining(payload))
                })
                test('in other cases can\'t', async () => {
                    const { admin, billingReceipts, acquiringContext, client } = await makePayer()
                    const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)
                    const payload = {}

                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await updateTestPayment(client, payment.id, payload)
                    })
                })
            })
            test('anonymous can\'t', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)
                const payload = {}

                const anonymousClient = await makeClient()
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestPayment(anonymousClient, payment.id, payload)
                })
            })
        })
        describe('Delete', () => {
            test('admin can\'t', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Payment.delete(admin, payment.id)
                })
            })
            test('support can\'t', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)

                const support = await makeClientWithSupportUser()

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Payment.delete(support, payment.id)
                })
            })

            test('user can\'t', async () => {
                const { admin, billingReceipts, acquiringContext, client } = await makePayer()
                const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Payment.delete(client, payment.id)
                })
            })

            test('anonymous can\'t', async () => {
                const { admin, billingReceipts, acquiringContext } = await makePayer()
                const [payment] = await createTestPayment(admin, billingReceipts[0], acquiringContext)

                const anonymousClient = await makeClient()

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Payment.delete(anonymousClient, payment.id)
                })
            })
        })
    })
    describe.skip('validation tests', () => {
        test('cannot link to multipayment, if it\'s not containing billing receipts', async () => {
            const { admin, billingReceipts, acquiringContext, client, acquiringIntegration } = await makePayer(2)
            const [multiPayment] = await createTestMultiPayment(admin, [billingReceipts[0]], client.user, acquiringIntegration)

            await expectToThrowValidationFailureError(async () => {
                await createTestPayment(admin, billingReceipts[1], multiPayment, acquiringContext)
            })
        })
        test('cannot link to multipayment, if currency codes does not match', async () => {
            const { admin, billingReceipts, acquiringContext, client, acquiringIntegration } = await makePayer()
            const [multiPayment] = await createTestMultiPayment(admin, [billingReceipts[0]], client.user, acquiringIntegration)

            await expectToThrowValidationFailureError(async () => {
                await createTestPayment(admin, billingReceipts[0], multiPayment, acquiringContext, {
                    currencyCode: 'USD',
                })
            })
        })
        test('cannot link to multipayment with different integration', async () => {
            const { admin, billingReceipts, acquiringContext, client } = await makePayer()
            const [secondIntegration] = await createTestAcquiringIntegration(admin)
            const integrationClient = await makeClientWithNewRegisteredAndLoggedInUser()
            await createTestAcquiringIntegrationAccessRight(admin, secondIntegration, integrationClient.user)
            const [multiPayment] = await createTestMultiPayment(admin, billingReceipts, client.user, secondIntegration)

            await expectToThrowValidationFailureError(async () => {
                await createTestPayment(admin, billingReceipts[0], multiPayment, acquiringContext)
            })
        })
    })
    describe('real-life cases', async () => {
        test('mobile app requests payments by user and can\'t see sensetive data', async () => {
            const { admin, payments: firstPayments, acquiringIntegration: firstAcquiringIntegration, client: firstClient } = await makePayerAndPayments()
            await createTestMultiPayment(admin, firstPayments, firstClient.user, firstAcquiringIntegration)

            let { data: { objs: firstUserPayments } } = await Payment.getAll(firstClient, {}, { raw:true })
            const firstUserPayment = firstUserPayments[0]
            expect(firstUserPayment).toBeDefined()
            expect(firstUserPayment.status).toBeDefined()
            expect(firstUserPayment.amount).toBeDefined()
            expect(firstUserPayment.explicitFee).toBeDefined()
            expect(firstUserPayment.currencyCode).toBeDefined()
            expect(firstUserPayment.accountNumber).toBeDefined()
            expect(firstUserPayment.implicitFee).toBeNull()
            expect(firstUserPayment.frozenReceipt).toBeNull()
            expect(firstUserPayment.context).toBeNull()
        })
    })
})
