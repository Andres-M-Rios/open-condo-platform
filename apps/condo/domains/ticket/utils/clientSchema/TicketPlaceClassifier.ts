/**
 * Generated by `createschema ticket.TicketPlaceClassifier 'organization?:Relationship:Organization:CASCADE;name:Text;'`
 */

import {
    TicketPlaceClassifier,
    TicketPlaceClassifierCreateInput,
    TicketPlaceClassifierUpdateInput,
    QueryAllTicketPlaceClassifiersArgs,
} from '@app/condo/schema'
import { generateNewReactHooks } from '@condo/domains/common/utils/codegeneration/new.generate.hooks'
import { TicketPlaceClassifier as TicketPlaceClassifierGQL } from '@condo/domains/ticket/gql'

const {
    useNewObject,
    useNewObjects,
    useNewCreate,
    useNewUpdate,
    useNewSoftDelete,
} = generateNewReactHooks<TicketPlaceClassifier, TicketPlaceClassifierCreateInput, TicketPlaceClassifierUpdateInput, QueryAllTicketPlaceClassifiersArgs>(TicketPlaceClassifierGQL)

export {
    useNewObject,
    useNewObjects,
    useNewCreate,
    useNewUpdate,
    useNewSoftDelete,
}
