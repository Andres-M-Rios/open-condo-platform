/**
 * Generated by `createservice ticket.ResidentTicketService --type mutations`
 */
const { Contact } = require('@condo/domains/contact/utils/testSchema')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { makeLoggedInAdminClient, makeClient } = require('@core/keystone/test.utils')
const { createResidentTicketByTestClient } = require('@condo/domains/ticket/utils/testSchema')
const { UUID_RE } = require('@core/keystone/test.utils')
const faker = require('faker')
const { NOT_FOUND_ERROR } = require('@condo/domains/common/constants/errors')
const { addResidentAccess } = require('@condo/domains/user/utils/testSchema')
const { expectToThrowAuthenticationErrorToObj } = require('@condo/domains/common/utils/testSchema')

describe('CreateResidentTicketService', () => {

    test('resident: can create resident ticket', async () => {
        const userClient = await makeClientWithProperty()
        await addResidentAccess(userClient.user)
        const [data] = await createResidentTicketByTestClient(userClient, userClient.property)
        expect(data.id).toMatch(UUID_RE)
    })

    test('resident: cannot create resident ticket with wrong unitName', async () => {
        const userClient = await makeClientWithProperty()
        await addResidentAccess(userClient.user)

        try {
            await createResidentTicketByTestClient(userClient, userClient.property, { unitName: faker.random.alphaNumeric(10) })
        } catch (error) {
            expect(error.errors).toHaveLength(1)
            expect(error.errors[0].message).toEqual(`${NOT_FOUND_ERROR}unitName] unitName not found`)
        }
    })

    test('resident: cannot create resident ticket without details', async () => {
        const userClient = await makeClientWithProperty()
        await addResidentAccess(userClient.user)

        try {
            await createResidentTicketByTestClient(userClient, userClient.property, { details: null })
        } catch (error) {
            expect(error.errors).toHaveLength(1)
        }
    })

    test('resident: cannot create resident ticket with wrong property id', async () => {
        const userClient = await makeClientWithProperty()
        await addResidentAccess(userClient.user)

        const wrongProperty = {
            id: faker.random.uuid(),
        }

        try {
            await createResidentTicketByTestClient(userClient, wrongProperty)
        } catch (error) {
            expect(error.errors).toHaveLength(1)
            expect(error.errors[0].message).toEqual(`${NOT_FOUND_ERROR}property] property not found`)
        }
    })

    test('resident: create contact when create resident ticket without contact', async () => {
        const admin = await makeLoggedInAdminClient()
        const userClient = await makeClientWithProperty()
        await addResidentAccess(userClient.user)

        await createResidentTicketByTestClient(userClient, userClient.property)
        const [contact] = await Contact.getAll(admin, {
            property: { id: userClient.property.id },
            organization: { id: userClient.organization.id },
            name: userClient.name,
            email: userClient.email,
            phone: userClient.phone,
        })
        expect(contact.id).toMatch(UUID_RE)
    })

    test('anonymous: cannot create resident ticket', async () => {
        const anon = await makeClient()
        const admin = await makeLoggedInAdminClient()
        const [organization] = await createTestOrganization(admin)
        const [property] = await createTestProperty(admin, organization)

        await expectToThrowAuthenticationErrorToObj(async () => {
            await createResidentTicketByTestClient(anon, property)
        })
    })

    test('admin: can create resident ticket', async () => {
        const admin = await makeLoggedInAdminClient()
        const [organization] = await createTestOrganization(admin)
        const [property] = await createTestProperty(admin, organization)
        const [data] = await createResidentTicketByTestClient(admin, property)
        expect(data.id).toMatch(UUID_RE)
    })
})