/**
 * Generated by `createservice ticket.GetAllResidentTicketsService --type queries`
 */
const { Ticket } = require('../utils/serverSchema')
const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('@condo/domains/ticket/access/GetAllResidentTicketsService')
const { generateQuerySortBy } = require('@core/keystone/gen.gql.utils')
const { generateQueryWhereInput } = require('@core/keystone/gen.gql.utils')

const fieldsObj = {
    id: 'ID',
    number: 'Int',
    status: 'TicketStatus',
    source: 'TicketSource',
    classifier: 'TicketClassifier',
    isEmergency: 'Boolean',
    isPaid: 'Boolean',
    details: 'String',
    createdAt: 'String',
    updatedAt: 'String',
}

const GetAllResidentTicketsService = new GQLCustomSchema('GetAllResidentTicketsService', {
    types: [
        {
            access: true,
            type: generateQueryWhereInput('ResidentTicket', fieldsObj),
        },
        {
            access: true,
            type: generateQuerySortBy('ResidentTicket', Object.keys(fieldsObj)),
        },
    ],
    queries: [
        {
            access: access.canGetAllResidentTickets,
            schema: 'allResidentTickets(where: ResidentTicketWhereInput, first: Int, skip: Int, sortBy: [SortResidentTicketsBy!]): [ResidentTicketOutput]',
            resolver: async (parent, args, context, info, extra = {}) => {
                const { where, first, skip, sortBy } = args
                const clientId = context.req.user.id
                return await Ticket.getAll(context, { ...where, client: { id: clientId } }, {
                    sortBy,
                    first,
                    skip,
                })
            },
        },
    ],
})

module.exports = {
    GetAllResidentTicketsService,
}