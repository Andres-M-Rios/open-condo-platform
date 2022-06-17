/**
 * Generated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; details:Text; meta?:Json;`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const { gql } = require('graphql-tag')

const { ADDRESS_META_SUBFIELDS_QUERY_LIST } = require('@condo/domains/property/schema/fields/AddressMetaField')
const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name type } updatedBy { id name } createdAt updatedAt'

const THREE_LVL_CLASSIFIER_FIELDS = 'placeClassifier { id name } categoryClassifier { id name } problemClassifier { id name } classifierRule { id }'
const TICKET_PROPERTY_FIELDS = `id name address deletedAt addressMeta { ${ADDRESS_META_SUBFIELDS_QUERY_LIST} }`
const TICKET_FIELDS = `{ canReadByResident reviewValue reviewComment deadline organization { id name } property { ${TICKET_PROPERTY_FIELDS} } propertyAddress propertyAddressMeta { ${ADDRESS_META_SUBFIELDS_QUERY_LIST} } unitType unitName sectionName floorName status { id name type organization { id } colors { primary secondary additional } } statusReopenedCounter statusUpdatedAt statusReason number client { id name } clientName clientEmail clientPhone contact { id name phone } operator { id name } assignee { id name } executor { id name } ${THREE_LVL_CLASSIFIER_FIELDS} details related { id details } isEmergency isPaid isWarranty meta source { id name type } sourceMeta ${COMMON_FIELDS} }`
const Ticket = generateGqlQueries('Ticket', TICKET_FIELDS)

const TICKET_STATUS_FIELDS = `{ organization { id } type name nameNonLocalized colors { primary secondary additional } ${COMMON_FIELDS} }`
const TicketStatus = generateGqlQueries('TicketStatus', TICKET_STATUS_FIELDS)
const TICKET_SOURCE_FIELDS = `{ organization { id } type name nameNonLocalized ${COMMON_FIELDS} }`
const TicketSource = generateGqlQueries('TicketSource', TICKET_SOURCE_FIELDS)
const SHARE_TICKET_MUTATION = gql`
    mutation shareTicket($data: ShareTicketInput!) {
        obj: shareTicket(data: $data) { status }
    }
`
/*
    We cannot use generated fields from TicketChange here, because we will have circular dependency,
    by requiring something from ./schema modules, that will cause all required items to be undefined.
    So, do it by hands here.
    PS: not exactly by hands, pasted from debugger ;)
*/
const TICKET_CHANGE_DATA_FIELDS = [
    'reviewValueFrom',
    'reviewValueTo',
    'reviewCommentFrom',
    'reviewCommentTo',
    'canReadByResidentFrom',
    'canReadByResidentTo',
    'deadlineFrom',
    'deadlineTo',
    'statusReopenedCounterFrom',
    'statusReopenedCounterTo',
    'statusReasonFrom',
    'statusReasonTo',
    'numberFrom',
    'numberTo',
    'clientNameFrom',
    'clientNameTo',
    'clientEmailFrom',
    'clientEmailTo',
    'clientPhoneFrom',
    'clientPhoneTo',
    'detailsFrom',
    'detailsTo',
    'isPaidFrom',
    'isPaidTo',
    'isEmergencyFrom',
    'isEmergencyTo',
    'isWarrantyFrom',
    'isWarrantyTo',
    'metaFrom',
    'metaTo',
    'sectionNameFrom',
    'sectionNameTo',
    'floorNameFrom',
    'floorNameTo',
    'unitNameFrom',
    'unitNameTo',
    'sourceMetaFrom',
    'sourceMetaTo',
    'organizationIdFrom',
    'organizationIdTo',
    'organizationDisplayNameFrom',
    'organizationDisplayNameTo',
    'statusIdFrom',
    'statusIdTo',
    'statusDisplayNameFrom',
    'statusDisplayNameTo',
    'clientIdFrom',
    'clientIdTo',
    'clientDisplayNameFrom',
    'clientDisplayNameTo',
    'contactIdFrom',
    'contactIdTo',
    'contactDisplayNameFrom',
    'contactDisplayNameTo',
    'operatorIdFrom',
    'operatorIdTo',
    'operatorDisplayNameFrom',
    'operatorDisplayNameTo',
    'assigneeIdFrom',
    'assigneeIdTo',
    'assigneeDisplayNameFrom',
    'assigneeDisplayNameTo',
    'executorIdFrom',
    'executorIdTo',
    'executorDisplayNameFrom',
    'executorDisplayNameTo',
    'placeClassifierIdFrom',
    'placeClassifierIdTo',
    'placeClassifierDisplayNameFrom',
    'placeClassifierDisplayNameTo',
    'categoryClassifierIdFrom',
    'categoryClassifierIdTo',
    'categoryClassifierDisplayNameFrom',
    'categoryClassifierDisplayNameTo',
    'problemClassifierIdFrom',
    'problemClassifierIdTo',
    'problemClassifierDisplayNameFrom',
    'problemClassifierDisplayNameTo',
    'relatedIdFrom',
    'relatedIdTo',
    'relatedDisplayNameFrom',
    'relatedDisplayNameTo',
    'propertyIdFrom',
    'propertyIdTo',
    'propertyDisplayNameFrom',
    'propertyDisplayNameTo',
    'sourceIdFrom',
    'sourceIdTo',
    'sourceDisplayNameFrom',
    'sourceDisplayNameTo',
]
const TICKET_CHANGE_FIELDS = `{ changedByRole ticket { id property { address } organization { id } } id dv sender { dv fingerprint } v createdBy { id name type } updatedBy { id name } createdAt updatedAt ${TICKET_CHANGE_DATA_FIELDS.join(' ')} }`
const TicketChange = generateGqlQueries('TicketChange', TICKET_CHANGE_FIELDS)
const TICKET_FILE_FIELDS = `{ id file { id originalFilename publicUrl mimetype } organization { id } ticket { id } ${COMMON_FIELDS} }`
const TicketFile = generateGqlQueries('TicketFile', TICKET_FILE_FIELDS)
const TICKET_COMMENT_FIELDS = `{ ticket { id } user { id name type } type content ${COMMON_FIELDS} }`
const TicketComment = generateGqlQueries('TicketComment', TICKET_COMMENT_FIELDS)
const TICKET_ANALYTICS_REPORT_QUERY = gql`
    query ticketAnalyticsReport ($data: TicketAnalyticsReportInput!) {
        result: ticketAnalyticsReport(data: $data) { groups { count status property dayGroup categoryClassifier executor assignee } ticketLabels { color label } }
    }
`
const EXPORT_TICKET_ANALYTICS_TO_EXCEL = gql`
    query exportTicketAnalyticsToExcel ($data: ExportTicketAnalyticsToExcelInput!) {
        result: exportTicketAnalyticsToExcel(data: $data) { link }
    }
`

