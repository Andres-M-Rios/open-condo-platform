/**
 * Generated by `createschema marketplace.MarketPriceScope 'itemPrice:Relationship:MarketItemPrice:CASCADE; property:Relationship:Property:CASCADE; organization:Relationship:Organization:CASCADE;'`
 */

import {
    MarketPriceScope,
    MarketPriceScopeCreateInput,
    MarketPriceScopeUpdateInput,
    QueryAllMarketPriceScopesArgs,
} from '@app/condo/schema'

import { generateReactHooks } from '@open-condo/codegen/generate.hooks'

import { MarketPriceScope as MarketPriceScopeGQL } from '@condo/domains/marketplace/gql'


const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
    useAllObjects,
    useCreateMany,
    useSoftDeleteMany,
} = generateReactHooks<MarketPriceScope, MarketPriceScopeCreateInput, MarketPriceScopeUpdateInput, QueryAllMarketPriceScopesArgs>(MarketPriceScopeGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
    useAllObjects,
    useCreateMany,
    useSoftDeleteMany,
}
