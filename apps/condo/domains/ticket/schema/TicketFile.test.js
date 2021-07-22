/**
 * Generated by `createschema ticket.TicketFile 'organization:Text;file?:File;ticket?:Relationship:Ticket:SET_NULL;'`
 */

const { createTestOrganizationLinkEmployeeAccess } = require('@condo/domains/organization/utils/testSchema')
const { createTestTicket } = require('@condo/domains/ticket/utils/testSchema')
const { createTestOrganizationLinkWithTwoOrganizations } = require('@condo/domains/organization/utils/testSchema')
const { makeLoggedInAdminClient } = require('@core/keystone/test.utils')
const { makeClient, UUID_RE, DATETIME_RE } = require('@core/keystone/test.utils')
const { 
    TicketFile, 
    createTestTicketFile, 
    updateTestTicketFile,
    makeClientWithTicket,
} = require('@condo/domains/ticket/utils/testSchema')

const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { expectToThrowAuthenticationErrorToObjects, expectToThrowAccessDeniedErrorToObj, expectToThrowAuthenticationErrorToObj } = require('../../common/utils/testSchema')

describe('TicketFile', () => {
    describe('User', () => {
        it('can create temporary TicketFile [no ticket relation]', async () => {
            const client = await makeClientWithProperty()
            const [ticketFile, attrs] = await createTestTicketFile(client, client.organization)  
            expect(ticketFile.id).toMatch(UUID_RE)
            expect(ticketFile.dv).toEqual(1)
            expect(ticketFile.sender).toEqual(attrs.sender)
            expect(ticketFile.v).toEqual(1)
            expect(ticketFile.newId).toEqual(null)
            expect(ticketFile.deletedAt).toEqual(null)
            expect(ticketFile.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
            expect(ticketFile.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
            expect(ticketFile.createdAt).toMatch(DATETIME_RE)
            expect(ticketFile.updatedAt).toMatch(DATETIME_RE)
            expect(ticketFile.organization).toEqual(expect.objectContaining({ id: client.organization.id }))
        })
        it('can create TicketFile', async () => {
            const client = await makeClientWithTicket()
            const [ticketFile, attrs] = await createTestTicketFile(client, client.organization, client.ticket)  
            expect(ticketFile.id).toMatch(UUID_RE)
            expect(ticketFile.dv).toEqual(1)
            expect(ticketFile.sender).toEqual(attrs.sender)
            expect(ticketFile.v).toEqual(1)
            expect(ticketFile.newId).toEqual(null)
            expect(ticketFile.deletedAt).toEqual(null)
            expect(ticketFile.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
            expect(ticketFile.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
            expect(ticketFile.createdAt).toMatch(DATETIME_RE)
            expect(ticketFile.updatedAt).toMatch(DATETIME_RE)
            expect(ticketFile.organization).toEqual(expect.objectContaining({ id: client.organization.id }))
            expect(ticketFile.ticket).toEqual(expect.objectContaining({ id: client.ticket.id }))
        })
        it('can read TicketFile', async () => {
            const client = await makeClientWithTicket()
            const [ticketFile, attrs] = await createTestTicketFile(client, client.organization, client.ticket)  
            const objs = await TicketFile.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })
            expect(objs).toHaveLength(1)
            expect(objs[0].id).toMatch(ticketFile.id)
            expect(objs[0].dv).toEqual(1)
            expect(objs[0].sender).toEqual(attrs.sender)
            expect(objs[0].v).toEqual(1)
            expect(objs[0].newId).toEqual(null)
            expect(objs[0].deletedAt).toEqual(null)
            expect(objs[0].createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
            expect(objs[0].updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
            expect(objs[0].createdAt).toMatch(ticketFile.createdAt)
            expect(objs[0].updatedAt).toMatch(ticketFile.updatedAt)
        })
        it('cannot read TicketFile from another organization', async () => {
            const client = await makeClientWithTicket()
            await createTestTicketFile(client, client.organization, client.ticket)  
            const anotherClient = await makeClientWithTicket()
            const objs = await TicketFile.getAll(anotherClient, {}, { sortBy: ['updatedAt_DESC'] })
            expect(objs).toHaveLength(0)
        })
        it('can update temporary TicketFile', async () => {
            const client = await makeClientWithTicket()
            const [ticketFileCreated] = await createTestTicketFile(client, client.organization)  
            const [ticketFileUpdated, attrsUpdate] = await updateTestTicketFile(client, ticketFileCreated.id, { ticket: { connect: { id: client.ticket.id } } })
            expect(ticketFileUpdated.id).toEqual(ticketFileUpdated.id)
            expect(ticketFileUpdated.dv).toEqual(1)
            expect(ticketFileUpdated.sender).toEqual(attrsUpdate.sender)
            expect(ticketFileUpdated.v).toEqual(2)
            expect(ticketFileUpdated.organization).toEqual(expect.objectContaining({ id: client.organization.id }))
            expect(ticketFileUpdated.ticket).toEqual(expect.objectContaining({ id: client.ticket.id }))
        })
        it('cannot delete TicketFile', async () => {
            const userClient = await makeClientWithTicket()
            const [ticketFileCreated] = await createTestTicketFile(userClient, userClient.organization, userClient.ticket)  
            await expectToThrowAccessDeniedErrorToObj(async () => {
                // TODO(codegen): check 'user: delete TicketFile' test!
                await TicketFile.delete(userClient, ticketFileCreated.id)
            })
        })
    })

    describe('Anonymous', () => {
        it('cannot create TicketFile', async () => {
            const client = await makeClient()
            const clientWithOrganization = await makeClientWithProperty()
            await expectToThrowAuthenticationErrorToObj(async () => {
                await createTestTicketFile(client, clientWithOrganization.organization) 
            })
        })
        it('cannot read TicketFile', async () => {
            const client = await makeClient()
            await expectToThrowAuthenticationErrorToObjects(async () => {
                await TicketFile.getAll(client)
            })
        })
        it('cannot update TicketFile', async () => {
            const userClient = await makeClientWithTicket()
            const [ticketFileCreated] = await createTestTicketFile(userClient, userClient.organization, userClient.ticket)  
            const client = await makeClient()
            const payload = { ticket: { connect: { id: userClient.ticket.id } } }
            await expectToThrowAuthenticationErrorToObj(async () => {
                await updateTestTicketFile(client, ticketFileCreated.id, payload)
            })
        })
        it('cannot delete TicketFile', async () => {
            const userClient = await makeClientWithTicket()
            const [ticketFileCreated] = await createTestTicketFile(userClient, userClient.organization, userClient.ticket)  
            const client = await makeClient()
            await expectToThrowAccessDeniedErrorToObj(async () => {
                // TODO(codegen): check 'anonymous: delete TicketFile' test!
                await TicketFile.delete(client, ticketFileCreated.id)
            })
        })
    })

    describe('Employee from "from" relation organization', () => {
        it('can create ticket file for his "to" related organization', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientFrom, organizationTo, propertyTo, link, employeeFrom } = await createTestOrganizationLinkWithTwoOrganizations()
            await createTestOrganizationLinkEmployeeAccess(admin, link, employeeFrom, {
                canManageTickets: true,
            })
            const [ticket] = await createTestTicket(admin, organizationTo, propertyTo)

            const [ticketFile] = await createTestTicketFile(clientFrom, organizationTo, ticket)
            expect(ticketFile.id).toMatch(UUID_RE)
        })

        it('cannot create ticket file for not his "to" related organization', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientFrom, link, employeeFrom, propertyTo } = await createTestOrganizationLinkWithTwoOrganizations()
            await createTestOrganizationLinkEmployeeAccess(admin, link, employeeFrom, {
                canManageTickets: true,
            })
            const { organizationTo } = await createTestOrganizationLinkWithTwoOrganizations()
            const [ticket] = await createTestTicket(admin, organizationTo, propertyTo)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestTicketFile(clientFrom, organizationTo, ticket)
            })
        })

        it('can read ticket file from his "to" related organization', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientFrom, organizationTo, propertyTo } = await createTestOrganizationLinkWithTwoOrganizations()
            const [ticket] = await createTestTicket(admin, organizationTo, propertyTo)
            await createTestTicketFile(admin, organizationTo, ticket)

            const objs = await TicketFile.getAll(clientFrom)
            expect(objs).toHaveLength(1)
        })

        it('can update ticket file for his "to" related organization', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientFrom, organizationTo, propertyTo, link, employeeFrom } = await createTestOrganizationLinkWithTwoOrganizations()
            await createTestOrganizationLinkEmployeeAccess(admin, link, employeeFrom, {
                canManageTickets: true,
            })
            const [ticket] = await createTestTicket(admin, organizationTo, propertyTo)
            const [ticketFile] = await createTestTicketFile(clientFrom, organizationTo, ticket)
            const [updatedTicketFile] = await updateTestTicketFile(clientFrom, ticketFile.id, {})
            expect(updatedTicketFile.id).toEqual(ticketFile.id)
        })
    })

    describe('Employee from "to" relation organization', () => {
        it('cannot create ticket file for his "from" related organization', async () => {
            const admin = await makeLoggedInAdminClient()
            const { organizationTo, propertyFrom, clientTo, link, employeeFrom } = await createTestOrganizationLinkWithTwoOrganizations()
            await createTestOrganizationLinkEmployeeAccess(admin, link, employeeFrom, {
                canManageTickets: true,
            })
            const [ticket] = await createTestTicket(admin, organizationTo, propertyFrom)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestTicketFile(clientTo, organizationTo, ticket)
            })
        })

        it('cannot read ticket file from his "from" related organization', async () => {
            const admin = await makeLoggedInAdminClient()
            const { organizationTo, propertyFrom, clientTo } = await createTestOrganizationLinkWithTwoOrganizations()
            await createTestTicket(admin, organizationTo, propertyFrom)

            const objs = await TicketFile.getAll(clientTo)
            expect(objs).toHaveLength(0)
        })

        it('cannot update ticket file for his "from" related organization', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientTo, organizationTo, propertyFrom } = await createTestOrganizationLinkWithTwoOrganizations()
            const [ticket] = await createTestTicket(admin, organizationTo, propertyFrom)
            const [ticketFile] = await createTestTicketFile(admin, organizationTo, ticket)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestTicketFile(clientTo, ticketFile.id, {})
            })
        })
    })
})
