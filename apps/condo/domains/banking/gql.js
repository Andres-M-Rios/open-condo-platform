/**
 * Generated by `createschema banking.BankCategory 'name:Text;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const gql = require('graphql-tag')

const { generateGqlQueries } = require('@open-condo/codegen/generate.gql')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const BANK_CATEGORY_FIELDS = `{ name ${COMMON_FIELDS} }`
const BankCategory = generateGqlQueries('BankCategory', BANK_CATEGORY_FIELDS)

const BANK_ACCOUNT_FIELDS = `{ organization { id } tin country routingNumber number currencyCode approvedAt approvedBy { id name } importId territoryCode bankName meta tinMeta routingNumberMeta ${COMMON_FIELDS} }`
const BankAccount = generateGqlQueries('BankAccount', BANK_ACCOUNT_FIELDS)

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    BankAccount,
    BankCategory,
/* AUTOGENERATE MARKER <EXPORTS> */
}
