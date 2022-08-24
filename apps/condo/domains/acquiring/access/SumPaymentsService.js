/**
 * Generated by `createservice acquiring.SumPaymentsService`
 */
const { throwAuthenticationError } = require('@condo/keystone/apolloErrorFormatter')

async function canSumPayments ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    // TODO(codegen): write mutation access logic!
    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canSumPayments,
}