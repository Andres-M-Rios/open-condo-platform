/**
 * Generated by `createschema ticket.TicketChange 'ticket:Relationship:Ticket:CASCADE;'`
 */

const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE } = require('@core/keystone/test.utils')

const { TicketChange, createTestTicketChange, updateTestTicketChange } = require('@condo/domains/ticket/utils/testSchema')

describe('TicketChange', () => {
    test('user: create TicketChange', async () => {
        const client = await makeClient()  // TODO(codegen): use truly useful client!

        const [obj, attrs] = await createTestTicketChange(client)  // TODO(codegen): write 'user: create TicketChange' test
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
    })

    test('anonymous: create TicketChange', async () => {
        const client = await makeClient()
        try {
            await createTestTicketChange(client)  // TODO(codegen): check the 'anonymous: create TicketChange' test!
        } catch (e) {
            expect(e.errors[0]).toMatchObject({
                'message': 'You do not have access to this resource',
                'name': 'AccessDeniedError',
                'path': ['obj'],
            })
            expect(e.data).toEqual({ 'obj': null })
        }
    })

    test('user: read TicketChange', async () => {
        const admin = await makeLoggedInAdminClient()
        const [obj, attrs] = await createTestTicketChange(admin)  // TODO(codegen): check create function!

        const client = await makeClient()  // TODO(codegen): use truly useful client!
        const objs = await TicketChange.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })

        // TODO(codegen): check 'user: read TicketChange' test!
        expect(objs).toHaveLength(1)
        // expect(objs.length >= 1).toBeTruthy()
        expect(objs[0].id).toMatch(obj.id)
        expect(objs[0].dv).toEqual(1)
        expect(objs[0].sender).toEqual(attrs.sender)
        expect(objs[0].v).toEqual(1)
        expect(objs[0].newId).toEqual(null)
        expect(objs[0].deletedAt).toEqual(null)
        expect(objs[0].createdBy).toEqual(expect.objectContaining({ id: admin.user.id }))
        expect(objs[0].updatedBy).toEqual(expect.objectContaining({ id: admin.user.id }))
        expect(objs[0].createdAt).toMatch(obj.createdAt)
        expect(objs[0].updatedAt).toMatch(obj.updatedAt)
    })

    test('anonymous: read TicketChange', async () => {
        const client = await makeClient()

        try {
            await TicketChange.getAll(client)
        } catch (e) {
            expect(e.errors[0]).toMatchObject({
                'message': 'You do not have access to this resource',
                'name': 'AccessDeniedError',
                'path': ['objs'],
            })
            expect(e.data).toEqual({ 'objs': null })
        }
    })

    test('user: update TicketChange', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestTicketChange(admin)  // TODO(codegen): check create function!

        const client = await makeClient()  // TODO(codegen): use truly useful client!
        const payload = {}  // TODO(codegen): change the 'user: update TicketChange' payload
        const [objUpdated, attrs] = await updateTestTicketChange(client, objCreated.id, payload)

        // TODO(codegen): white checks for 'user: update TicketChange' test
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
    })

    test('anonymous: update TicketChange', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestTicketChange(admin)  // TODO(codegen): check create function!

        const client = await makeClient()
        const payload = {}  // TODO(codegen): change the 'anonymous: update TicketChange' payload
        try {
            await updateTestTicketChange(client, objCreated.id, payload)
        } catch (e) {
            expect(e.errors[0]).toMatchObject({
                'message': 'You do not have access to this resource',
                'name': 'AccessDeniedError',
                'path': ['obj'],
            })
            expect(e.data).toEqual({ 'obj': null })
        }
    })

    test('user: delete TicketChange', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestTicketChange(admin)  // TODO(codegen): check create function!

        const client = await makeClient()  // TODO(codegen): use truly useful client!
        try {
            // TODO(codegen): check 'user: delete TicketChange' test!
            await TicketChange.delete(client, objCreated.id)
        } catch (e) {
            expect(e.errors[0]).toMatchObject({
                'message': 'You do not have access to this resource',
                'name': 'AccessDeniedError',
                'path': ['obj'],
            })
            expect(e.data).toEqual({ 'obj': null })
        }
    })

    test('anonymous: delete TicketChange', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestTicketChange(admin)  // TODO(codegen): check create function!

        const client = await makeClient()
        try {
            // TODO(codegen): check 'anonymous: delete TicketChange' test!
            await TicketChange.delete(client, objCreated.id)
        } catch (e) {
            expect(e.errors[0]).toMatchObject({
                'message': 'You do not have access to this resource',
                'name': 'AccessDeniedError',
                'path': ['obj'],
            })
            expect(e.data).toEqual({ 'obj': null })
        }
    })
})
