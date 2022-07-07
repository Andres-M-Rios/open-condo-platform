/**
 * Generated by `createschema ticket.TicketFile 'organization:Text;file?:File;ticket?:Relationship:Ticket:SET_NULL;'`
 */

import { pick, get } from 'lodash'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'
import { generateNewReactHooks } from '@condo/domains/common/utils/codegeneration/new.generate.hooks'

import { TicketFile as TicketFileGQL } from '@condo/domains/ticket/gql'
import { Ticket, TicketFile, TicketFileCreateInput, TicketFileUpdateInput, QueryAllTicketFilesArgs, Organization, File } from '@app/condo/schema'

const FIELDS = ['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'file', 'ticket', 'organization']
const RELATIONS = ['ticket', 'organization']

export interface ITicketFileUIState extends TicketFile {
    id: string
    file?: File
    organization?: Organization
    ticket?: Ticket
    // TODO(codegen): write ITicketFileUIState or extends it from
}

function convertToUIState (item: TicketFile): ITicketFileUIState {
    if (item.dv !== 1) throw new Error('unsupported item.dv')
    return pick(item, FIELDS) as ITicketFileUIState
}

export interface ITicketFileFormState {
    id?: undefined
    file?: File
    organization?: Organization
    ticket?: Ticket
}

function convertToUIFormState (state: ITicketFileUIState): ITicketFileFormState | undefined {
    if (!state) return
    const result = {}
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? attrId || state[attr] : state[attr]
    }
    return result as ITicketFileFormState
}

function convertToGQLInput (state: ITicketFileFormState): TicketFileUpdateInput {
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
    useSoftDelete,
} = generateReactHooks<TicketFile, TicketFileUpdateInput, ITicketFileFormState, ITicketFileUIState, QueryAllTicketFilesArgs>(TicketFileGQL, { convertToGQLInput, convertToUIState })
const {
    useNewObject,
    useNewObjects,
    useNewCreate,
    useNewUpdate,
    useNewSoftDelete,
} = generateNewReactHooks<TicketFile, TicketFileCreateInput, TicketFileUpdateInput, QueryAllTicketFilesArgs>(TicketFileGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
    useSoftDelete,
    convertToUIFormState,
    useNewObject,
    useNewObjects,
    useNewCreate,
    useNewUpdate,
    useNewSoftDelete,
}
