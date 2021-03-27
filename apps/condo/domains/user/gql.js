/**
 * Generated by `createschema user.User name:Text; password?:Password; isAdmin?:Checkbox; email?:Text; isEmailVerified?:Checkbox; phone?:Text; isPhoneVerified?:Checkbox; avatar?:File; meta:Json; importId:Text;`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const gql = require('graphql-tag')

const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')

const COMMON_FIELDS = 'id dv sender v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const USER_FIELDS = `{ name password isAdmin email isEmailVerified phone isPhoneVerified avatar meta importId ${COMMON_FIELDS} }`
const User = generateGqlQueries('User', USER_FIELDS)
const UserAdmin = generateGqlQueries('User', '{ id email phone }')

const REGISTER_NEW_USER_MUTATION = gql`
    mutation registerNewUser($data: RegisterNewUserInput!) {
        user: registerNewUser(data: $data) ${USER_FIELDS}
    }
`

const GET_MY_USERINFO = gql`
    query getUser {
        user: authenticatedUser ${USER_FIELDS}
    }
`

const SIGNIN_MUTATION = gql`
    mutation sigin($identity: String, $secret: String) {
        auth: authenticateUserWithPassword(email: $identity, password: $secret) {
            user: item ${USER_FIELDS}
        }
    }
`

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    User, UserAdmin, REGISTER_NEW_USER_MUTATION, GET_MY_USERINFO, SIGNIN_MUTATION,
/* AUTOGENERATE MARKER <EXPORTS> */
}
