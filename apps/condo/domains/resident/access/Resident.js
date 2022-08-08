/**
 * Generated by `createschema resident.Resident 'user:Relationship:User:CASCADE; organization:Relationship:Organization:PROTECT; property:Relationship:Property:PROTECT; billingAccount?:Relationship:BillingAccount:SET_NULL; unitName:Text;'`
 */
const { throwAuthenticationError } = require('@condo/keystone/apolloErrorFormatter')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { isSoftDelete } = require('@condo/keystone/access')
const { getById } = require('@condo/keystone/schema')

async function canReadResidents ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    
    if (user.isAdmin) return {}

    if (user.type === RESIDENT) {
        return { user: { id: user.id } }
    }

    return false
}

async function canManageResidents ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    if (user.type === RESIDENT) {
        // Only soft-delete is allowed for current resident
        if (operation === 'update' && itemId) {
            const resident = await getById('Resident', itemId)
            if (!resident || resident.user !== user.id) return false
            if (isSoftDelete(originalInput)) return true
        }

        return false
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadResidents,
    canManageResidents,
}