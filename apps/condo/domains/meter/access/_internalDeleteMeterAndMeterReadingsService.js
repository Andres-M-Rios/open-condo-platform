/**
 * Generated by `createservice meter._internalDeleteMeterAndMeterReadingsService --type mutations`
 */
const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')

async function can_internalDeleteMeterAndMeterReadings ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin || user.isSupport) return true

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    can_internalDeleteMeterAndMeterReadings,
}