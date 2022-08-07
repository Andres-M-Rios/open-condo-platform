/**
 * Generated by `createservice ticket.UpdateResidentTicketService --type mutations`
 */
const { Ticket } = require('../utils/serverSchema')
const { GQLCustomSchema } = require('@condo/keystone/schema')
const access = require('@condo/domains/ticket/access/UpdateResidentTicketService')
const { get } = require('lodash')
const { GQLError, GQLErrorCode: { BAD_USER_INPUT } } = require('@condo/keystone/errors')
const { NOT_FOUND } = require('@condo/domains/common/constants/errors')

const errors = {
    TICKET_NOT_FOUND: {
        mutation: 'updateResidentTicket',
        variable: ['id'],
        code: BAD_USER_INPUT,
        type: NOT_FOUND,
        message: 'Cannot find ticket with id "{ticketId}" for current user',
        messageForUser: 'api.ticket.updateResidentTicket.TICKET_NOT_FOUND',
    },
}

const UpdateResidentTicketService = new GQLCustomSchema('UpdateResidentTicketService', {
    types: [
        {
            access: true,
            type: 'input ResidentTicketUpdateInput { dv: Int!, sender: SenderFieldInput!, details: String }',
        },
    ],
    
    mutations: [
        {
            access: access.canUpdateResidentTicket,
            schema: 'updateResidentTicket(id: ID, data: ResidentTicketUpdateInput): ResidentTicketOutput',
            doc: {
                summary: 'Updates ticket with specified id for resident, corresponding to current logged in user',
                errors,
            },
            resolver: async (parent, args, context) => {
                const { id: ticketId, data } = args
                const { dv: newTicketDv, sender: newTicketSender, details } = data
                const user = get(context, ['req', 'user'])

                if (!user.isAdmin) {
                    const [residentTicket] = await Ticket.getAll(context, { id: ticketId, client: { id: user.id } })
                    if (!residentTicket) {
                        throw new GQLError({
                            ...errors.TICKET_NOT_FOUND,
                            messageInterpolation: {
                                ticketId,
                            },
                        }, context)
                    }
                }

                return await Ticket.update(context, ticketId, {
                    dv: newTicketDv,
                    sender: newTicketSender,
                    details,
                })
            },
        },
    ],
    
})

module.exports = {
    UpdateResidentTicketService,
}
