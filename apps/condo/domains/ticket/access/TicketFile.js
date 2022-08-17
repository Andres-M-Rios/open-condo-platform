/**
 * Generated by `createschema ticket.TicketFile 'organization:Text;file?:File;ticket?:Relationship:Ticket:SET_NULL;'`
 */
const get = require('lodash/get')
const { queryOrganizationEmployeeFor, queryOrganizationEmployeeFromRelatedOrganizationFor } = require('@condo/domains/organization/utils/accessSchema')
const { getById } = require('@condo/keystone/schema')
const { checkPermissionInUserOrganizationOrRelatedOrganization } = require('@condo/domains/organization/utils/accessSchema')
const { RESIDENT, STAFF } = require('@condo/domains/user/constants/common')
const { throwAuthenticationError } = require('@condo/keystone/apolloErrorFormatter')


async function canReadTicketFiles ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.isSupport || user.isAdmin) return {}

    if (user.type === RESIDENT) return { createdBy: { id: user.id } }

    return {
        OR: [
            {
                organization: {
                    OR: [
                        queryOrganizationEmployeeFor(user.id),
                        queryOrganizationEmployeeFromRelatedOrganizationFor(user.id),
                    ],
                },
            },
            { createdBy: { id: user.id } },
        ],
    }
}


async function canManageTicketFiles ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    if (user.type === RESIDENT) {
        if (operation === 'create') return true
        const ticketFile = await getById('TicketFile', itemId)
        if (!ticketFile) return false

        return ticketFile.createdBy === user.id
    }

    if (user.type === STAFF) {
        if (operation === 'create') {
            const ticketId = get(originalInput, ['ticket', 'connect', 'id'], null)

            if (ticketId) {
                const ticket = await getById('Ticket', ticketId)
                const organizationId = get(ticket, 'organization', null)

                return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, organizationId, 'canManageTickets')
            }

            return true
        }

        const ticketFile = await getById('TicketFile', itemId)
        if (!ticketFile) return false

        const { createdBy, organization } = ticketFile
        if (!organization) return createdBy === user.id

        return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, organization, 'canManageTickets')
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadTicketFiles,
    canManageTicketFiles,
}
