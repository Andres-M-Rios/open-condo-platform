/**
 * Generated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; classifier:Relationship:TicketClassifier:PROTECT; details:Text; meta?:Json;`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const { GqlWithKnexLoadList } = require('@condo/domains/common/utils/serverSchema')
const compact = require('lodash/compact')
const { generateServerUtils, execGqlWithoutAccess } = require('@condo/domains/common/utils/codegeneration/generate.server.utils')
const { Ticket: TicketGQL } = require('@condo/domains/ticket/gql')
const { TicketStatus: TicketStatusGQL } = require('@condo/domains/ticket/gql')
const { TicketChange: TicketChangeGQL } = require('@condo/domains/ticket/gql')
const { TicketFile: TicketFileGQL } = require('@condo/domains/ticket/gql')
const { TicketClassifier: TicketClassifierGQL } = require('@condo/domains/ticket/gql')
const { TicketComment: TicketCommentGQL } = require('@condo/domains/ticket/gql')
const { TicketPlaceClassifier: TicketPlaceClassifierGQL } = require('@condo/domains/ticket/gql')
const { TicketCategoryClassifier: TicketCategoryClassifierGQL } = require('@condo/domains/ticket/gql')
const { TicketProblemClassifier: TicketProblemClassifierGQL } = require('@condo/domains/ticket/gql')
const { TicketClassifierRule: TicketClassifierRuleGQL } = require('@condo/domains/ticket/gql')
const { ResidentTicket: ResidentTicketGQL } = require('@condo/domains/ticket/gql')
const { TicketSource: TicketSourceGQL } = require('@condo/domains/ticket/gql')
const { TicketFilterTemplate: TicketFilterTemplateGQL } = require('@condo/domains/ticket/gql')
const { PREDICT_TICKET_CLASSIFICATION_QUERY } = require('@condo/domains/ticket/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const Ticket = generateServerUtils(TicketGQL)
const TicketStatus = generateServerUtils(TicketStatusGQL)
const TicketChange = generateServerUtils(TicketChangeGQL)
const TicketFile = generateServerUtils(TicketFileGQL)
const TicketClassifier = generateServerUtils(TicketClassifierGQL)
const TicketComment = generateServerUtils(TicketCommentGQL)
const TicketSource = generateServerUtils(TicketSourceGQL)

const TicketPlaceClassifier = generateServerUtils(TicketPlaceClassifierGQL)
const TicketCategoryClassifier = generateServerUtils(TicketCategoryClassifierGQL)
const TicketProblemClassifier = generateServerUtils(TicketProblemClassifierGQL)
const TicketClassifierRule = generateServerUtils(TicketClassifierRuleGQL)

const ResidentTicket = generateServerUtils(ResidentTicketGQL)

const TicketFilterTemplate = generateServerUtils(TicketFilterTemplateGQL)

async function predictTicketClassification (context, data) {
    if (!context) throw new Error('no context')
    if (!data) throw new Error('no data')
    if (!data.details) throw new Error('no data details')

    return await execGqlWithoutAccess(context, {
        query: PREDICT_TICKET_CLASSIFICATION_QUERY,
        variables: { data },
        errorMessage: '[error] Unable to predictTicketClassification',
        dataPath: 'obj',
    })
}


/* AUTOGENERATE MARKER <CONST> */


const loadTicketsForExcelExport = async ({ where = {}, sortBy = ['createdAt_DESC'] }) => {
    const ticketStatusLoader = new GqlWithKnexLoadList({
        listKey: 'TicketStatus',
        fields: 'id type',
    })
    const statuses = await ticketStatusLoader.load()
    const statusIndexes = Object.fromEntries(statuses.map(status => ([status.type, status.id ])))
    const ticketsLoader = new GqlWithKnexLoadList({
        listKey: 'Ticket',
        fields: 'id number unitName sectionName floorName clientName clientPhone isEmergency isPaid isWarranty details createdAt updatedAt deadline reviewValue reviewComment statusReopenedCounter',
        singleRelations: [
            ['User', 'createdBy', 'name'],
            ['User', 'operator', 'name'],
            ['User', 'executor', 'name'],
            ['User', 'assignee', 'name'],
            ['TicketPlaceClassifier', 'placeClassifier', 'name'],
            ['TicketCategoryClassifier', 'categoryClassifier', 'name'],
            ['TicketProblemClassifier', 'problemClassifier', 'name'],
            ['Organization', 'organization', 'name'],
            ['Property', 'property', 'address'],
            ['TicketStatus', 'status', 'type'],
            ['TicketClassifier', 'classifier', 'name'],
            ['TicketSource', 'source', 'name'],
        ],
        multipleRelations: [
            [
                (idx, knex) => knex.raw(`ARRAY_AGG(mr${idx}.id || ':' || mr${idx}.content ORDER BY mr${idx}."createdAt" ASC) as "TicketComment"`),
                idx => [`TicketComment as mr${idx}`, `mr${idx}.ticket`, 'mainModel.id'],
            ],
            [
                (idx, knex) => knex.raw(`MAX(mr${idx}."createdAt") as "startedAt"`),
                idx => [`TicketChange as mr${idx}`, function () {
                    this.on(`mr${idx}.ticket`, 'mainModel.id').onIn(`mr${idx}.statusIdTo`, [statusIndexes.processing])
                }],
            ],
            [
                (idx, knex) => knex.raw(`MAX(mr${idx}."createdAt") as "completedAt"`),
                idx => [`TicketChange as mr${idx}`, function () {
                    this.on(`mr${idx}.ticket`, 'mainModel.id').onIn(`mr${idx}.statusIdTo`, [statusIndexes.canceled, statusIndexes.completed])
                }],
            ],
        ],
        sortBy,
        where,
    })
    const tickets = await ticketsLoader.load()
    tickets.forEach(ticket => {
        // if task has assigner then it was started on creation
        if (ticket.assignee && !ticket.startedAt && ticket.status !== 'new_or_reopened'){
            ticket.startedAt = ticket.createdAt
        }
        ticket.TicketComment = compact(ticket.TicketComment)
    })
    return tickets
}


module.exports = {
    Ticket,
    TicketStatus,
    TicketChange,
    TicketFile,
    TicketClassifier,
    TicketComment,
    TicketPlaceClassifier,
    TicketCategoryClassifier,
    TicketProblemClassifier,
    TicketClassifierRule,
    ResidentTicket,
    TicketSource,
    loadTicketsForExcelExport,
    TicketFilterTemplate,
    predictTicketClassification,
/* AUTOGENERATE MARKER <EXPORTS> */
}
