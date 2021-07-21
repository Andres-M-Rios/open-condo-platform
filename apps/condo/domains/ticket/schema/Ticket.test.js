/**
 * Generated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; classifier:Relationship:TicketClassifier:PROTECT; details:Text; meta?:Json;`
 */
const { createTestOrganizationLinkEmployeeAccess } = require('@condo/domains/organization/utils/testSchema')
const { createTestContact } = require('@condo/domains/contact/utils/testSchema')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { NUMBER_RE, UUID_RE, DATETIME_RE, makeClient, makeLoggedInAdminClient } = require('@core/keystone/test.utils')
const { Ticket, createTestTicket, updateTestTicket } = require('@condo/domains/ticket/utils/testSchema')

const { expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects } = require('@condo/domains/common/utils/testSchema')
const { expectToThrowAccessDeniedErrorToObj } = require('@condo/domains/common/utils/testSchema')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganizationEmployeeRole } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganizationLink, createTestOrganizationLinkWithTwoOrganizations } = require('@condo/domains/organization/utils/testSchema')
const faker = require('faker')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')

describe('Ticket', () => {
    test('user: create Ticket', async () => {
        const client = await makeClientWithProperty()
        const [contact] = await createTestContact(client, client.organization, client.property)
        const fields = {
            contact: { connect: { id: contact.id } },
        }
        const [obj, attrs] = await createTestTicket(client, client.organization, client.property, fields)
        expect(obj.id).toMatch(UUID_RE)
        expect(obj.dv).toEqual(1)
        expect(obj.sender).toEqual(attrs.sender)
        expect(obj.v).toEqual(1)
        expect(obj.newId).toEqual(null)
        expect(obj.deletedAt).toEqual(null)
        expect(obj.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.createdAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).toMatch(DATETIME_RE)
        expect(obj.organization).toEqual(expect.objectContaining({ id: client.organization.id }))
        expect(String(obj.number)).toMatch(NUMBER_RE)
        expect(obj.source).toEqual(expect.objectContaining({ id: attrs.source.connect.id }))
        expect(obj.sourceMeta).toEqual(null)
        expect(obj.classifier).toEqual(expect.objectContaining({ id: attrs.classifier.connect.id }))
        expect(obj.property).toEqual(expect.objectContaining({ id: client.property.id }))
        expect(obj.status).toEqual(expect.objectContaining({ id: attrs.status.connect.id }))
        expect(obj.statusReopenedCounter).toEqual(0)
        expect(obj.statusReason).toEqual(null)
        expect(obj.statusUpdatedAt).toBeNull()
        expect(obj.details).toEqual(attrs.details)
        expect(obj.isPaid).toEqual(false)
        expect(obj.isEmergency).toEqual(false)
        expect(obj.meta).toEqual(null)
        expect(obj.client).toEqual(null)
        expect(obj.contact).toEqual(expect.objectContaining({ id: attrs.contact.connect.id } ))
        expect(obj.operator).toEqual(null)
        expect(obj.assignee).toEqual(null)
        expect(obj.executor).toEqual(null)
        expect(obj.watchers).toEqual([])
    })

    test('user: create Ticket without status', async () => {
        const client = await makeClientWithProperty()
        const [obj] = await createTestTicket(client, client.organization, client.property, { status: null })
        const TICKET_OPEN_STATUS_ID = '6ef3abc4-022f-481b-90fb-8430345ebfc2'

        expect(obj.status).toEqual(expect.objectContaining({ id: TICKET_OPEN_STATUS_ID }))
    })

    test('anonymous: create Ticket', async () => {
        const client1 = await makeClientWithProperty()
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObj(async () => {
            await createTestTicket(client, client1.organization, client1.property)
        })
    })

    test('user: read Ticket', async () => {
        const client = await makeClientWithProperty()
        const [obj, attrs] = await createTestTicket(client, client.organization, client.property)
        const objs = await Ticket.getAll(client)
        expect(objs).toHaveLength(1)
        expect(objs[0].id).toMatch(obj.id)
        expect(objs[0].dv).toEqual(1)
        expect(objs[0].sender).toEqual(attrs.sender)
        expect(objs[0].v).toEqual(1)
        expect(objs[0].newId).toEqual(null)
        expect(objs[0].deletedAt).toEqual(null)
        expect(objs[0].createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(objs[0].updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(objs[0].createdAt).toMatch(obj.createdAt)
        expect(objs[0].updatedAt).toMatch(obj.updatedAt)
    })

    test('user: no access to another organization ticket', async () => {
        const hacker = await makeClientWithProperty()
        const client = await makeClientWithProperty()
        const [obj] = await createTestTicket(client, client.organization, client.property)

        const objs = await Ticket.getAll(hacker)
        expect(objs).toHaveLength(0)

        const objsFilteredById = await Ticket.getAll(hacker, { id: obj.id })
        expect(objsFilteredById).toHaveLength(0)
    })

    test('anonymous: read Ticket', async () => {
        const client = await makeClient()

        await expectToThrowAuthenticationErrorToObjects(async () => {
            await Ticket.getAll(client)
        })
    })

    test('user: update Ticket', async () => {
        const client = await makeClientWithProperty()
        const payload = { details: 'new data' }
        const [objCreated] = await createTestTicket(client, client.organization, client.property)

        const [objUpdated, attrs] = await updateTestTicket(client, objCreated.id, payload)

        expect(objUpdated.id).toEqual(objCreated.id)
        expect(objUpdated.dv).toEqual(1)
        expect(objUpdated.sender).toEqual(attrs.sender)
        expect(objUpdated.v).toEqual(2)
        expect(objUpdated.newId).toEqual(null)
        expect(objUpdated.deletedAt).toEqual(null)
        expect(objUpdated.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(objUpdated.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(objUpdated.createdAt).toMatch(DATETIME_RE)
        expect(objUpdated.updatedAt).toMatch(DATETIME_RE)
        expect(objUpdated.updatedAt).not.toEqual(objUpdated.createdAt)
        expect(objUpdated.details).toEqual(payload.details)
        expect(objUpdated.organization).toEqual(expect.objectContaining({ id: client.organization.id }))
        expect(objUpdated.number).toEqual(objCreated.number)
        // TODO(pahaz): check others fields ...
    })

    test('user: set ticket assignee', async ()  => {
        const client = await makeClientWithProperty()
        const [objCreated] = await createTestTicket(client, client.organization, client.property)

        const payload = { details: 'new data', assignee: { connect: { id: client.user.id } } }
        const [objUpdated] = await updateTestTicket(client, objCreated.id, payload)

        expect(objUpdated.assignee).toEqual(expect.objectContaining({ id: client.user.id }))
        const IN_PROGRESS = 'aa5ed9c2-90ca-4042-8194-d3ed23cb7919'
        expect(objUpdated.status).toEqual(expect.objectContaining({ id: IN_PROGRESS }))
    })

    test('user: set the same ticket number', async () => {
        const client = await makeClientWithProperty()
        const [objCreated] = await createTestTicket(client, client.organization, client.property)
        const payload = { number: objCreated.number }
        const [objUpdated] = await updateTestTicket(client, objCreated.id, payload)

        expect(objUpdated.id).toEqual(objCreated.id)
        expect(objUpdated.number).toEqual(objCreated.number)
    })

    test('anonymous: update Ticket', async () => {
        const client1 = await makeClientWithProperty()
        const client = await makeClient()
        const payload = { details: 'new data' }
        const [objCreated] = await createTestTicket(client1, client1.organization, client1.property)
        await expectToThrowAuthenticationErrorToObj(async () => {
            await updateTestTicket(client, objCreated.id, payload)
        })
    })

    test('user: delete Ticket', async () => {
        const client = await makeClientWithProperty()
        const [objCreated] = await createTestTicket(client, client.organization, client.property)
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await Ticket.delete(client, objCreated.id)
        })
    })

    test('anonymous: delete Ticket', async () => {
        const client1 = await makeClientWithProperty()
        const client = await makeClient()
        const [objCreated] = await createTestTicket(client1, client1.organization, client1.property)
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await Ticket.delete(client, objCreated.id)
        })
    })
})

