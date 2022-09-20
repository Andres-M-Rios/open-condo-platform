/**
 * Generated by `createschema scope.PropertyScope 'name:Text; organization:Relationship:Organization:CASCADE;isDefault:Checkbox;'`
 */

const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE, waitFor } = require('@condo/keystone/test.utils')

const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects,
} = require('@condo/domains/common/utils/testSchema')

const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')

const { PropertyScope, createTestPropertyScope, updateTestPropertyScope } = require('@condo/domains/scope/utils/testSchema')
const { createTestOrganization, createTestOrganizationEmployeeRole, createTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')
const faker = require('faker')
const { createTestTicketPropertyHint } = require('@condo/domains/ticket/utils/testSchema')

describe('PropertyScope', () => {
    describe('accesses', () => {
        describe('admin', () => {
            describe('can create PropertyScope', async () => {
                const admin = await makeLoggedInAdminClient()

                const [organization] = await createTestOrganization(admin)
                const [propertyScope] = await createTestPropertyScope(admin, organization)

                expect(propertyScope.id).toMatch(UUID_RE)
            })

            describe('can update property scope', async () => {
                const admin = await makeLoggedInAdminClient()

                const [organization] = await createTestOrganization(admin)
                const [propertyScope] = await createTestPropertyScope(admin, organization)

                const name = faker.lorem.word()
                const [updatedPropertyScope] = await updateTestPropertyScope(admin, propertyScope.id, {
                    name,
                })

                expect(updatedPropertyScope.id).toEqual(propertyScope.id)
                expect(updatedPropertyScope.name).toEqual(name)
            })
        })

        describe('employee', async () => {
            it('employee with canManagePropertyScopes ability: can create PropertyScope in his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                const [propertyScope] = await createTestPropertyScope(user, organization)

                expect(propertyScope.id).toMatch(UUID_RE)
            })

            it('employee with canManagePropertyScopes ability: cannot create PropertyScope in not his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [organization1] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestPropertyScope(user, organization1)
                })
            })

            it('employee without canManagePropertyScopes ability: cannot create PropertyScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestPropertyScope(user, organization)
                })
            })

            it('employee with canManagePropertyScopes ability: can update PropertyScope in his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                const [propertyScope] = await createTestPropertyScope(user, organization)

                const name = faker.lorem.word()
                const [updatedPropertyScope] = await updateTestPropertyScope(user, propertyScope.id, {
                    name,
                })

                expect(updatedPropertyScope.id).toEqual(propertyScope.id)
                expect(updatedPropertyScope.name).toEqual(name)
            })

            it('employee with canManagePropertyScopes ability: cannot update PropertyScope in not his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [organization1] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [scope] = await createTestPropertyScope(admin, organization1)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestPropertyScope(user, scope.id)
                })
            })

            it('employee without canManagePropertyScopes ability: cannot update PropertyScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [scope] = await createTestPropertyScope(admin, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestPropertyScope(user, scope.id)
                })
            })
        })

        describe('anonymous', async () => {
            it('cannot create PropertyScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [organization] = await createTestOrganization(admin)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestPropertyScope(anonymous, organization)
                })
            })

            it('cannot update PropertyScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [organization] = await createTestOrganization(admin)
                const [scope] = await await createTestPropertyScope(admin, organization)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestPropertyScope(anonymous, scope.id)
                })
            })
        })
    })
})