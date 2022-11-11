/**
 * Generated by `createservice acquiring.RegisterMultiPaymentForOneReceiptService`
 */

const faker = require('faker')
const dayjs = require('dayjs')

const {
    makeClient,
    makeLoggedInAdminClient,
} = require('@open-condo/keystone/test.utils')
const {
    AcquiringIntegration,
    registerMultiPaymentForOneReceiptByTestClient,
    createTestAcquiringIntegration,
    updateTestAcquiringIntegrationContext,
    makePayer,
    updateTestAcquiringIntegration,
} = require('@condo/domains/acquiring/utils/testSchema')
const {
    updateTestBillingReceipt,
    updateTestBillingIntegration,
    createTestBillingIntegration,
    updateTestBillingIntegrationOrganizationContext,
} = require('@condo/domains/billing/utils/testSchema')
const {
    expectToThrowAuthenticationError,
    expectToThrowAccessDeniedErrorToResult,
    catchErrorFrom,
} = require('@open-condo/keystone/test.utils')
const {
    FEE_CALCULATION_PATH,
    WEB_VIEW_PATH,
    DIRECT_PAYMENT_PATH,
} = require('@condo/domains/acquiring/constants/links')

describe('RegisterMultiPaymentForOneReceiptService', () => {
    describe('Execute', () => {
        describe('Staff', () => {
            test('From receipt', async () => {
                const {
                    billingReceipts,
                    acquiringContext,
                    acquiringIntegration,
                    admin,
                } = await makePayer()
                const hostUrl = acquiringIntegration.hostUrl
                const receipt = { id: billingReceipts[0].id }
                const acquiringIntegrationContext = { id: acquiringContext.id }
                const [result] = await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                expect(result).toBeDefined()
                expect(result).toHaveProperty('dv', 1)
                expect(result).toHaveProperty('multiPaymentId')
                expect(result).toHaveProperty('webViewUrl', `${hostUrl}${WEB_VIEW_PATH.replace('[id]', result.multiPaymentId)}`)
                expect(result).toHaveProperty('feeCalculationUrl', `${hostUrl}${FEE_CALCULATION_PATH.replace('[id]', result.multiPaymentId)}`)
                expect(result).toHaveProperty('directPaymentUrl', `${hostUrl}${DIRECT_PAYMENT_PATH.replace('[id]', result.multiPaymentId)}`)
            })
        })
        test('Anonymous user', async () => {
            const {
                billingReceipts,
                acquiringContext,
            } = await makePayer()
            const receipt = { id: billingReceipts[0].id }
            const acquiringIntegrationContext = { id: acquiringContext.id }
            const client = await makeClient()
            await expectToThrowAuthenticationError(async () => {
                await registerMultiPaymentForOneReceiptByTestClient(client, receipt, acquiringIntegrationContext)
            }, 'result')
        })
        test('Resident user', async () => {
            const {
                billingReceipts,
                acquiringContext,
                client,
            } = await makePayer()
            const receipt = { id: billingReceipts[0].id }
            const acquiringIntegrationContext = { id: acquiringContext.id }
            await expectToThrowAccessDeniedErrorToResult(async () => {
                await registerMultiPaymentForOneReceiptByTestClient(client, receipt, acquiringIntegrationContext)
            })
        })
    })
    describe('RegisterMultiPaymentForOneReceipt mutation Validations', () => {
        describe('Input checks', () => {
            test('Should check dv (=== 1)', async () => {
                const {
                    billingReceipts,
                    acquiringContext,
                    admin,
                } = await makePayer()
                const receipt = { id: billingReceipts[0].id }
                const acquiringIntegrationContext = { id: acquiringContext.id }

                await catchErrorFrom(async () => {
                    await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext, { dv: 2 })
                }, ({ errors }) => {
                    expect(errors).toMatchObject([{
                        message: 'Wrong value for data version number',
                        path: ['result'],
                        extensions: {
                            mutation: 'registerMultiPaymentForOneReceipt',
                            variable: ['data', 'dv'],
                            code: 'BAD_USER_INPUT',
                            type: 'DV_VERSION_MISMATCH',
                            message: 'Wrong value for data version number',
                        },
                    }])
                })
            })
            describe('Should check sender', () => {
                let acquiringIntegrationContext
                let receipt
                let admin
                beforeAll(async () => {
                    const data = await makePayer()
                    receipt = { id: data.billingReceipts[0].id }
                    acquiringIntegrationContext = { id: data.acquiringContext.id }
                    admin = data.admin
                })
                const cases = [
                    [2, faker.random.alphaNumeric(8)],
                    [1, faker.random.alphaNumeric(3)],
                    [1, faker.random.alphaNumeric(60)],
                    [1, 'КиРиЛЛиЦА'],
                ]
                test.each(cases)('dv: %p, fingerprint: %p', async (dv, fingerprint) => {
                    const sender = { dv, fingerprint }
                    await catchErrorFrom(async () => {
                        await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext, { sender })
                    }, ({ errors }) => {
                        expect(errors).toMatchObject([{
                            path: ['result'],
                            extensions: {
                                mutation: 'registerMultiPaymentForOneReceipt',
                                variable: ['data', 'sender'],
                                code: 'BAD_USER_INPUT',
                                type: 'WRONG_FORMAT',
                            },
                        }])
                        expect(errors[0].message).toMatch('Invalid format of "sender" field value.')
                        expect(errors[0].extensions.message).toMatch('Invalid format of "sender" field value.')
                    })
                })
            })
        })
        describe('BillingReceipts checks', () => {
            test('Should have existing ids', async () => {
                const {
                    acquiringContext,
                    admin,
                } = await makePayer()
                const missingReceiptId = faker.datatype.uuid()
                const receipt = { id: missingReceiptId }
                const acquiringIntegrationContext = { id: acquiringContext.id }
                await catchErrorFrom(async () => {
                    await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                }, ({ errors }) => {
                    expect(errors).toMatchObject([{
                        message: `Cannot find specified BillingReceipt with id ${missingReceiptId}`,
                        path: ['result'],
                        extensions: {
                            mutation: 'registerMultiPaymentForOneReceipt',
                            variable: ['data', 'receipt', 'id'],
                            code: 'BAD_USER_INPUT',
                            type: 'CANNOT_FIND_ALL_BILLING_RECEIPTS',
                            message: 'Cannot find specified BillingReceipt with id {missingReceiptId}',
                        },
                    }])
                })
            })
            test('Should be linked to BillingIntegration which supported by acquiring', async () => {
                const {
                    admin,
                    billingReceipts,
                    billingIntegration,
                    acquiringContext,
                    acquiringIntegration,
                } = await makePayer()
                const receipt = { id: billingReceipts[0].id }
                const acquiringIntegrationContext = { id: acquiringContext.id }
                const [newBillingIntegration] = await createTestBillingIntegration(admin)

                // remap acquiring integration with supported billing integrations
                await updateTestAcquiringIntegration(admin, acquiringIntegration.id, {
                    supportedBillingIntegrations: { connect: [{ id: newBillingIntegration.id }] },
                })
                await updateTestAcquiringIntegration(admin, acquiringIntegration.id, {
                    supportedBillingIntegrations: { disconnect: [{ id: billingIntegration.id }] },
                })

                await catchErrorFrom(async () => {
                    await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                }, ({ errors }) => {
                    expect(errors).toMatchObject([{
                        message: `AcquiringIntegration does not supports following BillingReceipt's BillingIntegration: ${billingIntegration.id}`,
                        path: ['result'],
                        extensions: {
                            mutation: 'registerMultiPaymentForOneReceipt',
                            variable: ['data', 'receipt', 'id'],
                            code: 'BAD_USER_INPUT',
                            type: 'ACQUIRING_INTEGRATION_DOES_NOT_SUPPORTS_BILLING_INTEGRATION',
                            message: 'AcquiringIntegration does not supports following BillingReceipt\'s BillingIntegration: {unsupportedBillingIntegration}',
                        },
                    }])
                })
            })
            describe('Cannot pay for receipts with negative toPay', () => {
                const cases = ['0.0', '-1', '-50.00', '-0.000000']
                test.each(cases)('ToPay: %p', async (toPay) => {
                    const {
                        admin,
                        billingReceipts,
                        acquiringContext,
                    } = await makePayer()
                    const receipt = { id: billingReceipts[0].id }
                    const acquiringIntegrationContext = { id: acquiringContext.id }
                    await updateTestBillingReceipt(admin, receipt.id, {
                        toPay,
                    })
                    await catchErrorFrom(async () => {
                        await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                    }, ({ errors }) => {
                        expect(errors).toMatchObject([{
                            message: `Cannot pay for BillingReceipt ${receipt.id} with negative "toPay" value`,
                            path: ['result'],
                            extensions: {
                                mutation: 'registerMultiPaymentForOneReceipt',
                                variable: ['data', 'receipt', 'id'],
                                code: 'BAD_USER_INPUT',
                                type: 'RECEIPTS_HAVE_NEGATIVE_TO_PAY_VALUE',
                                message: 'Cannot pay for BillingReceipt {id} with negative "toPay" value',
                            },
                        }])
                    })
                })
            })
        })
        describe('deletedAt check', () => {
            test('Should not be able to pay for deleted receipts', async () => {
                const {
                    admin,
                    billingReceipts,
                    acquiringContext,
                } = await makePayer()
                const receipt = { id: billingReceipts[0].id }
                const acquiringIntegrationContext = { id: acquiringContext.id }
                const deletedReceiptId = receipt.id
                await updateTestBillingReceipt(admin, deletedReceiptId, {
                    deletedAt: dayjs().toISOString(),
                })
                await catchErrorFrom(async () => {
                    await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                }, ({ errors }) => {
                    expect(errors).toMatchObject([{
                        message: `Cannot pay for deleted receipt ${deletedReceiptId}`,
                        path: ['result'],
                        extensions: {
                            mutation: 'registerMultiPaymentForOneReceipt',
                            variable: ['data', 'receipt', 'id'],
                            code: 'BAD_USER_INPUT',
                            type: 'RECEIPTS_ARE_DELETED',
                            message: 'Cannot pay for deleted receipt {id}',
                        },
                    }])
                })
            })
            test('Should not be able to pay for consumer with deleted acquiring context', async () => {
                const {
                    admin,
                    billingReceipts,
                    acquiringContext,
                } = await makePayer()
                const receipt = { id: billingReceipts[0].id }
                const acquiringIntegrationContext = { id: acquiringContext.id }
                await updateTestAcquiringIntegrationContext(admin, acquiringContext.id, {
                    deletedAt: dayjs().toISOString(),
                })
                await catchErrorFrom(async () => {
                    await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                }, ({ errors }) => {
                    expect(errors).toMatchObject([{
                        message: 'Cannot pay via deleted acquiring integration context',
                        path: ['result'],
                        extensions: {
                            mutation: 'registerMultiPaymentForOneReceipt',
                            variable: ['data', 'acquiringIntegrationContext', 'id'],
                            code: 'BAD_USER_INPUT',
                            type: 'ACQUIRING_INTEGRATION_CONTEXT_IS_DELETED',
                            message: 'Cannot pay via deleted acquiring integration context',
                        },
                    }])
                })
            })
            test('Should not be able to pay using deleted acquiring integration', async () => {
                const {
                    admin,
                    billingReceipts,
                    acquiringContext,
                    acquiringIntegration,
                } = await makePayer()
                const receipt = { id: billingReceipts[0].id }
                const acquiringIntegrationContext = { id: acquiringContext.id }
                await updateTestAcquiringIntegration(admin, acquiringIntegration.id, {
                    deletedAt: dayjs().toISOString(),
                })
                await catchErrorFrom(async () => {
                    await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                }, ({ errors }) => {
                    expect(errors).toMatchObject([{
                        message: `Cannot pay via deleted acquiring integration with id "${acquiringIntegration.id}"`,
                        path: ['result'],
                        extensions: {
                            mutation: 'registerMultiPaymentForOneReceipt',
                            variable: ['data', 'acquiringIntegrationContext', 'id'],
                            code: 'BAD_USER_INPUT',
                            type: 'ACQUIRING_INTEGRATION_IS_DELETED',
                            message: 'Cannot pay via deleted acquiring integration with id "{id}"',
                        },
                    }])
                })
            })
            test('Should not be able to pay for receipt with deleted BillingIntegrationOrganizationContext', async () => {
                const {
                    admin,
                    billingReceipts,
                    billingContext,
                    acquiringContext,
                } = await makePayer()
                const receipt = { id: billingReceipts[0].id }
                const acquiringIntegrationContext = { id: acquiringContext.id }
                await updateTestBillingIntegrationOrganizationContext(admin, billingContext.id, {
                    deletedAt: dayjs().toISOString(),
                })
                await catchErrorFrom(async () => {
                    await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                }, ({ errors }) => {
                    expect(errors).toMatchObject([{
                        message: 'BillingIntegrationOrganizationContext is deleted for provided BillingReceipt',
                        path: ['result'],
                        extensions: {
                            mutation: 'registerMultiPaymentForOneReceipt',
                            variable: ['data', 'receipt', 'id'],
                            code: 'BAD_USER_INPUT',
                            type: 'BILLING_INTEGRATION_ORGANIZATION_CONTEXT_IS_DELETED',
                            message: 'BillingIntegrationOrganizationContext is deleted for provided BillingReceipt',
                            data: {
                                failedReceipts: [{
                                    receiptId: receipt.id,
                                    contextId: billingContext.id,
                                }],
                            },
                        },
                    }])
                })
            })
            test('Should not be able to pay for BillingReceipt with deleted BillingIntegration', async () => {
                const {
                    admin,
                    billingReceipts,
                    billingIntegration,
                    acquiringContext,
                } = await makePayer()
                const receipt = { id: billingReceipts[0].id }
                const acquiringIntegrationContext = { id: acquiringContext.id }
                await updateTestBillingIntegration(admin, billingIntegration.id, {
                    deletedAt: dayjs().toISOString(),
                })
                await catchErrorFrom(async () => {
                    await registerMultiPaymentForOneReceiptByTestClient(admin, receipt, acquiringIntegrationContext)
                }, ({ errors }) => {
                    expect(errors).toMatchObject([{
                        message: 'BillingReceipt has deleted BillingIntegration',
                        path: ['result'],
                        extensions: {
                            mutation: 'registerMultiPaymentForOneReceipt',
                            variable: ['data', 'receipt', 'id'],
                            code: 'BAD_USER_INPUT',
                            type: 'RECEIPT_HAS_DELETED_BILLING_INTEGRATION',
                            message: 'BillingReceipt has deleted BillingIntegration',
                            data: {
                                failedReceipts: [{
                                    receiptId: receipt.id,
                                    integrationId: billingIntegration.id,
                                }],
                            },
                        },
                    }])
                })
            })
        })
    })
    // TODO(savelevMatthew): Remove this test after custom GQL refactoring
    describe('ServerSchema get all should provide enough fields', () => {
        test('AcquiringIntegration', async () => {
            const admin = await makeLoggedInAdminClient()
            const [firstBilling] = await createTestBillingIntegration(admin)
            const [secondBilling] = await createTestBillingIntegration(admin)
            const [acquiring] = await createTestAcquiringIntegration(admin, [firstBilling, secondBilling])
            const [serverObtainedAcquiring] = await AcquiringIntegration.getAll(admin, {
                id: acquiring.id,
            })
            expect(serverObtainedAcquiring).toBeDefined()
            expect(serverObtainedAcquiring).toHaveProperty('id')
            expect(serverObtainedAcquiring).toHaveProperty('canGroupReceipts')
            expect(serverObtainedAcquiring).toHaveProperty('supportedBillingIntegrations')
            expect(serverObtainedAcquiring.supportedBillingIntegrations).toHaveLength(2)
        })
    })
})
