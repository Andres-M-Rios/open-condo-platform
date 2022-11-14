/**
 * Generated by `createschema address.Address 'source:Text; address:Text; key:Text; meta:Json'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateGqlQueries } = require('@open-condo/codegen/generate.gql')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const ADDRESS_FIELDS = `{ source address key meta ${COMMON_FIELDS} }`
const Address = generateGqlQueries('Address', ADDRESS_FIELDS)

const ADDRESS_INJECTION_FIELDS = `{ country region area city cityDistrict settlement street house block keywords meta ${COMMON_FIELDS} }`
const AddressInjection = generateGqlQueries('AddressInjection', ADDRESS_INJECTION_FIELDS)

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    Address,
    AddressInjection,
/* AUTOGENERATE MARKER <EXPORTS> */
}
