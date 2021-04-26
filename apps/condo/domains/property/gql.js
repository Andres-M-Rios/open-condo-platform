/**
 * Generated by `createschema property.Property 'organization:Text; name:Text; address:Text; addressMeta:Json; type:Select:building,village; map?:Json'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')
const gql = require('graphql-tag')

const COMMON_FIELDS = 'id dv sender v deletedAt organization { id name} newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const PROPERTY_FIELDS = `{ name address addressMeta type ticketsInWork ticketsClosed unitsCount map ${COMMON_FIELDS} }`
const Property = generateGqlQueries('Property', PROPERTY_FIELDS)

const GET_TICKET_INWORK_COUNT_BY_PROPERTY_ID_QUERY = gql`
    query GetTicketInWorkCountForProperty ($propertyId: ID!) {
        inwork: _allTicketsMeta(where: { status: { type_not:  closed }, property: { id: $propertyId } }) {
            count
        }  
  }
`
const GET_TICKET_CLOSED_COUNT_BY_PROPERTY_ID_QUERY = gql`
    query GetTicketInWorkCountForProperty ($propertyId: ID!) {
        closed: _allTicketsMeta(where: { status: { type:  closed }, property: { id: $propertyId } }) {
            count
        }  
  }
`


/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    Property,
    GET_TICKET_INWORK_COUNT_BY_PROPERTY_ID_QUERY,
    GET_TICKET_CLOSED_COUNT_BY_PROPERTY_ID_QUERY,
/* AUTOGENERATE MARKER <EXPORTS> */
}
