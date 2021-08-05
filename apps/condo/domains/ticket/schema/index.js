/**
 * This file is autogenerated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; classifier:Relationship:TicketClassifier:PROTECT; details:Text; meta?:Json;`
 * In most cases you should not change it by hands. And please don't remove `AUTOGENERATE MARKER`s
 */

const { Ticket } = require('./Ticket')
const { TicketReportService } = require('./TicketReportService')
const { TicketSource } = require('./TicketSource')
const { TicketClassifier } = require('./TicketClassifier')
const { TicketStatus } = require('./TicketStatus')
const { TicketFile } = require('./TicketFile')
const { TicketChange } = require('./TicketChange')
const { TicketComment } = require('./TicketComment')
const { ExportTicketsService } = require('./ExportTicketsService')
const { TicketAnalyticsReportService } = require('./TicketAnalyticsReportService')
const { ShareTicketService } = require('./ShareTicketService')
const { CreateResidentTicketService } = require('./CreateResidentTicketService')
const { GetAllResidentTicketsService } = require('./GetAllResidentTicketsService')
const { UpdateResidentTicketService } = require('./UpdateResidentTicketService')
/* AUTOGENERATE MARKER <REQUIRE> */

module.exports = {
    Ticket,
    TicketReportService,
    TicketSource,
    TicketClassifier,
    TicketStatus,
    TicketFile,
    TicketChange,
    TicketComment,
    ExportTicketsService,
    TicketAnalyticsReportService,
    ShareTicketService,
    CreateResidentTicketService,
    GetAllResidentTicketsService,
    UpdateResidentTicketService,
/* AUTOGENERATE MARKER <EXPORTS> */
}
