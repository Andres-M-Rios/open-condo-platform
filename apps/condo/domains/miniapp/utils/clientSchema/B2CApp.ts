/**
 * Generated by `createschema miniapp.B2CApp 'name:Text;'`
 */

import {
    B2CApp,
    B2CAppCreateInput,
    B2CAppUpdateInput,
    QueryAllB2CAppsArgs,
} from '@app/condo/schema'
import { generateReactHooks } from '@open-condo/codegen/generate.hooks'
import { B2CApp as B2CAppGQL } from '@condo/domains/miniapp/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<B2CApp, B2CAppCreateInput, B2CAppUpdateInput, QueryAllB2CAppsArgs>(B2CAppGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
