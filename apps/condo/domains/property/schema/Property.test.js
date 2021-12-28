/**
 * Generated by `createschema property.Property 'organization:Text; name:Text; address:Text; addressMeta:Json; type:Select:building,village; map?:Json'`
 */
const { UNIQUE_ALREADY_EXISTS_ERROR } = require('@condo/domains/common/constants/errors')
const { catchErrorFrom, expectToThrowAccessDeniedErrorToObj, expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects } = require('@condo/domains/common/utils/testSchema')
const { createTestOrganizationWithAccessToAnotherOrganization, createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { makeClient, UUID_RE, DATETIME_RE, makeLoggedInAdminClient } = require('@core/keystone/test.utils')
const { Property, createTestProperty, updateTestProperty, makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithResidentUser } = require('@condo/domains/user/utils/testSchema')
const { makeClientWithRegisteredOrganization } = require('@condo/domains/organization/utils/testSchema/Organization')
const { createTestTicket, updateTestTicket, ticketStatusByType } = require('@condo/domains/ticket/utils/testSchema')
const { buildingMapJson } = require('@condo/domains/property/constants/property')
const faker = require('faker')
const { createTestResident } = require('@condo/domains/resident/utils/testSchema')


describe('Property', () => {

    describe('resolveInput', () => {
        it('gets created with `null` values in `map.sections[].floors[].units[]`', async () => {
            const map = {
                'dv': 1,
                'type': 'building',
                'sections': [
                    {
                        'id': '5',
                        'type': 'section',
                        'index': 1,
                        'name': '1',
                        'preview': null,
                        'floors': [
                            {
                                'id': '7',
                                'type': 'floor',
                                'index': 1,
                                'name': '1',
                                'units': [
                                    {
                                        'id': '6',
                                        'type': 'unit',
                                        'name': null,
                                        'label': '1',
                                        'preview': null,
                                    },
                                ],
                            },
                        ],
                    },
                ],
                'parking': [],
            }
            const client = await makeClientWithRegisteredOrganization()
            const payload = {
                map,
            }
            const [obj] = await createTestProperty(client, client.organization, payload)
            expect(obj.id).toMatch(UUID_RE)
        })
    })

    test('user: can use soft delete', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj] = await createTestProperty(client, client.organization)
        await updateTestProperty(client, obj.id, { deletedAt: 'true' })

        const count = await Property.count(client)
        expect(count).toEqual(0)
    })

    test('user: can read soft deleted objects', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj] = await createTestProperty(client, client.organization)
        await updateTestProperty(client, obj.id, { deletedAt: 'true' })

        const count = await Property.count(client, { deletedAt_not: null })
        expect(count).toEqual(1)
    })

    test('user: can read and restore soft deleted objects', async  () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj] = await createTestProperty(client, client.organization)
        await updateTestProperty(client, obj.id, { deletedAt: 'true' })
        await updateTestProperty(client, obj.id, { deletedAt: null })

        const count = await Property.count(client)
        expect(count).toEqual(1)
    })

    test('user: can read all objects', async  () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj] = await createTestProperty(client, client.organization)
        await createTestProperty(client, client.organization)
        await updateTestProperty(client, obj.id, { deletedAt: 'true' })

        const count = await Property.count(client, { OR: [{ deletedAt_not: null }, { deletedAt: null }] } )
        expect(count).toEqual(2)
    })

    test('user: can not soft delete object twice', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [obj] = await createTestProperty(client, client.organization)
        await updateTestProperty(client, obj.id, { deletedAt: 'true' })

        const wrongUpdateFunction = async () => await updateTestProperty(client, obj.id, { deletedAt: 'true' })

        await catchErrorFrom(wrongUpdateFunction, ({ errors }) => {
            expect(errors[0]).toMatchObject({
                message: 'Already deleted',
                name: 'GraphQLError',
                path: [ 'obj' ],
            })
        })
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
        expect(obj.unitsCount).toEqual(0)
        expect(obj.uninhabitedUnitsCount).toEqual(0)
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
        expect(obj.map).toMatchObject(buildingMapJson)
        expect(obj.v).toEqual(2)
        expect(obj.newId).toEqual(null)
        expect(obj.deletedAt).toEqual(null)
        expect(obj.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.createdAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).not.toEqual(obj.createdAt)
        expect(obj.unitsCount).toEqual(28)
        expect(obj.uninhabitedUnitsCount).toEqual(8)
    })

    test('user: can not create Property when same address exist in user organization', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [_, attrs] = await createTestProperty(client, client.organization)
        const { address } = attrs
        await catchErrorFrom(async () => {
            await createTestProperty(client, client.organization, { address })
        }, ({ errors }) => {
            expect(errors).toHaveLength(1)
            expect(errors[0].data.messages[0]).toContain(`${UNIQUE_ALREADY_EXISTS_ERROR}address]`)
        })
    })

    test('user: can create Property when same address exist in other organization', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const client2 = await makeClientWithProperty()

        const [_, attrs] = await createTestProperty(client, client.organization)
        const { address } = attrs

        const [property] = await createTestProperty(client2, client2.organization, { address })

        expect(property.address).toEqual(address)
    })

    test('user: can update Property when another Property with same address exist in other organization', async () => {
        const client = await makeClientWithProperty()
        const client2 = await makeClientWithProperty()

        const [_, attrs] = await createTestProperty(client, client.organization)
        const { address } = attrs

        const [property2] = await createTestProperty(client2, client2.organization)
        const [updatedProperty] = await updateTestProperty(client2, property2.id, { address })

        expect(updatedProperty.address).toEqual(address)
    })

    test('user: can create Property when another Property with same address soft deleted in user organization', async () => {
        const client = await makeClientWithProperty()
        await updateTestProperty(client, client.property.id, { deletedAt: 'true' })

        const [property] = await createTestProperty(client, client.organization, { address: client.property.address })

        expect(property.address).toEqual(client.property.address)
    })

    test('user: can create Property when another Property with same address soft deleted in other organization', async () => {
        const client = await makeClientWithProperty()
        const client2 = await makeClientWithProperty()

        await updateTestProperty(client, client.property.id, { deletedAt: 'true' })

        const [property2] = await createTestProperty(client2, client2.organization, { address: client.property.address })

        expect(property2.address).toEqual(client.property.address)
    })

    test('user: can update Property when another Property with same address soft deleted in user organization', async () => {
        const client = await makeClientWithProperty()
        await updateTestProperty(client, client.property.id, { deletedAt: 'true' })

        const [property] = await createTestProperty(client, client.organization)
        const [updatedProperty] = await updateTestProperty(client, property.id, { address: client.property.address })

        expect(updatedProperty.address).toEqual(client.property.address)
    })

    test('user: can update Property when Property with same address soft deleted in other organization', async () => {
        const client = await makeClientWithProperty()
        const client2 = await makeClientWithProperty()

        await updateTestProperty(client, client.property.id, { deletedAt: 'true' })

        const [property2] = await updateTestProperty(client2, client2.property.id, { address: client.property.address })

        expect(property2.address).toEqual(client.property.address)
    })

    test('user: can not update Property address when another Property with same address present within the organization', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [_, attrs] = await createTestProperty(client, client.organization)
        const { address } = attrs
        const [property] = await createTestProperty(client, client.organization)
        await catchErrorFrom(async () => {
            await updateTestProperty(client, property.id, { address })
        }, ({ errors }) => {
            expect(errors).toHaveLength(1)
            expect(errors[0].data.messages[0]).toContain(`${UNIQUE_ALREADY_EXISTS_ERROR}address]`)
        })
    })

    test('user: can update Property address when this property has this address already', async () => {
        const client = await makeClientWithRegisteredOrganization()
        const [property] = await createTestProperty(client, client.organization)
        const address = faker.address.streetAddress(true)
        const [updatedProperty] = await updateTestProperty(client, property.id, { address })

        expect(updatedProperty.address).toEqual(address)
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
        await expectToThrowAuthenticationErrorToObjects(async () => {
            await Property.getAll(client)
        })
    })

    test('anonymous: update Property', async () => {
        const user = await makeClientWithRegisteredOrganization()
        const [objCreated] = await createTestProperty(user, user.organization)

        const guest = await makeClient()
        const payload = {}
        await expectToThrowAuthenticationErrorToObj(async () => {
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

    test('employee from "from" related organization: can read property', async () => {
        const { clientFrom, propertyTo } = await createTestOrganizationWithAccessToAnotherOrganization()

        const properties = await Property.getAll(clientFrom, { id: propertyTo.id })
        expect(properties).toHaveLength(1)
    })

    test('employee from "to" related organization: cannot read property from "from"', async () => {
        const { propertyFrom, clientTo } = await createTestOrganizationWithAccessToAnotherOrganization()

        const properties = await Property.getAll(clientTo, { id: propertyFrom.id })
        expect(properties).toHaveLength(0)
    })

    test('user: cannot read not his own properties', async () => {
        await makeClientWithProperty()
        await createTestOrganizationWithAccessToAnotherOrganization()
        const user = await makeClientWithNewRegisteredAndLoggedInUser()

        const properties = await Property.getAll(user)
        expect(properties).toHaveLength(0)
    })

    describe('Resident access', () => {
        it('can read only properties, it resides in', async () => {
            const { organization, property } = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            const residentClient = await makeClientWithResidentUser()
            await createTestResident(adminClient, residentClient.user, organization, property)

            const another = await makeClientWithProperty()
            const anotherResidentClient = await makeClientWithResidentUser()
            await createTestResident(adminClient, anotherResidentClient.user, another.organization, another.property)

            const [anotherOrganization2] = await createTestOrganization(adminClient)
            await createTestProperty(adminClient, anotherOrganization2, { map: buildingMapJson })

            const objs = await Property.getAll(residentClient, {}, { sortBy: ['updatedAt_DESC'] })
            expect(objs).toHaveLength(1)
            expect(objs[0].id).toEqual(property.id)
        })
    })
})
