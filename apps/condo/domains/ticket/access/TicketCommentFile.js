/**
 * Generated by `createschema ticket.TicketCommentFile 'organization:Relationship:Organization:CASCADE;file?:File;ticketComment?:Relationship:TicketComment:SET_NULL'`
 */

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { getByCondition, getById } = require('@open-condo/keystone/schema')
const get = require('lodash/get')
const { RESIDENT_COMMENT_TYPE } = require('../constants')
const {
    queryOrganizationEmployeeFor,
    queryOrganizationEmployeeFromRelatedOrganizationFor, checkPermissionInUserOrganizationOrRelatedOrganization,
} = require('@condo/domains/organization/utils/accessSchema')
const { getTicketAccessForUser } = require('@condo/domains/ticket/utils/accessSchema')

async function canReadTicketCommentFiles ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.isSupport || user.isAdmin) return {}

    if (user.type === RESIDENT) {
        return {
            OR: [
                {
                    AND: [
                        { ticketComment: { type: RESIDENT_COMMENT_TYPE } },
                        { ticket: { client: { id: user.id }, canReadByResident: true } },
                    ],
                },
                { createdBy: { id: user.id } },
            ],
        }
    }

    const ticketAccessObj = await getTicketAccessForUser(user)

    return {
        OR: [
            {
                ticket: {
                    ...ticketAccessObj,
                },
            },
            { createdBy: { id: user.id } },
        ],
    }
}

async function canManageTicketCommentFiles ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    if (user.type === RESIDENT) {
        if (operation === 'create') {
            const ticketId = get(originalInput, ['ticket', 'connect', 'id'])
            const ticket = await getByCondition('Ticket', { id: ticketId, deletedAt: null })

            return ticket.client === user.id
        } else if (operation === 'update' && itemId) {
            const ticketCommentFile = await getById('TicketCommentFile', itemId)
            if (!ticketCommentFile) return false

            const ticketCommentFromOriginalInput = get(originalInput, ['ticketComment', 'connect', 'id'])
            if (ticketCommentFromOriginalInput) {
                const ticketComment = await getById('TicketComment', ticketCommentFromOriginalInput)

                return ticketCommentFile.createdBy === user.id && ticketComment.createdBy === user.id
            }

            return ticketCommentFile.createdBy === user.id
        }
    } else {
        if (operation === 'create') {
            const ticketId = get(originalInput, ['ticket', 'connect', 'id'], null)

            if (ticketId) {
                const ticket = await getById('Ticket', ticketId)
                const organizationId = get(ticket, 'organization', null)

                return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, organizationId, 'canManageTicketComments')
            }

            return true
        }

        const ticketCommentFile = await getById('TicketCommentFile', itemId)
        if (!ticketCommentFile) return false

        const { createdBy, organization } = ticketCommentFile
        if (!organization) return createdBy === user.id

        return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, organization, 'canManageTicketComments')
    }
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadTicketCommentFiles,
    canManageTicketCommentFiles,
}