describe('Ticket:permissions', () => {
    test('user: create Ticket', async () => {
        const client = await makeClientWithProperty()
        const client2 = await makeClientWithProperty()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await createTestTicket(client, client.organization, client2.property)
        })
    })

    test('user: update Ticket', async () => {
        const client = await makeClientWithProperty()
        const client2 = await makeClientWithProperty()
        const [obj] = await createTestTicket(client, client.organization, client.property)
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestTicket(client, obj.id, { property: { connect: { id: client2.property.id } } })
        })
    })

    test('employee from "from" organization: can read tickets from "to" organizations', async () => {
        const admin = await makeLoggedInAdminClient()
        const { clientWithPropertyFrom, clientWithPropertyTo } = await createTestOrganizationLinkWithTwoOrganizations()
        const clientWithPropertyTo2 = await makeClientWithProperty()

        await createTestTicket(admin, clientWithPropertyTo.organization, clientWithPropertyTo.property)
        await createTestTicket(admin, clientWithPropertyTo2.organization, clientWithPropertyTo2.property)

        await createTestOrganizationLink(admin, clientWithPropertyFrom.organization, clientWithPropertyTo2.organization)

        const tickets = await Ticket.getAll(clientWithPropertyFrom, { organization: { OR: [{ id: clientWithPropertyTo.organization.id }, { id: clientWithPropertyTo2.organization.id }] } })
        expect(tickets).toHaveLength(2)
    })

    test('employee from "to" organization: cannot read tickets from "from" organization', async () => {
        const admin = await makeLoggedInAdminClient()
        const { clientWithPropertyFrom, clientWithPropertyTo } = await createTestOrganizationLinkWithTwoOrganizations()
        await createTestTicket(admin, clientWithPropertyFrom.organization, clientWithPropertyFrom.property)

        const tickets = await Ticket.getAll(clientWithPropertyTo, { organization: { id: clientWithPropertyFrom.id } })
        expect(tickets).toHaveLength(0)
    })

    test('employee from "from" organization: cannot check not its own "to" organizations', async () => {
        const admin = await makeLoggedInAdminClient()
        const { clientWithPropertyTo } = await createTestOrganizationLinkWithTwoOrganizations()
        const { clientWithPropertyFrom: clientWithPropertyFrom2, clientWithPropertyTo: clientWithPropertyTo2 } = await createTestOrganizationLinkWithTwoOrganizations()

        await createTestTicket(admin, clientWithPropertyTo.organization, clientWithPropertyTo.property)

        const tickets = await Ticket.getAll(clientWithPropertyFrom2, { organization: { OR: [{ id: clientWithPropertyTo.organization.id }, { id: clientWithPropertyTo2.organization.id }] } })
        expect(tickets).toHaveLength(0)
    })

    test('organization "from" employee with canManageTickets access: can create organization "to" tickets', async () => {
        const admin = await makeLoggedInAdminClient()
        const { clientWithPropertyFrom, clientWithPropertyTo, employeeFrom, link } = await createTestOrganizationLinkWithTwoOrganizations()
        await createTestOrganizationLinkEmployeeAccess(admin, link, employeeFrom, {
            canManageTickets: true,
        })

        const [ticket] = await createTestTicket(clientWithPropertyFrom, clientWithPropertyTo.organization, clientWithPropertyTo.property)
        expect(ticket.id).toMatch(UUID_RE)
    })

    test('organization "to" employee: cannot create organization "from" tickets', async () => {
        const { clientWithPropertyFrom, clientWithPropertyTo } = await createTestOrganizationLinkWithTwoOrganizations()

        await expectToThrowAccessDeniedErrorToObj(async () => {
            await createTestTicket(clientWithPropertyTo, clientWithPropertyFrom.organization, clientWithPropertyFrom.property)
        })
    })

    test('user: cannot create tickets for "from" or "to" organizations', async () => {
        const admin = await makeLoggedInAdminClient()
        const { clientWithPropertyFrom, clientWithPropertyTo, link, employeeFrom } = await createTestOrganizationLinkWithTwoOrganizations()
        await createTestOrganizationLinkEmployeeAccess(admin, link, employeeFrom, {
            canManageTickets: true,
        })

        const randomUser = await makeClientWithProperty()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await createTestTicket(randomUser, clientWithPropertyFrom.organization, clientWithPropertyFrom.property)
        })
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await createTestTicket(randomUser, clientWithPropertyTo.organization, clientWithPropertyTo.property)
        })
    })

    test('organization "from" employee: can update organization "to" tickets', async () => {
        const admin = await makeLoggedInAdminClient()
        const { clientWithPropertyFrom, clientWithPropertyTo, link, employeeFrom } = await createTestOrganizationLinkWithTwoOrganizations()
        await createTestOrganizationLinkEmployeeAccess(admin, link, employeeFrom, {
            canManageTickets: true,
        })

        const [ticket] = await createTestTicket(admin, clientWithPropertyTo.organization, clientWithPropertyTo.property)
        const newDetails = faker.random.alphaNumeric(21)
        const [updatedTicket] = await updateTestTicket(clientWithPropertyFrom, ticket.id, { details: newDetails })

        expect(updatedTicket.id).toEqual(ticket.id)
        expect(updatedTicket.details).toEqual(newDetails)
    })
})
