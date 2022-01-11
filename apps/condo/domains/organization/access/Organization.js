/**
 * Generated by `createschema organization.Organization 'country:Select:ru,en; name:Text; description?:Text; avatar?:File; meta:Json; employees:Relationship:OrganizationEmployee:CASCADE; statusTransitions:Json; defaultEmployeeRoleStatusTransitions:Json' --force`
 */
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { get, uniq, compact } = require('lodash')
const access = require('@core/keystone/access')
const { find } = require('@core/keystone/schema')
const { USER_SCHEMA_NAME } = require('@condo/domains/common/constants/utils')

async function canReadOrganizations ({ authentication: { item, listKey } }) {
    if (!listKey || !item) return throwAuthenticationError()
    if (item.deletedAt) return false

    if (listKey === USER_SCHEMA_NAME) {
        if (item.isSupport || item.isAdmin) return {}
        const userId = item.id

        if (item.type === RESIDENT) {
            const userResidents = await find('Resident', { user:{ id: userId }, deletedAt: null })
            if (!userResidents.length) return false
            const residentOrganizations = compact(userResidents.map(resident => get(resident, 'organization')))
            const residentsIds = userResidents.map(resident => resident.id)
            const userServiceConsumers = await find('ServiceConsumer', {
                resident: { id_in: residentsIds },
                deletedAt: null,
            })
            const serviceConsumerOrganizations = userServiceConsumers.map(sc => sc.organization)
            const organizations = [...residentOrganizations, ...serviceConsumerOrganizations]
            if (organizations.length) {
                return {
                    id_in: uniq(organizations),
                }
            }

            return false
        }

        const acquiringIntegrationRights = await find('AcquiringIntegrationAccessRight', {
            user: { id: userId },
            deletedAt: null,
        })

        // TODO(DOMA-1700): Better way to get access for acquiring integrations?
        if (acquiringIntegrationRights && acquiringIntegrationRights.length) {
            return {}
        }

        return {
            OR: [
                { employees_some: { user: { id: userId } } },
                { relatedOrganizations_some: { from: { employees_some: { user: { id: userId } } } } },
            ],
        }
    }

    return false
}

async function canManageOrganizations ({ authentication: { item, listKey }, operation }) {
    if (!listKey || !item) return throwAuthenticationError()
    if (item.deletedAt) return false

    if (listKey === USER_SCHEMA_NAME) {
        if (item.isAdmin) return true
        if (operation === 'create') {
            return false
        } else if (operation === 'update') {
            // user is inside employee list and is not blocked
            return {
                employees_some: { user: { id: item.id }, role: { canManageOrganization: true }, isBlocked: false, deletedAt: null },
            }
        }
    }

    return false
}

const canAccessToImportField = {
    read: access.userIsNotResidentUser,
    create: access.userIsAdmin,
    update: access.userIsAdmin,
}
/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadOrganizations,
    canManageOrganizations,
    canAccessToImportField,
}