const RESIDENT_TICKET_FIELDS = `{ organization { id name } property { id name address } unitName sectionName floorName number client { id name } clientName clientEmail clientPhone status { id name type organization { id } colors { primary secondary additional } } ${THREE_LVL_CLASSIFIER_FIELDS} details related { id details } isEmergency isPaid isWarranty source { id name type } id dv sender { dv fingerprint } v deletedAt newId createdAt updatedAt }`

// Actually there is no `ResidentTicket` Keystone schema presented.
// Here we will get a set of declarations of GraphQL mutation query strings for CRUD operations.
// We have corresponding custom mutations `createResidentTicket` and `updateResidentTicket` for them.
const ResidentTicket = generateGqlQueries('ResidentTicket', RESIDENT_TICKET_FIELDS)

const TICKET_PLACE_CLASSIFIER_FIELDS = `{ organization { id } name ${COMMON_FIELDS} }`
const TicketPlaceClassifier = generateGqlQueries('TicketPlaceClassifier', TICKET_PLACE_CLASSIFIER_FIELDS)

const TICKET_CATEGORY_CLASSIFIER_FIELDS = `{ organization { id } name ${COMMON_FIELDS} }`
const TicketCategoryClassifier = generateGqlQueries('TicketCategoryClassifier', TICKET_CATEGORY_CLASSIFIER_FIELDS)

