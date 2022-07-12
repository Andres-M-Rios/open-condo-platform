/**
 * Generated by `createschema user.OidcClient 'clientId:Text; payload:Json; name?:Text; meta?:Json'`
 */

import {
    OidcClient,
    OidcClientCreateInput,
    OidcClientUpdateInput,
    QueryAllOidcClientsArgs,
} from '@app/condo/schema'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'
import { OidcClient as OidcClientGQL } from '@condo/domains/user/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<OidcClient, OidcClientCreateInput, OidcClientUpdateInput, QueryAllOidcClientsArgs>(OidcClientGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
