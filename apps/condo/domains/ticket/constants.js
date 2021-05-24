/**
 * Generated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; classifier:Relationship:TicketClassifier:PROTECT; details:Text; meta?:Json;`
 */

const NEW_OR_REOPENED_STATUS_TYPE = 'new_or_reopened'
const PROCESSING_STATUS_TYPE = 'processing'
const CANCELED_STATUS_TYPE = 'canceled'
const COMPLETED_STATUS_TYPE = 'completed'
const DEFERRED_STATUS_TYPE = 'deferred'
const CLOSED_STATUS_TYPE = 'closed'

const TICKET_STATUS_TYPES = [
    NEW_OR_REOPENED_STATUS_TYPE,
    PROCESSING_STATUS_TYPE,
    CANCELED_STATUS_TYPE,
    COMPLETED_STATUS_TYPE,
    DEFERRED_STATUS_TYPE,
    CLOSED_STATUS_TYPE,
]

/*
    `sender` is an internal field, that don't need to be displayed in UI.
    It's not participating in Ticket changes UI for customer.
 */
const OMIT_TICKET_CHANGE_TRACKABLE_FIELDS = ['dv', 'sender']

module.exports = {
    NEW_OR_REOPENED_STATUS_TYPE,
    PROCESSING_STATUS_TYPE,
    CANCELED_STATUS_TYPE,
    COMPLETED_STATUS_TYPE,
    DEFERRED_STATUS_TYPE,
    CLOSED_STATUS_TYPE,
    TICKET_STATUS_TYPES,
    OMIT_TICKET_CHANGE_TRACKABLE_FIELDS,
}
