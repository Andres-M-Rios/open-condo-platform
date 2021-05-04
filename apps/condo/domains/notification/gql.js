/**
 * Generated by `createschema notification.Message 'organization?:Relationship:Organization:CASCADE; property?:Relationship:Property:CASCADE; ticket?:Relationship:Ticket:CASCADE; user:Relationship:User:CASCADE; type:Text; meta:Json; channels:Json; status:Select:sending,planned,sent,canceled; deliveredAt:DateTimeUtc;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const gql = require('graphql-tag')

const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')

const COMMON_FIELDS = 'id dv sender v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const MESSAGE_FIELDS = `{ organization { id } user { id email phone } email phone lang type meta status processingMeta deliveredAt ${COMMON_FIELDS} }`
const Message = generateGqlQueries('Message', MESSAGE_FIELDS)

const SEND_MESSAGE = gql`
    mutation sendMessage ($data: SendMessageInput!) {
        result: sendMessage(data: $data) { status id }
    }
`

const RESEND_MESSAGE = gql`
    mutation resendMessage ($data: ResendMessageInput!) {
        result: resendMessage(data: $data) { status id }
    }
`
/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    Message,
    SEND_MESSAGE, RESEND_MESSAGE,
/* AUTOGENERATE MARKER <EXPORTS> */
}
