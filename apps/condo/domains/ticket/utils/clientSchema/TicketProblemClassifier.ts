/**
 * Generated by `createschema ticket.TicketProblemClassifier 'organization?:Relationship:Organization:CASCADE;name:Text;'`
 */

import {
    TicketProblemClassifier,
    TicketProblemClassifierCreateInput,
    TicketProblemClassifierUpdateInput,
    QueryAllTicketProblemClassifiersArgs,
} from '@app/condo/schema'
import { generateNewReactHooks } from '@condo/domains/common/utils/codegeneration/new.generate.hooks'
import { TicketProblemClassifier as TicketProblemClassifierGQL } from '@condo/domains/ticket/gql'

const {
    useNewObject,
    useNewObjects,
    useNewCreate,
    useNewUpdate,
    useNewSoftDelete,
} = generateNewReactHooks<TicketProblemClassifier, TicketProblemClassifierCreateInput, TicketProblemClassifierUpdateInput, QueryAllTicketProblemClassifiersArgs>(TicketProblemClassifierGQL)

export {
    useNewObject,
    useNewObjects,
    useNewCreate,
    useNewUpdate,
    useNewSoftDelete,
}
