/**
 * Generated by `createservice acquiring.RegisterMultiPaymentService`
 */
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { USER_SCHEMA_NAME } = require('@condo/domains/common/constants/utils')

async function canRegisterMultiPayment ({ authentication: { item, listKey } }) {
    if (!listKey || !item) return throwAuthenticationError()
    if (item.deletedAt) return false

    if (listKey === USER_SCHEMA_NAME) {
        return item.isAdmin || item.type === RESIDENT
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canRegisterMultiPayment,
}