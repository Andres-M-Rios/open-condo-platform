/**
 * Generated by `createschema condo.User 'name:Text;isAdmin:Checkbox;isSupport:Checkbox;type:Text' --force`
 */

const access = require('@condo/keystone/access')

const { throwAuthenticationError } = require('@condo/keystone/apolloErrorFormatter')

async function canReadUsers ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    return true
}

async function canManageUsers ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    // All users should be exported from condo API!
    // By default this service doesn't need to update User model!
    // Except the tests!
    return user.isAdmin
}

const canReadByAnyAndChangeByAdmin = {
    read: true,
    create: access.userIsAdmin,
    update: access.userIsAdmin,
}

const canAccessToPasswordField = {
    read: false,
    create: access.userIsAdmin,
    update: ({ existingItem, authentication: { item: user } }) => {
        if (!user || !existingItem || !existingItem.id) return false
        if (user.isAdmin) return true
        // Note: allow to local users to change their password
        return user.isLocal && existingItem.id === user.id
    },
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadUsers,
    canManageUsers,
    canReadByAnyAndChangeByAdmin,
    canAccessToPasswordField,
}