const TICKET_PROBLEM_CLASSIFIER_FIELDS = `{ organization { id } name ${COMMON_FIELDS} }`
const TicketProblemClassifier = generateGqlQueries('TicketProblemClassifier', TICKET_PROBLEM_CLASSIFIER_FIELDS)

const TICKET_CLASSIFIER_RULE_FIELDS = `{ place { id name } category { id name } problem { id name } ${COMMON_FIELDS} }`
const TicketClassifierRule = generateGqlQueries('TicketClassifierRule', TICKET_CLASSIFIER_RULE_FIELDS)

const TICKET_FILTER_FIELDS = '{ organization number createdAt status details property address division clientName executor assignee executorName deadline assigneeName attributes source sectionName floorName unitType unitName placeClassifier categoryClassifier clientPhone author contactIsNull }'
const TICKET_FILTER_TEMPLATE_FIELDS = `{ name employee { id } fields ${TICKET_FILTER_FIELDS} ${COMMON_FIELDS} }`
const TicketFilterTemplate = generateGqlQueries('TicketFilterTemplate', TICKET_FILTER_TEMPLATE_FIELDS)


const PREDICT_TICKET_CLASSIFICATION_QUERY = gql`
    query predictTicketClassification ($data: PredictTicketClassificationInput!) {
        obj: predictTicketClassification(data: $data) { id place { id name } category { id name }  }
    }
`

const TICKET_COMMENT_FILE_FIELDS = `{ id file { id originalFilename publicUrl mimetype } organization { id } ticketComment { id } ticket { id } ${COMMON_FIELDS} }`
const TicketCommentFile = generateGqlQueries('TicketCommentFile', TICKET_COMMENT_FILE_FIELDS)

const TICKET_COMMENTS_TIME_FIELDS = `{ organization { id } ticket { id } lastCommentAt lastResidentCommentAt ${COMMON_FIELDS} }`
const TicketCommentsTime = generateGqlQueries('TicketCommentsTime', TICKET_COMMENTS_TIME_FIELDS)

const USER_TICKET_COMMENT_READ_TIME_FIELDS = `{ user { id } ticket { id } readResidentCommentAt readCommentAt ${COMMON_FIELDS} }`
const UserTicketCommentReadTime = generateGqlQueries('UserTicketCommentReadTime', USER_TICKET_COMMENT_READ_TIME_FIELDS)

const TICKET_HINT_FIELDS = `{ organization { id name } name properties { ${TICKET_PROPERTY_FIELDS} } content ${COMMON_FIELDS} }`
const TicketHint = generateGqlQueries('TicketHint', TICKET_HINT_FIELDS)

/* AUTOGENERATE MARKER <CONST> */
const EXPORT_TICKETS_TO_EXCEL =  gql`
    query exportTicketsToExcel ($data: ExportTicketsToExcelInput!) {
        result: exportTicketsToExcel(data: $data) { status, linkToFile }
    }
`
const GET_TICKET_WIDGET_REPORT_DATA = gql`
    query getWidgetData ($data: TicketReportWidgetInput!) {
        result: ticketReportWidgetData(data: $data) { data { statusName, currentValue, growth, statusType } }
    }
`
module.exports = {
    Ticket,
    TicketStatus,
    TicketChange,
    TicketSource,
    ResidentTicket,
    TicketFile,
    TICKET_CHANGE_DATA_FIELDS,
    EXPORT_TICKETS_TO_EXCEL,
    GET_TICKET_WIDGET_REPORT_DATA,
    TicketComment,
    TICKET_ANALYTICS_REPORT_QUERY,
    SHARE_TICKET_MUTATION,
    TicketPlaceClassifier,
    TicketCategoryClassifier,
    TicketProblemClassifier,
    TicketClassifierRule,
    RESIDENT_TICKET_FIELDS,
    EXPORT_TICKET_ANALYTICS_TO_EXCEL,
    TicketFilterTemplate,
    PREDICT_TICKET_CLASSIFICATION_QUERY,
    TicketCommentFile,
    TicketCommentsTime,
    UserTicketCommentReadTime,
    TicketHint,
/* AUTOGENERATE MARKER <EXPORTS> */
}
