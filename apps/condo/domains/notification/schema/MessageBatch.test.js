/**
 * Generated by `createschema notification.MessageBatch 'messageType:Text; title:Text; message:Text; deepLink?:Text; targets:Json; status:Select:created,processing,failed,done; processingMeta?:Json;'`
 */
const { faker } = require('@faker-js/faker')
const dayjs = require('dayjs')

const {
    UUID_RE, DATETIME_RE,
    makeLoggedInAdminClient, makeClient, waitFor,
} = require('@open-condo/keystone/test.utils')
const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects,
    expectToThrowValidationFailureError,
} = require('@open-condo/keystone/test.utils')

const {
    JSON_EXPECT_ARRAY_ERROR,
    JSON_EXPECT_OBJECT_ERROR,
} = require('@condo/domains/common/constants/errors')
const { PUSH_TRANSPORT_FIREBASE, DEVICE_PLATFORM_ANDROID, APP_RESIDENT_ID_ANDROID, SMS_TRANSPORT, PUSH_TRANSPORT,
    EMAIL_TRANSPORT,
} = require('@condo/domains/notification/constants/constants')
const {
    Message,
    MessageBatch,
    createTestMessageBatch,
    updateTestMessageBatch, createTestRemoteClient, syncRemoteClientWithPushTokenByTestClient,
} = require('@condo/domains/notification/utils/testSchema')
const { getRandomFakeSuccessToken } = require('@condo/domains/notification/utils/testSchema/helpers')
const { makeClientWithResidentAccessAndProperty } = require('@condo/domains/property/utils/testSchema')
const {
    makeClientWithNewRegisteredAndLoggedInUser,
    makeClientWithSupportUser,
} = require('@condo/domains/user/utils/testSchema')

const {
    MESSAGE_BATCH_CREATED_STATUS,
    MESSAGE_BATCH_FAILED_STATUS,
    MESSAGE_BATCH_DONE_STATUS,
    CUSTOM_CONTENT_MESSAGE_TYPE,
    CUSTOM_CONTENT_MESSAGE_PUSH_TYPE,
    CUSTOM_CONTENT_MESSAGE_SMS_TYPE,
    CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE,
} = require('../constants/constants')
const { DATE_FORMAT, getUniqKey } = require('../tasks/sendMessageBatch.helpers')


