/**
 * Generated by `createservice ticket.ExportIncidentsToExcelService`
 */

const faker = require('faker')

const {
    makeLoggedInAdminClient,
    makeClient,
    expectToThrowAccessDeniedErrorToResult,
    expectToThrowAuthenticationError,
} = require('@open-condo/keystone/test.utils')

const {
    createTestOrganization,
    createTestOrganizationEmployeeRole,
    createTestOrganizationEmployee,
} = require('@condo/domains/organization/utils/testSchema')
const { exportIncidentsToExcelByTestClient } = require('@condo/domains/ticket/utils/testSchema')
const { createTestIncident } = require('@condo/domains/ticket/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')


const INCIDENT_PAYLOAD = {
    details: faker.lorem.sentence(),
    workStart: faker.date.recent().toISOString(),
}

describe('ExportIncidentsToExcelService', () => {
    let employeeUser
    let notEmployeeUser
    let anonymous
    let organization
    let where
    beforeAll(async () => {
        const admin = await makeLoggedInAdminClient()
        employeeUser = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymous = await makeClient()

        const [testOrganization] = await createTestOrganization(admin)
        organization = testOrganization

        const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
            canManageIncidents: true,
        })

        await createTestOrganizationEmployee(admin, organization, employeeUser.user, role)

        notEmployeeUser = await makeClientWithNewRegisteredAndLoggedInUser()
        const [secondTestOrganization] = await createTestOrganization(admin)
        const [secondRole] = await createTestOrganizationEmployeeRole(admin, secondTestOrganization, {
            canManageIncidents: true,
        })
        await createTestOrganizationEmployee(admin, secondTestOrganization, notEmployeeUser.user, secondRole)

        await createTestIncident(employeeUser, organization, INCIDENT_PAYLOAD)

        where = {
            where: { organization: { id: organization.id } },
            sortBy: 'id_ASC',
        }
    })
    describe('Accesses', () => {
        describe('Employee', () => {
            test('can get incidents export from selected organization', async () => {
                const [{ status, linkToFile }] = await exportIncidentsToExcelByTestClient(employeeUser, where)
                expect(status).toBe('ok')
                expect(linkToFile).not.toHaveLength(0)
            })
        })
        describe('Not employee', () => {
            test('can\'t get incidents export from selected organization', async () => {
                await expectToThrowAccessDeniedErrorToResult(async () => {
                    await exportIncidentsToExcelByTestClient(notEmployeeUser, where)
                })
            })
        })
        describe('Anonymous', () => {
            test('can\'t get incidents export', async () => {
                await expectToThrowAuthenticationError(async () => {
                    await exportIncidentsToExcelByTestClient(anonymous, where)
                }, 'result')
            })
        })
    })
})
