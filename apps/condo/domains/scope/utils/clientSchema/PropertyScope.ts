/**
 * Generated by `createschema scope.PropertyScope 'name:Text; organization:Relationship:Organization:CASCADE;isDefault:Checkbox;'`
 */

import {
    PropertyScope,
    PropertyScopeCreateInput,
    PropertyScopeUpdateInput,
    QueryAllPropertyScopesArgs,
} from '@app/condo/schema'

import { generateReactHooks } from '@open-condo/codegen/generate.hooks'

import { PropertyScope as PropertyScopeGQL } from '@condo/domains/scope/gql'

const {
    useCount,
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
    useAllObjects,
} = generateReactHooks<PropertyScope, PropertyScopeCreateInput, PropertyScopeUpdateInput, QueryAllPropertyScopesArgs>(PropertyScopeGQL)

export {
    useCount,
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
    useAllObjects,
}
