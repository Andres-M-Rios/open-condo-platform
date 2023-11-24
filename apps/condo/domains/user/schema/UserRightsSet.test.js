/**
 * Generated by `createschema user.UserRightsSet 'name:Text'`
 */

const { faker } = require('@faker-js/faker')
const dayjs = require('dayjs')

const { makeLoggedInAdminClient, makeClient, waitFor } = require('@open-condo/keystone/test.utils')
const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAccessDeniedErrorToObjects,
    expectToThrowAccessDeniedErrorToResult,
} = require('@open-condo/keystone/test.utils')

const {
    createTestB2BApp,
    updateTestB2BApp,
    createTestB2BAppNewsSharingConfig,
    updateTestB2BAppNewsSharingConfig,
    createTestB2BAppAccessRightSet,
    updateTestB2BAppAccessRightSet,
    createTestB2BAppAccessRight,
    generatePermissionKey,
    createTestB2BAppPermission,
    updateTestB2BAppPermission,
    createTestB2CApp,
    updateTestB2CApp,
    createTestB2CAppAccessRight,
    createTestB2CAppProperty,
    updateTestB2CAppProperty,
    getFakeAddress,
    createTestB2CAppBuild,
    B2BApp,
    B2BAppNewsSharingConfig,
    B2BAppAccessRight,
    B2BAppAccessRightSet,
    B2BAppPermission,
    B2CApp,
    B2CAppAccessRight,
    B2CAppBuild,
    B2CAppProperty,
} = require('@condo/domains/miniapp/utils/testSchema')
const {
    DEV_PORTAL_MESSAGE_TYPE,
    MESSAGE_SENDING_STATUS,
    MESSAGE_SENT_STATUS,
} = require('@condo/domains/notification/constants/constants')
const { sendMessageByTestClient, Message } = require('@condo/domains/notification/utils/testSchema')
const {
    Organization,
    registerNewOrganization,
    createTestOrganization,
} = require('@condo/domains/organization/utils/testSchema')
const {
    UserRightsSet,
    createTestUserRightsSet,
    updateTestUserRightsSet,
    User,
    updateTestUser,
    makeClientWithNewRegisteredAndLoggedInUser,
    makeClientWithSupportUser,
    makeClientWithServiceUser,
    registerNewServiceUserByTestClient,
    createTestPhone,
} = require('@condo/domains/user/utils/testSchema')


function expectDeleted (obj) {
    expect(obj).toHaveProperty('deletedAt')
    expect(obj.deletedAt).not.toBeNull()
}

/**
 * We don't use  default function from "@condo/domains/organization/utils/testSchema"
 * because it updates many fields by default
 */
async function updateTestOrganization (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const attrs = {
        dv: 1,
        sender: { dv: 1, fingerprint: faker.random.alphaNumeric(8) },
        ...extraAttrs,
    }
    const obj = await Organization.update(client, id, attrs)
    return [obj, attrs]
}