describe('MessageBatch', () => {
    let admin, anonymous, support, userClient

    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        anonymous = await makeClient()
        support = await makeClientWithSupportUser()
        userClient = await makeClientWithNewRegisteredAndLoggedInUser()
    })

    describe('CRUD tests', () => {
        describe('create', () => {
            test('admin can', async () => {
                const [obj, attrs] = await createTestMessageBatch(admin)

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
                expect(obj.title).toMatch(attrs.title)
                expect(obj.message).toMatch(attrs.message)
                expect(obj.messageType).toMatch(attrs.messageType)
                expect(obj.deepLink).toMatch(attrs.deepLink)
                expect(obj.targets).toEqual(attrs.targets)
                expect(obj.status).toMatch(MESSAGE_BATCH_CREATED_STATUS)
            })

            test('support can', async () => {
                const [obj, attrs] = await createTestMessageBatch(support)

                expect(obj.id).toMatch(UUID_RE)
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(1)
                expect(obj.newId).toEqual(null)
                expect(obj.deletedAt).toEqual(null)
                expect(obj.createdBy).toEqual(expect.objectContaining({ id: support.user.id }))
                expect(obj.updatedBy).toEqual(expect.objectContaining({ id: support.user.id }))
                expect(obj.createdAt).toMatch(DATETIME_RE)
                expect(obj.updatedAt).toMatch(DATETIME_RE)
                expect(obj.title).toMatch(attrs.title)
                expect(obj.message).toMatch(attrs.message)
                expect(obj.messageType).toMatch(attrs.messageType)
                expect(obj.deepLink).toMatch(attrs.deepLink)
                expect(obj.targets).toEqual(attrs.targets)
                expect(obj.status).toMatch(MESSAGE_BATCH_CREATED_STATUS)
            })

            test('user can not', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestMessageBatch(userClient)
                })
            })

            test('anonymous can not', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestMessageBatch(anonymous)
                })
            })
        })

        describe('update', () => {
            test('admin can not ', async () => {
                const [objCreated] = await createTestMessageBatch(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestMessageBatch(admin, objCreated.id)
                })
            })

            test('support can not', async () => {
                const [objCreated] = await createTestMessageBatch(support)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestMessageBatch(support, objCreated.id)
                })
            })

            test('user can not', async () => {
                const [objCreated] = await createTestMessageBatch(admin)
                const client = await makeClientWithNewRegisteredAndLoggedInUser()

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestMessageBatch(client, objCreated.id)
                })
            })

            test('anonymous can not', async () => {
                const [objCreated] = await createTestMessageBatch(admin)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestMessageBatch(anonymous, objCreated.id)
                })
            })
        })

        describe('hard delete', () => {
            test('admin can not', async () => {
                const [objCreated] = await createTestMessageBatch(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await MessageBatch.delete(admin, objCreated.id)
                })
            })

            test('user can not', async () => {
                const [objCreated] = await createTestMessageBatch(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await MessageBatch.delete(userClient, objCreated.id)
                })
            })

            test('anonymous can not', async () => {
                const [objCreated] = await createTestMessageBatch(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await MessageBatch.delete(anonymous, objCreated.id)
                })
            })
        })

        describe('read', () => {
            test('admin can', async () => {
                const [obj, attrs] = await createTestMessageBatch(admin)
                const obj1 = await MessageBatch.getOne(admin, { id: obj.id })

                expect(obj1).not.toBeUndefined()
                expect(obj1).toEqual(
                    expect.objectContaining({
                        id: obj.id,
                        messageType: attrs.messageType,
                        title: attrs.title,
                        message: attrs.message,
                        deepLink: attrs.deepLink,
                        targets: attrs.targets,
                    }),
                )
            })

            test('support can', async () => {
                const [obj, attrs] = await createTestMessageBatch(support)
                const obj1 = await MessageBatch.getOne(support, { id: obj.id })

                expect(obj1).not.toBeUndefined()
                expect(obj1).toEqual(
                    expect.objectContaining({
                        id: obj.id,
                        messageType: attrs.messageType,
                        title: attrs.title,
                        message: attrs.message,
                        deepLink: attrs.deepLink,
                        targets: attrs.targets,
                    }),
                )
            })

            test('user can not', async () => {
                const [obj] = await createTestMessageBatch(admin)

                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await MessageBatch.getOne(userClient, { id: obj.id })
                })
            })

            test('anonymous can not', async () => {
                const [obj] = await createTestMessageBatch(admin)

                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await MessageBatch.getOne(anonymous, { id: obj.id })
                })
            })
        })
    })

    describe('Validation tests', () => {
        test('Non-object value in processingMeta fails', async () => {
            await expectToThrowValidationFailureError(
                async () => { await createTestMessageBatch(admin, { processingMeta: faker.random.alphaNumeric(8) }) },
                `${JSON_EXPECT_OBJECT_ERROR}processingMeta] Expect JSON Object`
            )
        })


        test('Non-array value in targets fails', async () => {
            await expectToThrowValidationFailureError(
                async () => { await createTestMessageBatch(admin, { targets: {} }) },
                `${JSON_EXPECT_ARRAY_ERROR}targets] Expect non-empty JSON Array`
            )
            await expectToThrowValidationFailureError(
                async () => { await createTestMessageBatch(admin, { targets: null }) },
                'Required field "targets" is null or undefined.'
            )
            await expectToThrowValidationFailureError(
                async () => { await createTestMessageBatch(admin, { targets: undefined }) },
                'Required field "targets" is null or undefined.'
            )
            await expectToThrowValidationFailureError(
                async () => { await createTestMessageBatch(admin, { targets: 17 }) },
                `${JSON_EXPECT_ARRAY_ERROR}targets] Expect non-empty JSON Array`
            )
            await expectToThrowValidationFailureError(
                async () => { await createTestMessageBatch(admin, { targets: 'some string value' }) },
                `${JSON_EXPECT_ARRAY_ERROR}targets] Expect non-empty JSON Array`
            )
        })

        test('Empty array in targets fails', async () => {
            await expectToThrowValidationFailureError(
                async () => { await createTestMessageBatch(admin, { targets: [] }) },
                `${JSON_EXPECT_ARRAY_ERROR}targets] Expect non-empty JSON Array`
            )
        })
    })

    describe('task', () => {
        it('handles messageBatch and creates push notification of CUSTOM_CONTENT_MESSAGE_PUSH_TYPE for user', async () => {
            const userClient = await makeClientWithResidentAccessAndProperty()
            const payload = {
                devicePlatform: DEVICE_PLATFORM_ANDROID,
                appId: APP_RESIDENT_ID_ANDROID,
            }

            await syncRemoteClientWithPushTokenByTestClient(userClient, payload)

            const extraData = { messageType: CUSTOM_CONTENT_MESSAGE_TYPE, targets: [userClient.user.id] }
            const [customMessage] = await createTestMessageBatch(admin, extraData)
            const date = dayjs().format(DATE_FORMAT)
            const messageWhere = {
                type: CUSTOM_CONTENT_MESSAGE_PUSH_TYPE,
                user: { id: userClient.user.id },
                uniqKey: getUniqKey(date, customMessage.title, userClient.user.id),
            }
            const messagesSort = { sortBy: ['createdAt_DESC'] }

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.processingMeta.successCnt).toEqual(1)
                expect(customMessage1.status).toEqual(MESSAGE_BATCH_DONE_STATUS)
            })

            await waitFor(async () => {
                const message = await Message.getOne(admin, messageWhere, messagesSort)

                expect(message).not.toBeUndefined()
                expect(message.type).toEqual(CUSTOM_CONTENT_MESSAGE_PUSH_TYPE)
                expect(message.user.id).toEqual(userClient.user.id)
            })
        })

        it('handles messageBatch and creates push notification of CUSTOM_CONTENT_MESSAGE_PUSH_TYPE for remoteClient', async () => {
            const payload = {
                pushTransport: PUSH_TRANSPORT_FIREBASE,
                pushToken: getRandomFakeSuccessToken(),
            }
            const [remoteClientObj] = await createTestRemoteClient(admin, payload)
            const remoteClientId = remoteClientObj.id
            const remoteClient = `rc:${remoteClientId}`
            const [customMessage] = await createTestMessageBatch(admin, { messageType: CUSTOM_CONTENT_MESSAGE_TYPE, targets: [remoteClient] })
            const date = dayjs().format(DATE_FORMAT)
            const messagesWhere = {
                type: CUSTOM_CONTENT_MESSAGE_PUSH_TYPE,
                remoteClient: { id: remoteClientId },
                uniqKey: getUniqKey(date, customMessage.title, remoteClient),
            }
            const messagesSort = { sortBy: ['createdAt_DESC'] }

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.processingMeta.successCnt).toEqual(1)
                expect(customMessage1.status).toEqual(MESSAGE_BATCH_DONE_STATUS)
            })

            await waitFor(async () => {
                const message = await Message.getOne(admin, messagesWhere, messagesSort)

                expect(message).not.toBeUndefined()
                expect(message.processingMeta.transports).toHaveLength(1)
                expect(message.processingMeta.transports[0]).toEqual(PUSH_TRANSPORT)
                expect(message.type).toEqual(CUSTOM_CONTENT_MESSAGE_PUSH_TYPE)
                expect(message.remoteClient.id).toEqual(remoteClientId)
            })
        })

        it('handles messageBatch and creates sms notification of CUSTOM_CONTENT_MESSAGE_SMS_TYPE for phone', async () => {
            const phone = faker.phone.number('+79#########')
            const [customMessage] = await createTestMessageBatch(admin, { messageType: CUSTOM_CONTENT_MESSAGE_TYPE, targets: [phone] })
            const date = dayjs().format(DATE_FORMAT)
            const messagesWhere = {
                type: CUSTOM_CONTENT_MESSAGE_SMS_TYPE,
                uniqKey: getUniqKey(date, customMessage.title, phone),
            }
            const messagesSort = { sortBy: ['createdAt_DESC'] }

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.processingMeta.successCnt).toEqual(1)
                expect(customMessage1.status).toEqual(MESSAGE_BATCH_DONE_STATUS)
            })

            await waitFor(async () => {
                const message = await Message.getOne(admin, messagesWhere, messagesSort)

                expect(message).not.toBeUndefined()
                expect(message.processingMeta.transports).toHaveLength(1)
                expect(message.processingMeta.transports[0]).toEqual(SMS_TRANSPORT)
                expect(message.type).toEqual(CUSTOM_CONTENT_MESSAGE_SMS_TYPE)
                expect(message.phone).toEqual(phone)
            })
        })

        it('handles messageBatch and creates email notification of CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE for email', async () => {
            const email = `${faker.random.alphaNumeric(8)}@${faker.random.alphaNumeric(8)}.com`
            const [customMessage] = await createTestMessageBatch(admin, { messageType: CUSTOM_CONTENT_MESSAGE_TYPE, targets: [email] })
            const date = dayjs().format(DATE_FORMAT)
            const messagesWhere = {
                type: CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE,
                uniqKey: getUniqKey(date, customMessage.title, email),
            }
            const messagesSort = { sortBy: ['createdAt_DESC'] }

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.processingMeta.successCnt).toEqual(1)
                expect(customMessage1.status).toEqual(MESSAGE_BATCH_DONE_STATUS)
            })

            await waitFor(async () => {
                const message = await Message.getOne(admin, messagesWhere, messagesSort)

                expect(message).not.toBeUndefined()
                expect(message.processingMeta.transports).toHaveLength(1)
                expect(message.processingMeta.transports[0]).toEqual(EMAIL_TRANSPORT)
                expect(message.type).toEqual(CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE)
                expect(message.email).toEqual(email)
            })
        })

        it('handles messageBatch and creates push notification for MessageBatch with type CUSTOM_CONTENT_MESSAGE_PUSH_TYPE', async () => {
            const userClient = await makeClientWithResidentAccessAndProperty()
            const payload = {
                devicePlatform: DEVICE_PLATFORM_ANDROID,
                appId: APP_RESIDENT_ID_ANDROID,
            }

            await syncRemoteClientWithPushTokenByTestClient(userClient, payload)

            const extraData = { messageType: CUSTOM_CONTENT_MESSAGE_PUSH_TYPE, targets: [userClient.user.id] }
            const [customMessage] = await createTestMessageBatch(admin, extraData)
            const date = dayjs().format(DATE_FORMAT)
            const messageWhere = {
                type: CUSTOM_CONTENT_MESSAGE_PUSH_TYPE,
                user: { id: userClient.user.id },
                uniqKey: getUniqKey(date, customMessage.title, userClient.user.id),
            }
            const messagesSort = { sortBy: ['createdAt_DESC'] }

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.processingMeta.successCnt).toEqual(1)
                expect(customMessage1.status).toEqual(MESSAGE_BATCH_DONE_STATUS)
            })

            await waitFor(async () => {
                const message = await Message.getOne(admin, messageWhere, messagesSort)

                expect(message).not.toBeUndefined()
                expect(message.processingMeta.transports).toHaveLength(1)
                expect(message.processingMeta.transports[0]).toEqual(PUSH_TRANSPORT)
                expect(message.type).toEqual(CUSTOM_CONTENT_MESSAGE_PUSH_TYPE)
                expect(message.user.id).toEqual(userClient.user.id)
            })
        })

        it('handles messageBatch and creates push notification for MessageBatch with type CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE', async () => {
            const email = `${faker.random.alphaNumeric(8)}@${faker.random.alphaNumeric(8)}.com`
            const [customMessage] = await createTestMessageBatch(admin, { messageType: CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE, targets: [email] })
            const date = dayjs().format(DATE_FORMAT)
            const messagesWhere = {
                type: CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE,
                uniqKey: getUniqKey(date, customMessage.title, email),
            }
            const messagesSort = { sortBy: ['createdAt_DESC'] }

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.processingMeta.successCnt).toEqual(1)
                expect(customMessage1.status).toEqual(MESSAGE_BATCH_DONE_STATUS)
            })

            await waitFor(async () => {
                const message = await Message.getOne(admin, messagesWhere, messagesSort)

                expect(message).not.toBeUndefined()
                expect(message.type).toEqual(CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE)
                expect(message.email).toEqual(email)
            })
        })

        it('handles messageBatch and creates push notification for MessageBatch with type CUSTOM_CONTENT_MESSAGE_SMS_TYPE', async () => {
            const userClient = await makeClientWithResidentAccessAndProperty()
            const [customMessage] = await createTestMessageBatch(admin, { messageType: CUSTOM_CONTENT_MESSAGE_SMS_TYPE, targets: [userClient.user.id] })
            const date = dayjs().format(DATE_FORMAT)
            const messagesWhere = {
                type: CUSTOM_CONTENT_MESSAGE_SMS_TYPE,
                uniqKey: getUniqKey(date, customMessage.title, userClient.user.id),
            }
            const messagesSort = { sortBy: ['createdAt_DESC'] }

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.processingMeta.successCnt).toEqual(1)
                expect(customMessage1.status).toEqual(MESSAGE_BATCH_DONE_STATUS)
            })

            await waitFor(async () => {
                const message = await Message.getOne(admin, messagesWhere, messagesSort)

                expect(message).not.toBeUndefined()
                expect(message.type).toEqual(CUSTOM_CONTENT_MESSAGE_SMS_TYPE)
                expect(message.user.id).toEqual(userClient.user.id)
            })
        })

        it('sends nothing for nonexistent user, broken email or phone, and other invalid targets ', async () => {
            const date = dayjs().format(DATE_FORMAT)
            // invalid targets
            const targets = [
                faker.datatype.uuid(), // non existent user
                faker.random.alphaNumeric(8), // some random string
                faker.phone.number('+79########'), //broken phone number
                faker.phone.number('+73#########'), //landline phone number
                `${faker.random.alphaNumeric(8)}@${faker.random.alphaNumeric(8)}`, // broken email
                '',
                null,
                17,
                new Date(),
            ]
            const [customMessage] = await createTestMessageBatch(admin, { messageType: CUSTOM_CONTENT_MESSAGE_TYPE, targets })

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.status).toEqual(MESSAGE_BATCH_FAILED_STATUS)
                expect(customMessage1.processingMeta.successCnt).toEqual(0)
                expect(customMessage1.processingMeta.failCnt).toEqual(targets.length)
            }, { delay: 2000 })

            const uniqKeys = targets.map(target => getUniqKey(date, customMessage.title, target))
            const messagesWhere = {
                type_in: [CUSTOM_CONTENT_MESSAGE_EMAIL_TYPE, CUSTOM_CONTENT_MESSAGE_PUSH_TYPE, CUSTOM_CONTENT_MESSAGE_SMS_TYPE],
                uniqKey_in: uniqKeys,
            }
            const messagesSort = { sortBy: ['createdAt_DESC'] }

            const messages = await Message.getAll(admin, messagesWhere, messagesSort)
            expect(messages).toHaveLength(0)
        })

        it('handles messageBatch, creates notifications of CUSTOM_CONTENT_MESSAGE_TYPE, skips duplicate targets', async () => {
            const email = `${faker.random.alphaNumeric(8)}@${faker.random.alphaNumeric(8)}.com`
            const phone = faker.phone.number('+79#########')
            const targets = [email, email, email, phone, phone, phone, admin.user.id, admin.user.id, admin.user.id]
            const [customMessage] = await createTestMessageBatch(admin, { messageType: CUSTOM_CONTENT_MESSAGE_TYPE, targets })

            await waitFor(async () => {
                const customMessage1 = await MessageBatch.getOne(admin, { id: customMessage.id })

                expect(customMessage1.status).toEqual(MESSAGE_BATCH_DONE_STATUS)
                expect(customMessage1.processingMeta.successCnt).toEqual(3)
                expect(customMessage1.processingMeta.duplicates).toEqual(6)
            })
        })
    })
})