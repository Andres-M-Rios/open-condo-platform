/**
 * Generated by `createschema organization.TokenSet 'user:Relationship:User:SET_NULL; organization:Relationship:Organization:SET_NULL; importRemoteSystem:Text; accessToken:Text; accessTokenExpiresAt:DateTimeUtc; refreshToken:Text; refreshTokenExpiresAt:DateTimeUtc;'`
 */

import { pick, get } from 'lodash'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'

import { TokenSet as TokenSetGQL } from '@condo/domains/organization/gql'
import { TokenSet, TokenSetUpdateInput, QueryAllTokenSetsArgs } from '@app/condo/schema'

const FIELDS = ['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'user', 'organization', 'importRemoteSystem', 'accessToken', 'accessTokenExpiresAt', 'refreshToken', 'refreshTokenExpiresAt']
const RELATIONS = ['user', 'organization']

export interface ITokenSetUIState extends TokenSet {
    id: string
    // TODO(codegen): write ITokenSetUIState or extends it from
}

function convertToUIState (item: TokenSet): ITokenSetUIState {
    if (item.dv !== 1) throw new Error('unsupported item.dv')
    return pick(item, FIELDS) as ITokenSetUIState
}

export interface ITokenSetFormState {
    id?: undefined
    // TODO(codegen): write ITokenSetUIFormState or extends it from
}

function convertToUIFormState (state: ITokenSetUIState): ITokenSetFormState | undefined {
    if (!state) return
    const result = {}
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? attrId || state[attr] : state[attr]
    }
    return result as ITokenSetFormState
}

function convertToGQLInput (state: ITokenSetFormState): TokenSetUpdateInput {
    const sender = getClientSideSenderInfo()
    const result = { dv: 1, sender }
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? { connect: { id: (attrId || state[attr]) } } : state[attr]
    }
    return result
}

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
} = generateReactHooks<TokenSet, TokenSetUpdateInput, ITokenSetFormState, ITokenSetUIState, QueryAllTokenSetsArgs>(TokenSetGQL, { convertToGQLInput, convertToUIState })

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
    convertToUIFormState,
}