describe('UserRightsSet', () => {
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
                const [rightsSet] = await createTestUserRightsSet(admin)
                expect(rightsSet).toHaveProperty('id')
            })
            test('Support can', async () => {
                const [rightsSet] = await createTestUserRightsSet(support)
                expect(rightsSet).toHaveProperty('id')
            })
            test('Other users cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestUserRightsSet(user)
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestUserRightsSet(anonymous)
                })
            })
        })
        describe('Read', () => {
            let rightsSet
            beforeAll(async () => {
                [rightsSet] = await createTestUserRightsSet(admin)
            })
            test('Admin can read any right set', async () => {
                const rightsSets = await UserRightsSet.getAll(admin, { id: rightsSet.id })
                expect(rightsSets).toHaveLength(1)
                expect(rightsSets).toEqual([
                    expect.objectContaining({ id: rightsSet.id }),
                ])
            })
            test('Support can read any right set', async () => {
                const rightsSets = await UserRightsSet.getAll(support, { id: rightsSet.id })
                expect(rightsSets).toHaveLength(1)
                expect(rightsSets).toEqual([
                    expect.objectContaining({ id: rightsSet.id }),
                ])
            })
            test('Other users can read only theirs current rights set', async () => {
                const [userSet] = await createTestUserRightsSet(admin)
                const anotherUser = await makeClientWithNewRegisteredAndLoggedInUser({
                    rightsSet: { connect: { id: userSet.id } },
                })
                const allSets = await UserRightsSet.getAll(anotherUser, {})
                expect(allSets).toHaveLength(1)
                expect(allSets).toEqual([
                    expect.objectContaining({ id: userSet.id }),
                ])

                const [updatedUser] = await updateTestUser(admin, anotherUser.user.id, {
                    rightsSet: { disconnectAll: true },
                })
                expect(updatedUser).toHaveProperty('rightsSet', null)
                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await UserRightsSet.getAll(anotherUser, {})
                })

                const [addedUser] = await updateTestUser(admin, anotherUser.user.id, {
                    rightsSet: { connect: { id: userSet.id } },
                })
                expect(addedUser).toHaveProperty(['rightsSet', 'id'], userSet.id)

                const [deletedSet] = await updateTestUserRightsSet(admin, userSet.id, {
                    deletedAt: dayjs().toISOString(),
                })
                expect(deletedSet.deletedAt).not.toBeNull()
                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await UserRightsSet.getAll(anotherUser, {})
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await UserRightsSet.getAll(anonymous, {})
                })
            })
        })
        describe('Update', () => {
            let rightsSet
            beforeAll(async () => {
                [rightsSet] = await createTestUserRightsSet(support)
            })
            test('Admin can', async () => {
                const name = faker.lorem.words(3)
                const [updated] = await updateTestUserRightsSet(admin, rightsSet.id, { name })
                expect(updated).toHaveProperty('name', name)
            })
            test('Support can', async () => {
                const name = faker.lorem.words(3)
                const [updated] = await updateTestUserRightsSet(support, rightsSet.id, { name })
                expect(updated).toHaveProperty('name', name)
            })
            test('Other users cannot', async () => {
                const name = faker.lorem.words(3)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestUserRightsSet(user, rightsSet.id, { name })
                })
            })
            test('Anonymous cannot', async () => {
                const name = faker.lorem.words(3)
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestUserRightsSet(anonymous, rightsSet.id, { name })
                })
            })
        })
        describe('Soft-delete', () => {
            let rightsSet
            beforeEach(async () => {
                [rightsSet] = await createTestUserRightsSet(support)
            })
            test('Admin can', async () => {
                const [updated] = await updateTestUserRightsSet(admin, rightsSet.id, { deletedAt: dayjs().toISOString() })
                expect(updated).toHaveProperty('deletedAt')
                expect(updated.deletedAt).not.toBeNull()
            })
            test('Support can', async () => {
                const [updated] = await updateTestUserRightsSet(support, rightsSet.id, { deletedAt: dayjs().toISOString() })
                expect(updated).toHaveProperty('deletedAt')
                expect(updated.deletedAt).not.toBeNull()
            })
            test('Other users cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestUserRightsSet(user, rightsSet.id, { deletedAt: dayjs().toISOString() })
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestUserRightsSet(anonymous, rightsSet.id, { deletedAt: dayjs().toISOString() })
                })
            })
        })
        test('Hard-delete is not allowed', async () => {
            const [rightsSet] = await createTestUserRightsSet(admin)
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await UserRightsSet.delete(admin, rightsSet.id)
            })
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await UserRightsSet.delete(support, rightsSet.id)
            })
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await UserRightsSet.delete(user, rightsSet.id)
            })
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await UserRightsSet.delete(anonymous, rightsSet.id)
            })
        })
    })
    describe('Basic logic', () => {
        describe('canManage<Schema>', () => {
            test('Must give access to managing schema', async () => {
                const executor = await makeClientWithNewRegisteredAndLoggedInUser()

                // No access by default
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestB2BApp(executor)
                })

                // Access provided
                const [rightsSet] = await createTestUserRightsSet(support, {
                    canManageB2BApps: true,
                    canReadB2BApps: true,
                })
                const [updatedUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { connect: { id: rightsSet.id } },
                })
                expect(updatedUser).toHaveProperty(['rightsSet', 'id'], rightsSet.id)
                const [createdApp] = await createTestB2BApp(executor)
                expect(createdApp).toHaveProperty('id')

                // Access removed from specific user
                const [removedAccessUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { disconnectAll: true },
                })
                expect(removedAccessUser).toHaveProperty('rightsSet', null)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestB2BApp(executor, createdApp.id, { name: faker.commerce.productName() })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestB2BApp(executor)
                })

                // Access provided again
                const [addedAccessUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { connect: { id: rightsSet.id } },
                })
                expect(addedAccessUser).toHaveProperty(['rightsSet', 'id'], rightsSet.id)
                const newName = faker.commerce.productName()
                const [updatedApp] = await updateTestB2BApp(executor, createdApp.id, {
                    name: newName,
                })
                expect(updatedApp).toHaveProperty('name', newName)

                // User rights set deleted -> User should lose accesses
                const [deletedSet] = await updateTestUserRightsSet(support, rightsSet.id, {
                    deletedAt: dayjs().toISOString(),
                })
                expect(deletedSet).toHaveProperty('deletedAt')
                expect(deletedSet.deletedAt).not.toBeNull()
                const deletedRightsUser = await User.getOne(support, { id: executor.user.id })
                expect(deletedRightsUser).toHaveProperty('rightsSet', null)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestB2BApp(executor, createdApp.id, { name: faker.commerce.productName() })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestB2BApp(executor)
                })
            })
        })
        describe('canRead<Schema>', () => {
            test('Must give access to view schema objects', async () => {
                const reader = await makeClientWithNewRegisteredAndLoggedInUser()
                const [org] = await registerNewOrganization(support)

                // No access by default
                const allOrganizations1 = await Organization.getAll(reader, {})
                expect(allOrganizations1).toHaveLength(0)

                // Access provided
                const [rightsSet] = await createTestUserRightsSet(support, {
                    canReadOrganizations: true,
                })
                const [updatedUser] = await updateTestUser(support, reader.user.id, {
                    rightsSet: { connect:{ id: rightsSet.id } },
                })
                expect(updatedUser).toHaveProperty(['rightsSet', 'id'], rightsSet.id)
                const filteredOrganizations1 = await Organization.getAll(reader, { id: org.id })
                expect(filteredOrganizations1).toHaveLength(1)
                expect(filteredOrganizations1).toEqual([expect.objectContaining({
                    id: org.id,
                })])

                // Access removed from specific user
                const [removedAccessUser] = await updateTestUser(support, reader.user.id, {
                    rightsSet: { disconnectAll: true },
                })
                expect(removedAccessUser).toHaveProperty('rightsSet', null)
                const allOrganizations2 = await Organization.getAll(reader, {})
                expect(allOrganizations2).toHaveLength(0)

                // Access provided again
                const [addedAccessUser] = await updateTestUser(support, reader.user.id, {
                    rightsSet: { connect: { id: rightsSet.id } },
                })
                expect(addedAccessUser).toHaveProperty(['rightsSet', 'id'], rightsSet.id)
                const filteredOrganizations2 = await Organization.getAll(reader, { id: org.id })
                expect(filteredOrganizations2).toHaveLength(1)
                expect(filteredOrganizations2).toEqual([expect.objectContaining({
                    id: org.id,
                })])

                // User rights set deleted -> User should lose accesses
                const [deletedSet] = await updateTestUserRightsSet(support, rightsSet.id, {
                    deletedAt: dayjs().toISOString(),
                })
                expect(deletedSet).toHaveProperty('deletedAt')
                expect(deletedSet.deletedAt).not.toBeNull()
                const deletedRightsUser = await User.getOne(support, { id: reader.user.id })
                expect(deletedRightsUser).toHaveProperty('rightsSet', null)
                const allOrganizations3 = await Organization.getAll(reader, {})
                expect(allOrganizations3).toHaveLength(0)
            })
        })
        describe('canExecute<Service>', () => {
            test('Must give access to execute service', async () => {
                const executor = await makeClientWithNewRegisteredAndLoggedInUser()

                // No access by default
                await expectToThrowAccessDeniedErrorToResult(async () => {
                    await registerNewServiceUserByTestClient(executor)
                })

                // Access provided
                const [rightsSet] = await createTestUserRightsSet(support, {
                    canExecuteRegisterNewServiceUser: true,
                })
                const [updatedUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { connect: { id: rightsSet.id } },
                })
                expect(updatedUser).toHaveProperty(['rightsSet', 'id'], rightsSet.id)
                const [registeredUser1] = await registerNewServiceUserByTestClient(executor)
                expect(registeredUser1).toHaveProperty('id')

                // Access removed from specific user
                const [removedAccessUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { disconnectAll: true },
                })
                expect(removedAccessUser).toHaveProperty('rightsSet', null)
                await expectToThrowAccessDeniedErrorToResult(async () => {
                    await registerNewServiceUserByTestClient(executor)
                })

                // Access provided again
                const [addedAccessUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { connect: { id: rightsSet.id } },
                })
                expect(addedAccessUser).toHaveProperty(['rightsSet', 'id'], rightsSet.id)
                const [registeredUser2] = await registerNewServiceUserByTestClient(executor)
                expect(registeredUser2).toHaveProperty('id')

                // User rights set deleted -> User should lose accesses
                const [deletedSet] = await updateTestUserRightsSet(support, rightsSet.id, {
                    deletedAt: dayjs().toISOString(),
                })
                expect(deletedSet.deletedAt).not.toBeNull()
                const deletedRightsUser = await User.getOne(support, { id: executor.user.id })
                expect(deletedRightsUser).toHaveProperty('rightsSet', null)
                await expectToThrowAccessDeniedErrorToResult(async () => {
                    await registerNewServiceUserByTestClient(executor)
                })
            })
        })
        describe('canManage<Schema><Field>Field', () => {
            test('Must give access to update schema field', async () => {
                const executor = await makeClientWithNewRegisteredAndLoggedInUser()
                const [org] = await createTestOrganization(support)
                expect(org).toHaveProperty('isApproved', true)

                // No access by default
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestOrganization(executor)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { isApproved: false })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name() })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name(), isApproved: false })
                })

                // Access provided
                const [rightsSet] = await createTestUserRightsSet(support, {
                    canReadOrganizations: true,
                    canManageOrganizationIsApprovedField: true,
                })
                const [updatedUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { connect: { id: rightsSet.id } },
                })
                expect(updatedUser).toHaveProperty(['rightsSet', 'id'], rightsSet.id)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestOrganization(executor)
                })
                const [updatedOrg] = await updateTestOrganization(executor, org.id, { isApproved: false })
                expect(updatedOrg).toHaveProperty('isApproved', false)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name() })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name(), isApproved: true })
                })

                // Access removed from specific user
                const [removedAccessUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { disconnectAll: true },
                })
                expect(removedAccessUser).toHaveProperty('rightsSet', null)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestOrganization(executor)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { isApproved: true })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name() })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name(), isApproved: true })
                })

                // Access provided again
                const [addedAccessUser] = await updateTestUser(support, executor.user.id, {
                    rightsSet: { connect: { id: rightsSet.id } },
                })
                expect(addedAccessUser).toHaveProperty(['rightsSet', 'id'], rightsSet.id)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestOrganization(executor)
                })
                const [updatedOrg2] = await updateTestOrganization(executor, org.id, { isApproved: true })
                expect(updatedOrg2).toHaveProperty('isApproved', true)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name() })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name(), isApproved: false })
                })

                // User rights set deleted -> User should lose accesses
                const [deletedSet] = await updateTestUserRightsSet(support, rightsSet.id, {
                    deletedAt: dayjs().toISOString(),
                })
                expect(deletedSet).toHaveProperty('deletedAt')
                expect(deletedSet.deletedAt).not.toBeNull()
                const deletedRightsUser = await User.getOne(support, { id: executor.user.id })
                expect(deletedRightsUser).toHaveProperty('rightsSet', null)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestOrganization(executor)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { isApproved: false })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name() })
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganization(executor, org.id, { name: faker.company.name(), isApproved: false })
                })
            })
        })
        describe('Mix canManage<Schema> and canManage<Schema><Field>Field', () => {
            let org
            beforeEach(async () => {
                const [organization] = await createTestOrganization(support)
                org = organization
            })
            describe('canManage<Schema>: true and canManage<Schema><Field>Field: true', () => {
                test('User can direct update any fields', async () => {
                    const [rightsSet] = await createTestUserRightsSet(support, {
                        canManageOrganizations: true, canManageOrganizationIsApprovedField: true,
                    })
                    const executor = await makeClientWithNewRegisteredAndLoggedInUser({ rightsSet: { connect: { id: rightsSet.id } } })
                    const [updatedOrg, attrs] = await updateTestOrganization(executor, org.id, { name: faker.company.name(), isApproved: false })
                    expect(updatedOrg.name).toEqual(attrs.name)
                    expect(updatedOrg.isApproved).toBeFalsy()
                })
            })
            describe('canManage<Schema>: true and canManage<Schema><Field>Field: false', () => {
                test('User cannot direct update <Field> field and can other fields', async () => {
                    const [rightsSet] = await createTestUserRightsSet(support, {
                        canManageOrganizations: true, canManageOrganizationIsApprovedField: false,
                    })
                    const executor = await makeClientWithNewRegisteredAndLoggedInUser({ rightsSet: { connect: { id: rightsSet.id } } })
                    const [updatedOrg, attrs] = await updateTestOrganization(executor, org.id, { name: faker.company.name() })
                    expect(updatedOrg.name).toEqual(attrs.name)
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await updateTestOrganization(executor, org.id, { isApproved: false, name: faker.company.name() })
                    })
                })
            })
            describe('canManage<Schema>: false and canManage<Schema><Field>Field: true', () => {
                test('User can direct update <Field> field only', async () => {
                    const [rightsSet] = await createTestUserRightsSet(support, {
                        canManageOrganizations: false, canManageOrganizationIsApprovedField: true,
                    })
                    const executor = await makeClientWithNewRegisteredAndLoggedInUser({ rightsSet: { connect: { id: rightsSet.id } } })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await updateTestOrganization(executor, org.id, { isApproved: false, name: faker.company.name() })
                    })
                    const updatedOrg = await Organization.update(executor, org.id, {
                        dv: 1,
                        sender: { dv: 1, fingerprint: faker.random.alphaNumeric(8) },
                        isApproved: false,
                    })
                    expect(updatedOrg.isApproved).toBeFalsy()
                })
            })
            describe('canManage<Schema>: false and canManage<Schema><Field>Field: false', () => {
                test('User cannot direct update any fields', async () => {
                    const [rightsSet] = await createTestUserRightsSet(support, {
                        canManageOrganizations: false, canManageOrganizationIsApprovedField: false,
                    })
                    const executor = await makeClientWithNewRegisteredAndLoggedInUser({ rightsSet: { connect: { id: rightsSet.id } } })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await Organization.update(executor, org.id, {
                            dv: 1,
                            sender: { dv: 1, fingerprint: faker.random.alphaNumeric(8) },
                            isApproved: false,
                        })
                    })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await updateTestOrganization(executor, org.id, { name: faker.company.name() })
                    })
                })
            })
        })
        describe('Specific right sets', () => {
            describe('Dev-portal service user', () => {
                let portalClient
                beforeAll(async () => {
                    const [portalRightSet] = await createTestUserRightsSet(support, {
                        canReadB2BApps: true,
                        canReadB2BAppAccessRights: true,
                        canReadB2BAppAccessRightSets: true,
                        canReadB2BAppPermissions: true,
                        canReadB2BAppNewsSharingConfigs: true,
                        canReadB2CApps: true,
                        canReadB2CAppAccessRights: true,
                        canReadB2CAppBuilds: true,
                        canReadB2CAppProperties: true,

                        canManageB2BApps: true,
                        canManageB2BAppAccessRights: true,
                        canManageB2BAppAccessRightSets: true,
                        canManageB2BAppPermissions: true,
                        canManageB2BAppNewsSharingConfigs: true,
                        canManageB2CApps: true,
                        canManageB2CAppAccessRights: true,
                        canManageB2CAppBuilds: true,
                        canManageB2CAppProperties: true,

                        canExecuteRegisterNewServiceUser: true,
                        canExecuteSendMessage: true,
                    })
                    portalClient = await makeClientWithServiceUser({
                        rightsSet: { connect: { id: portalRightSet.id } },
                    })
                })
                test('Can manage all miniapp-related models (without context)', async () => {
                    // Create / update section
                    const [b2bApp] = await createTestB2BApp(portalClient)
                    expect(b2bApp).toHaveProperty('id')
                    const b2bAppName = faker.commerce.productName()
                    const [updatedB2BApp] = await updateTestB2BApp(portalClient, b2bApp.id, {
                        name: b2bAppName,
                    })
                    expect(updatedB2BApp).toHaveProperty('name', b2bAppName)

                    const [b2bAppNewsSharingConfig] = await createTestB2BAppNewsSharingConfig(portalClient)
                    expect(b2bAppNewsSharingConfig).toHaveProperty('id')
                    const b2bAppNewsSharingConfigName = faker.commerce.productName()
                    const [updatedB2BAppNewsSharingConfig] = await updateTestB2BAppNewsSharingConfig(portalClient, b2bAppNewsSharingConfig.id, {
                        name: b2bAppNewsSharingConfigName,
                    })
                    expect(updatedB2BAppNewsSharingConfig).toHaveProperty('name', b2bAppNewsSharingConfigName)

                    const [serviceUser] = await registerNewServiceUserByTestClient(portalClient)
                    expect(serviceUser).toHaveProperty('id')

                    const [accessRightSet] = await createTestB2BAppAccessRightSet(portalClient, b2bApp, { canManageContacts: false })
                    expect(accessRightSet).toHaveProperty('id')
                    expect(accessRightSet).toHaveProperty('canManageContacts', false)
                    const [b2bAccessRight] = await createTestB2BAppAccessRight(portalClient, serviceUser, b2bApp, accessRightSet)
                    expect(b2bAccessRight).toHaveProperty('id')
                    const [updatedRightSet] = await updateTestB2BAppAccessRightSet(portalClient, accessRightSet.id, {
                        canManageContacts: true,
                    })
                    expect(updatedRightSet).toHaveProperty('canManageContacts', true)

                    const permissionKey = generatePermissionKey()
                    const [permission] = await createTestB2BAppPermission(portalClient, b2bApp, { key: permissionKey })
                    expect(permission).toHaveProperty('id')
                    expect(permission).toHaveProperty('key', permissionKey)
                    const newPermissionKey = generatePermissionKey()
                    const [updatedPermission] = await updateTestB2BAppPermission(portalClient, permission.id, {
                        key: newPermissionKey,
                    })
                    expect(updatedPermission).toHaveProperty('key', newPermissionKey)

                    const [b2cApp] = await createTestB2CApp(portalClient, {
                        importId: faker.datatype.uuid(),
                        importRemoteSystem: 'dev-api',
                    })
                    expect(b2cApp).toHaveProperty('id')

                    const [b2cAccessRight] = await createTestB2CAppAccessRight(portalClient, serviceUser, b2cApp)
                    expect(b2cAccessRight).toHaveProperty('id')

                    const [appProperty] = await createTestB2CAppProperty(portalClient, b2cApp)
                    expect(appProperty).toHaveProperty('id')
                    const [newAddress, addressMeta] = getFakeAddress()
                    const [updatedProperty] = await updateTestB2CAppProperty(portalClient, appProperty.id, {
                        address: newAddress,
                        addressMeta,
                    })
                    expect(updatedProperty).toHaveProperty('address', newAddress.toLowerCase())

                    const [build] = await createTestB2CAppBuild(portalClient, b2cApp, {
                        importId: faker.datatype.uuid(),
                        importRemoteSystem: 'dev-api',
                    })
                    expect(build).toHaveProperty('id')

                    const [updatedB2CApp] = await updateTestB2CApp(portalClient, b2cApp.id, {
                        currentBuild: { connect: { id: build.id } },
                    })
                    expect(updatedB2CApp).toHaveProperty(['currentBuild', 'id'], build.id)

                    // Read section
                    const readB2BApp = await B2BApp.getOne(portalClient, { id: b2bApp.id })
                    expect(readB2BApp).toHaveProperty('id')
                    const readB2BAppNewsSharingConfig = await B2BAppNewsSharingConfig.getOne(portalClient, { id: b2bAppNewsSharingConfig.id })
                    expect(readB2BAppNewsSharingConfig).toHaveProperty('id')
                    const readB2BAccessRight = await B2BAppAccessRight.getOne(portalClient, { id: b2bAccessRight.id })
                    expect(readB2BAccessRight).toHaveProperty('id')
                    const readRightSet = await B2BAppAccessRightSet.getOne(portalClient, { id: accessRightSet.id })
                    expect(readRightSet).toHaveProperty('id')
                    const readPermission = await B2BAppPermission.getOne(portalClient, { id: permission.id })
                    expect(readPermission).toHaveProperty('id')
                    const readB2CApp = await B2CApp.getOne(portalClient, { id: b2cApp.id })
                    expect(readB2CApp).toHaveProperty('id')
                    const readB2CAccessRight = await B2CAppAccessRight.getOne(portalClient, { id: b2cAccessRight.id })
                    expect(readB2CAccessRight).toHaveProperty('id')
                    const readBuild = await B2CAppBuild.getOne(portalClient, { id: build.id })
                    expect(readBuild).toHaveProperty('id')
                    const readProperty = await B2CAppProperty.getOne(portalClient, { id: appProperty.id })
                    expect(readProperty).toHaveProperty('id')

                    // Soft-delete section
                    const [deletedProperty] = await B2CAppProperty.softDelete(portalClient, readProperty.id)
                    expectDeleted(deletedProperty)
                    const [deletedBuild] = await B2CAppBuild.softDelete(portalClient, readBuild.id)
                    expectDeleted(deletedBuild)
                    const b2cAppWithoutBuild = await B2CApp.getOne(portalClient, { id: readB2CApp.id })
                    expect(b2cAppWithoutBuild).toHaveProperty('currentBuild', null)
                    const [deletedB2CAccessRights] = await B2CAppAccessRight.softDelete(portalClient, readB2CAccessRight.id)
                    expectDeleted(deletedB2CAccessRights)
                    const [deletedB2CApp] = await B2CApp.softDelete(portalClient, readB2CApp.id)
                    expectDeleted(deletedB2CApp)

                    const [deletedRightSet] = await B2BAppAccessRightSet.softDelete(portalClient, readRightSet.id)
                    expectDeleted(deletedRightSet)
                    const accessRightWithoutSet = await B2BAppAccessRight.getOne(portalClient, { id: readB2BAccessRight.id })
                    expect(accessRightWithoutSet).toHaveProperty('accessRightSet', null)
                    const [deletedB2BAccessRights] = await B2BAppAccessRight.softDelete(portalClient, readB2BAccessRight.id)
                    expectDeleted(deletedB2BAccessRights)
                    const [deletedPermission] = await B2BAppPermission.softDelete(portalClient, readPermission.id)
                    expectDeleted(deletedPermission)
                    const [deletedB2BApp] = await B2BApp.softDelete(portalClient, readB2BApp.id)
                    expectDeleted(deletedB2BApp)
                })
                test('Can send SMS-messages', async () => {
                    const meta = { dv: 1, body: faker.lorem.sentence(5) }

                    const [data] = await sendMessageByTestClient(portalClient, {
                        to: { phone: createTestPhone() },
                        type: DEV_PORTAL_MESSAGE_TYPE,
                        meta,
                    })

                    expect(data).toHaveProperty('id')
                    expect(data).toHaveProperty('status', MESSAGE_SENDING_STATUS)

                    await waitFor(async () => {
                        const message = await Message.getOne(admin, { id: data.id })

                        expect(message).toBeDefined()
                        expect(message).toHaveProperty('meta', meta)
                        expect(message).toHaveProperty('status', MESSAGE_SENT_STATUS)
                    })
                })
            })
            describe('Organization', () => {
                test('User with custom rights cannot create organization', async () => {
                    const [rightsSet] = await createTestUserRightsSet(support, { canManageOrganizations: false })
                    const executor = await makeClientWithNewRegisteredAndLoggedInUser({ rightsSet: { connect: { id: rightsSet.id } } })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await createTestOrganization(executor)
                    })
                    await createTestUserRightsSet(support, { canManageOrganizations: true, canManageOrganizationIsApprovedField: true })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await createTestOrganization(executor)
                    })
                })
            })
        })
    })
})
