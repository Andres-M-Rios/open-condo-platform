/**
 * Generated by `createschema billing.BillingIntegration name:Text;`
 */

const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')

async function canReadBillingIntegrations ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    return {}
}

async function canManageBillingIntegrations ({ authentication: { item: user }, operation }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin) return true
    if (user.isSupport) return true
    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadBillingIntegrations,
    canManageBillingIntegrations,
}
