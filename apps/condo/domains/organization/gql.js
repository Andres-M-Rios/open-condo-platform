/**
 * Generated by `createschema organization.Organization 'country:Select:ru,en; name:Text; description?:Text; avatar?:File; meta:Json; tin?:String; employees:Relationship:OrganizationEmployee:CASCADE; statusTransitions:Json; defaultEmployeeRoleStatusTransitions:Json' --force`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { gql } = require('graphql-tag')

const { generateGqlQueries } = require('@condo/codegen/generate.gql')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const ORGANIZATION_FIELDS = `{ country name description avatar { publicUrl } meta tin statusTransitions defaultEmployeeRoleStatusTransitions importId importRemoteSystem ${COMMON_FIELDS} }`
const Organization = generateGqlQueries('Organization', ORGANIZATION_FIELDS)

const ORGANIZATION_EMPLOYEE_ROLE_FIELDS = '{ organization { id } name nameNonLocalized description descriptionNonLocalized statusTransitions canManageOrganization canManageEmployees canInviteNewOrganizationEmployees canManageRoles canManageTicketPropertyHints canManageIntegrations canReadBillingReceipts canReadPayments canManageProperties canManageTickets canManageContacts canManageContactRoles canManageTicketComments canManageDivisions canShareTickets canBeAssignedAsResponsible canBeAssignedAsExecutor canManageMeters canManageMeterReadings canReadEntitiesOnlyInScopeOfDivision id dv sender { dv fingerprint } v createdBy { id name } updatedBy { id name } createdAt updatedAt }'
const OrganizationEmployeeRole = generateGqlQueries('OrganizationEmployeeRole', ORGANIZATION_EMPLOYEE_ROLE_FIELDS)

const ORGANIZATION_EMPLOYEE_FIELDS = `{ organization ${ORGANIZATION_FIELDS} user { id name } name email phone specializations { id name } role ${ORGANIZATION_EMPLOYEE_ROLE_FIELDS} isRejected isAccepted isBlocked id dv sender { dv fingerprint } v createdBy { id name } updatedBy { id name } position createdAt deletedAt updatedAt }`
const OrganizationEmployee = generateGqlQueries('OrganizationEmployee', ORGANIZATION_EMPLOYEE_FIELDS)

const ORGANIZATION_LINK_FIELDS = `{ from ${ORGANIZATION_FIELDS} to { id name } ${COMMON_FIELDS} }`
const OrganizationLink = generateGqlQueries('OrganizationLink', ORGANIZATION_LINK_FIELDS)

// TODO(pahaz): rename autocomplete queries

const GET_ORGANIZATION_EMPLOYEE_BY_ID_QUERY = gql`
    query getOrganizationEmployeeById($id: ID!) {
        obj: OrganizationEmployee(where: {id: $id}) ${ORGANIZATION_EMPLOYEE_FIELDS}
    }
`

const UPDATE_ORGANIZATION_BY_ID_MUTATION = gql`
    mutation updateOrganizationById($id: ID!, $data: OrganizationUpdateInput!) {
        obj: updateOrganization(id: $id, data: $data) ${ORGANIZATION_FIELDS}
    }
`

const GET_ALL_EMPLOYEE_ORGANIZATIONS_QUERY = gql`
    query getAllOrganizationEmployeesWithMeta($where: OrganizationEmployeeWhereInput) {
        meta: _allOrganizationEmployeesMeta { count }
        objs: allOrganizationEmployees(where: $where) ${ORGANIZATION_EMPLOYEE_FIELDS}
    }
`

// Since field `inviteCode` is not exposed for OrganizationEmployee, we need to query it directly
const GET_ORGANIZATION_EMPLOYEE_BY_ID_WITH_INVITE_CODE_QUERY = gql`
    query getOrganizationEmployeeByIdWithInviteCode (
        $id: ID!
    ) {
        objs: allOrganizationEmployees(
            where: {
                id: $id
            }
            first: 1
        ) {
            id
            inviteCode
        }
    }
`

const REGISTER_NEW_ORGANIZATION_MUTATION = gql`
    mutation registerNewOrganization($data: RegisterNewOrganizationInput!) {
        obj: registerNewOrganization(data: $data) ${ORGANIZATION_FIELDS}
    }
`

const INVITE_NEW_ORGANIZATION_EMPLOYEE_MUTATION = gql`
    mutation inviteNewOrganizationEmployee($data: InviteNewOrganizationEmployeeInput!) {
        obj: inviteNewOrganizationEmployee(data: $data) ${ORGANIZATION_EMPLOYEE_FIELDS}
    }
`

const REINVITE_ORGANIZATION_EMPLOYEE_MUTATION = gql`
    mutation reInviteOrganizationEmployee($data: ReInviteOrganizationEmployeeInput!) {
        obj: reInviteOrganizationEmployee(data: $data) ${ORGANIZATION_EMPLOYEE_FIELDS}
    }
`

const ACCEPT_OR_REJECT_ORGANIZATION_INVITE_BY_ID_MUTATION = gql`
    mutation acceptOrRejectOrganizationInviteById($id: ID!, $data: AcceptOrRejectOrganizationInviteInput!){
        obj: acceptOrRejectOrganizationInviteById(id: $id, data: $data) ${ORGANIZATION_EMPLOYEE_FIELDS}
    }
`

const ACCEPT_OR_REJECT_ORGANIZATION_INVITE_BY_CODE_MUTATION = gql`
    mutation acceptOrRejectOrganizationInviteByCode($inviteCode: String!, $data: AcceptOrRejectOrganizationInviteInput!){
        obj: acceptOrRejectOrganizationInviteByCode(inviteCode: $inviteCode, data: $data) ${ORGANIZATION_EMPLOYEE_FIELDS}
    }
`

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    Organization,
    OrganizationEmployeeRole,
    OrganizationEmployee,
    OrganizationLink,
    GET_ORGANIZATION_EMPLOYEE_BY_ID_QUERY,
    UPDATE_ORGANIZATION_BY_ID_MUTATION,
    GET_ALL_EMPLOYEE_ORGANIZATIONS_QUERY,
    GET_ORGANIZATION_EMPLOYEE_BY_ID_WITH_INVITE_CODE_QUERY,
    REGISTER_NEW_ORGANIZATION_MUTATION,
    REINVITE_ORGANIZATION_EMPLOYEE_MUTATION,
    INVITE_NEW_ORGANIZATION_EMPLOYEE_MUTATION,
    ACCEPT_OR_REJECT_ORGANIZATION_INVITE_BY_ID_MUTATION,
    ACCEPT_OR_REJECT_ORGANIZATION_INVITE_BY_CODE_MUTATION,
}
/* AUTOGENERATE MARKER <EXPORTS> */
