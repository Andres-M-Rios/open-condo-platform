/**
 * Generated by `createschema property.Property 'organization:Text; name:Text; address:Text; addressMeta:Json; type:Select:building,village; map?:Json'`
 */

const { makeClient, UUID_RE, DATETIME_RE } = require('@core/keystone/test.utils')

const { Property, createTestProperty, updateTestProperty, makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')

const { makeClientWithRegisteredOrganization } = require('../../../utils/testSchema/Organization')
const { createTestTicket, updateTestTicket, ticketStatusByType } = require('@condo/domains/ticket/utils/testSchema')
const { buildingMapJson } = require('@condo/domains/property/constants/property')
const { expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects } = require('../../common/utils/testSchema')

describe('Property', () => {

    test('user: can use soft delete', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj, attrs] = await createTestProperty(client, client.organization)
        await updateTestProperty(client, obj.id, { deletedAt: 'true' })

        const count = await Property.count(client)
        expect(count).toEqual(0)
    })

    test('user: can read soft deleted objects', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj, attrs] = await createTestProperty(client, client.organization)
        await updateTestProperty(client, obj.id, { deletedAt: 'true' })

        const count = await Property.count(client, { deletedAt_not: null })
        expect(count).toEqual(1)
    })

    test('user: can read and restore soft deleted objects', async  () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj, attrs] = await createTestProperty(client, client.organization)
        await updateTestProperty(client, obj.id, { deletedAt: 'true' })
        await updateTestProperty(client, obj.id, { deletedAt: null })

        const count = await Property.count(client)
        expect(count).toEqual(1)
    })

    test('user: create Property', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj, attrs] = await createTestProperty(client, client.organization)
        expect(obj.id).toMatch(UUID_RE)
        expect(obj.dv).toEqual(1)
        expect(obj.sender).toStrictEqual(attrs.sender)
        expect(obj.organization).toEqual(expect.objectContaining({ id: client.organization.id }))
        expect(obj.type).toEqual('building')
        expect(obj.name).toEqual(attrs.name)
        expect(obj.address).toEqual(attrs.address)
        expect(obj.addressMeta).toStrictEqual(attrs.addressMeta)
        expect(obj.map).toEqual(null)
        expect(obj.v).toEqual(1)
        expect(obj.newId).toEqual(null)
        expect(obj.deletedAt).toEqual(null)
        expect(obj.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.createdAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).toMatch(DATETIME_RE)
    })

    test('user: update Property.map field for created property', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj1, attrs] = await createTestProperty(client, client.organization)
        const obj = await Property.update(client, obj1.id, { dv: 1, sender: attrs.sender, map: buildingMapJson })
        expect(obj.dv).toEqual(1)
        expect(obj.sender).toStrictEqual(attrs.sender)
        expect(obj.organization).toEqual(expect.objectContaining({ id: client.organization.id }))
        expect(obj.type).toEqual('building')
        expect(obj.name).toEqual(attrs.name)
        expect(obj.address).toEqual(attrs.address)
        expect(obj.addressMeta).toStrictEqual(attrs.addressMeta)
        expect(obj.map).toStrictEqual(buildingMapJson)
        expect(obj.v).toEqual(2)
        expect(obj.newId).toEqual(null)
        expect(obj.deletedAt).toEqual(null)
        expect(obj.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.createdAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).not.toEqual(obj.createdAt)
        expect(obj.unitsCount).toEqual(28)
    })

    test('user: get ranked Properties list query DESC order', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [firstProperty] = await createTestProperty(client, client.organization)
        const [secondProperty, secondPropertyAttributes] = await createTestProperty(client, client.organization)
        await Property.update(client, secondProperty.id, { dv: 1, sender: secondPropertyAttributes.sender, map: buildingMapJson })

        const properties = await Property.getAll(client, {}, { sortBy: 'unitsCount_DESC' })

        expect(properties[0].id).toEqual(secondProperty.id)
        expect(properties[1].id).toStrictEqual(firstProperty.id)
    })

    test('user: get ranked Properties list query ASC order', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [firstProperty] = await createTestProperty(client, client.organization)
        const [secondProperty, secondPropertyAttributes] = await createTestProperty(client, client.organization)
        await Property.update(client, secondProperty.id, { dv: 1, sender: secondPropertyAttributes.sender, map: buildingMapJson })

        const properties = await Property.getAll(client, {}, { sortBy: 'unitsCount_ASC' })

        expect(properties[0].id).toEqual(firstProperty.id)
        expect(properties[1].id).toStrictEqual(secondProperty.id)
    })

    test('user: checking "tickets in work" and "closed tickets" fields', async () => {
        const client = await makeClientWithProperty()
        const [ticket] = await createTestTicket(client, client.organization, client.property)
        const [obj] = await Property.getAll(client, { id_in: [client.property.id] })
        expect(obj.ticketsInWork).toEqual('1')
        expect(obj.ticketsClosed).toEqual('0')
        // Close ticket
        const statuses = await ticketStatusByType(client)
        await updateTestTicket(client, ticket.id, { status: { connect: { id: statuses.closed } } })
        const [afterTicketClosed] = await Property.getAll(client, { id_in: [client.property.id] })
        expect(afterTicketClosed.ticketsInWork).toEqual('0')
        expect(afterTicketClosed.ticketsClosed).toEqual('1')
    })

    test('anonymous: read Property', async () => {
        const client = await makeClient()
        await expectToThrowAccessDeniedErrorToObjects(async () => {
            await Property.getAll(client)
        })
    })

    test('anonymous: update Property', async () => {
        const user = await makeClientWithRegisteredOrganization()
        const [objCreated] = await createTestProperty(user, user.organization)

        const guest = await makeClient()
        const payload = {}
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestProperty(guest, objCreated.id, payload)
        })
    })

    test('anonymous: delete Property', async () => {
        const user = await makeClientWithRegisteredOrganization()
        const [objCreated] = await createTestProperty(user, user.organization)
        const guest = await makeClient()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await Property.delete(guest, objCreated.id)
        })
    })

})
