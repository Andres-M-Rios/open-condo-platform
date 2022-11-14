/**
 * Generated by `createschema scope.PropertyScopeProperty 'propertyScope:Relationship:PropertyScope:CASCADE; employee:Relationship:OrganizationEmployee:CASCADE;'`
 */

const {
    makeLoggedInAdminClient,
    makeClient,
    UUID_RE,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAccessDeniedErrorToObj,
} = require('@open-condo/keystone/test.utils')

const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')

const { createTestPropertyScopeProperty, updateTestPropertyScopeProperty, createTestPropertyScope } = require('@condo/domains/scope/utils/testSchema')
const { createTestOrganization, createTestOrganizationEmployeeRole, createTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')

describe('PropertyScopeProperty', () => {
    describe('accesses', () => {
        describe('admin', () => {
            it('can create PropertyScopeProperty', async () => {
                const admin = await makeLoggedInAdminClient()

                const [organization] = await createTestOrganization(admin)
                const [propertyScope] = await createTestPropertyScope(admin, organization)
                const [property] = await createTestProperty(admin, organization)
                const [propertyScopeProperty] = await createTestPropertyScopeProperty(admin, propertyScope, property)

                expect(propertyScopeProperty.id).toMatch(UUID_RE)
            })

            it('can update PropertyScopeProperty', async () => {
                const admin = await makeLoggedInAdminClient()

                const [organization] = await createTestOrganization(admin)
                const [propertyScope] = await createTestPropertyScope(admin, organization)
                const [property] = await createTestProperty(admin, organization)
                const [propertyScopeProperty] = await createTestPropertyScopeProperty(admin, propertyScope, property)

                const [updatedPropertyScopeProperty] = await updateTestPropertyScopeProperty(admin, propertyScopeProperty.id, {})

                expect(updatedPropertyScopeProperty.id).toEqual(propertyScopeProperty.id)
            })
        })

        describe('employee', async () => {
            it('employee with canManagePropertyScopes ability: can create PropertyScopeProperty with property and propertyScope from his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [property] = await createTestProperty(admin, organization)

                const [propertyScope] = await createTestPropertyScope(user, organization)
                const [propertyScopeProperty] = await createTestPropertyScopeProperty(user, propertyScope, property)

                expect(propertyScopeProperty.id).toMatch(UUID_RE)
            })

            it('employee with canManagePropertyScopes ability: cannot create PropertyScopeProperty with propertyScope from in not his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [organization1] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [propertyScope] = await createTestPropertyScope(admin, organization1)
                const [property] = await createTestProperty(admin, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestPropertyScopeProperty(user, propertyScope, property)
                })
            })

            it('employee without canManagePropertyScopes ability: cannot create PropertyScopeProperty', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [propertyScope] = await createTestPropertyScope(admin, organization)
                const [property] = await createTestProperty(admin, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestPropertyScopeProperty(user, propertyScope, property)
                })
            })

            it('employee with canManagePropertyScopes ability: can soft delete PropertyScopeProperty in his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                const [propertyScope] = await createTestPropertyScope(user, organization)
                const [property] = await createTestProperty(admin, organization)
                const [propertyScopeProperty] = await createTestPropertyScopeProperty(user, propertyScope, property)

                const [updatedPropertyScopeEmployee] = await updateTestPropertyScopeProperty(user, propertyScopeProperty.id, {
                    deletedAt: 'true',
                })

                expect(updatedPropertyScopeEmployee.id).toEqual(propertyScopeProperty.id)
                expect(updatedPropertyScopeEmployee.deletedAt).toBeDefined()
            })

            it('employee with canManagePropertyScopes ability: cannot soft delete PropertyScopeProperty in not his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                const [organization1] = await createTestOrganization(admin)
                const [propertyScope] = await createTestPropertyScope(admin, organization1)
                const [property] = await createTestProperty(admin, organization1)
                const [propertyScopeProperty] = await createTestPropertyScopeProperty(admin, propertyScope, property)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestPropertyScopeProperty(user, propertyScopeProperty.id, {
                        deletedAt: 'true',
                    })
                })
            })

            it('employee with canManagePropertyScopes ability: cannot update PropertyScopeProperty in his organization if its not soft delete operation', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManagePropertyScopes: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                const [propertyScope] = await createTestPropertyScope(user, organization)
                const [propertyScope1] = await createTestPropertyScope(user, organization)
                const [property] = await createTestProperty(admin, organization)
                const [propertyScopeProperty] = await createTestPropertyScopeProperty(user, propertyScope, property)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestPropertyScopeProperty(user, propertyScopeProperty.id, {
                        propertyScope: { connect: { id: propertyScope1.id } },
                    })
                })
            })

            it('employee without canManagePropertyScopes ability: cannot update PropertyScopeProperty', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [propertyScope] = await createTestPropertyScope(admin, organization)
                const [property] = await createTestProperty(admin, organization)
                const [propertyScopeProperty] = await createTestPropertyScopeProperty(admin, propertyScope, property)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestPropertyScopeProperty(user, propertyScopeProperty.id, {
                        deletedAt: 'true',
                    })
                })
            })
        })

        describe('anonymous', async () => {
            it('cannot create PropertyScopeProperty', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [organization] = await createTestOrganization(admin)
                const [property] = await createTestProperty(admin, organization)
                const [propertyScope] = await createTestPropertyScope(admin, organization)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestPropertyScopeProperty(anonymous, propertyScope, property)
                })
            })

            it('cannot update PropertyScopeProperty', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [organization] = await createTestOrganization(admin)
                const [propertyScope] = await createTestPropertyScope(admin, organization)
                const [property] = await createTestProperty(admin, organization)
                const [propertyScopeProperty] = await createTestPropertyScopeProperty(admin, propertyScope, property)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestPropertyScopeProperty(anonymous, propertyScopeProperty.id, {})
                })
            })
        })
    })
})
