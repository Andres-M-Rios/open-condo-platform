/**
 * Generated by `createschema user.UserExternalIdentity`
 */
const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { RESIDENT } = require('@condo/domains/user/constants/common')

async function canReadUserExternalIntegrations ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.type === RESIDENT) {
        return {
            user: { id: user.id },
        }
    }

    if (user.isSupport || user.isAdmin) return {}
}

async function canManageUserExternalIntegrations ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.type === RESIDENT) {
        return {
            user: { id: user.id },
        }
    }

    if (user.isSupport || user.isAdmin) return {}
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadUserExternalIntegrations,
    canManageUserExternalIntegrations,
}
