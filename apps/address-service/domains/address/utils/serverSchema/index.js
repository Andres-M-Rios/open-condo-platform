/**
 * Generated by `createschema address.Address 'source:Text; address:Text; key:Text; meta:Json'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { Address: AddressGQL } = require('@address-service/domains/address/gql')
const { generateServerUtils } = require('@open-condo/codegen/generate.server.utils')
const { AddressInjection: AddressInjectionGQL } = require('@address-service/domains/address/gql')
const { AddressSource: AddressSourceGQL } = require('@address-service/domains/address/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const Address = generateServerUtils(AddressGQL)
const AddressInjection = generateServerUtils(AddressInjectionGQL)
const AddressSource = generateServerUtils(AddressSourceGQL)
/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    Address,
    AddressInjection,
    AddressSource,
/* AUTOGENERATE MARKER <EXPORTS> */
}
