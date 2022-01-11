/**
 * Generated by `createschema contact.Contact 'property:Relationship:Property:SET_NULL; name:Text; phone:Text; unitName?:Text; email?:Text;'`
 */

const get = require('lodash/get')
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { getById } = require('@core/keystone/schema')
const { checkPermissionInUserOrganizationOrRelatedOrganization } = require('@condo/domains/organization/utils/accessSchema')
const { queryOrganizationEmployeeFromRelatedOrganizationFor } = require('@condo/domains/organization/utils/accessSchema')
const { queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')
const { USER_SCHEMA_NAME } = require('@condo/domains/common/constants/utils')

async function canReadContacts ({ authentication: { item, listKey } }) {
    if (!listKey || !item) return throwAuthenticationError()
    if (item.deletedAt) return false

    if (listKey === USER_SCHEMA_NAME) {
        if (item.isAdmin) return {}
        const userId = item.id

        return {
            organization: {
                OR: [
                    queryOrganizationEmployeeFor(userId),
                    queryOrganizationEmployeeFromRelatedOrganizationFor(userId),
                ],
            },
        }
    }

    return false
}

async function canManageContacts ({ authentication: { item, listKey }, originalInput, operation, itemId }) {
    if (!listKey || !item) return throwAuthenticationError()
    if (item.deletedAt) return false

    if (listKey === USER_SCHEMA_NAME) {
        if (item.isAdmin) return true
        const userId = item.id

        if (operation === 'create') {
            const organizationId = get(originalInput, ['organization', 'connect', 'id'])

            return await checkPermissionInUserOrganizationOrRelatedOrganization(userId, organizationId, 'canManageContacts')
        }

        if (operation === 'update') {
            const contact = await getById('Contact', itemId)
            if (!contact) return false
            const contactOrganization = contact.organization

            return await checkPermissionInUserOrganizationOrRelatedOrganization(userId, contactOrganization, 'canManageContacts')
        }
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadContacts,
    canManageContacts,
}
