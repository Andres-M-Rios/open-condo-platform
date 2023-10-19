/**
 * Generated by `createschema marketplace.InvoiceContext 'organization:Relationship:Organization:PROTECT; recipient:Json; email:Text; settings:Json; state:Json;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateServerUtils, execGqlWithoutAccess } = require('@open-condo/codegen/generate.server.utils')

const { InvoiceContext: InvoiceContextGQL } = require('@condo/domains/marketplace/gql')
const { MarketCategory: MarketCategoryGQL } = require('@condo/domains/marketplace/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const InvoiceContext = generateServerUtils(InvoiceContextGQL)
const MarketCategory = generateServerUtils(MarketCategoryGQL)
/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    InvoiceContext,
    MarketCategory,
/* AUTOGENERATE MARKER <EXPORTS> */
}