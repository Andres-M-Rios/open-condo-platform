/**
 * Generated by `createschema miniapp.B2CAppProperty 'app:Relationship:B2CApp:PROTECT; address:Text;' --force`
 */

import { pick, get } from 'lodash'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'

import { B2CAppProperty as B2CAppPropertyGQL } from '@condo/domains/miniapp/gql'
import { B2CAppProperty, B2CAppPropertyUpdateInput, QueryAllB2CAppPropertiesArgs } from '../../../../schema'

const FIELDS = ['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'app', 'address']
const RELATIONS = ['app']

export interface IB2CAppPropertyUIState extends B2CAppProperty {
    id: string
}

function convertToUIState (item: B2CAppProperty): IB2CAppPropertyUIState {
    if (item.dv !== 1) throw new Error('unsupported item.dv')
    return pick(item, FIELDS) as IB2CAppPropertyUIState
}

export interface IB2CAppPropertyFormState {
    id?: undefined
}

function convertToUIFormState (state: IB2CAppPropertyUIState): IB2CAppPropertyFormState | undefined {
    if (!state) return
    const result = {}
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? attrId || state[attr] : state[attr]
    }
    return result as IB2CAppPropertyFormState
}

function convertToGQLInput (state: IB2CAppPropertyFormState): B2CAppPropertyUpdateInput {
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
} = generateReactHooks<B2CAppProperty, B2CAppPropertyUpdateInput, IB2CAppPropertyFormState, IB2CAppPropertyUIState, QueryAllB2CAppPropertiesArgs>(B2CAppPropertyGQL, { convertToGQLInput, convertToUIState })

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
    convertToUIFormState,
}
