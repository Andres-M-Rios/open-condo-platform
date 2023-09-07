/**
 * Generated by `createschema organization.Organization 'country:Select:ru,en; name:Text; description?:Text; avatar?:File; meta:Json; employees:Relationship:OrganizationEmployee:CASCADE; statusTransitions:Json; defaultEmployeeRoleStatusTransitions:Json' --force`
 */
const { get, uniq, compact } = require('lodash')

const access = require('@open-condo/keystone/access')
const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { find } = require('@open-condo/keystone/schema')

const { queryOrganizationEmployeeFor, queryOrganizationEmployeeFromRelatedOrganizationFor } = require('@condo/domains/organization/utils/accessSchema')
const { RESIDENT, SERVICE } = require('@condo/domains/user/constants/common')
const { canDirectlyReadSchemaObjects } = require('@condo/domains/user/utils/directAccess')

async function canReadOrganizations ({ authentication: { item: user }, listKey }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    
    if (user.isSupport || user.isAdmin) return {}
    const hasDirectAccess = await canDirectlyReadSchemaObjects(user, listKey)
    if (hasDirectAccess) return true

    if (user.type === RESIDENT) {
        const userResidents = await find('Resident', { user:{ id: user.id }, deletedAt: null })
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
    const accessConditions =  [
        { ...queryOrganizationEmployeeFor(user.id) },
        { ...queryOrganizationEmployeeFromRelatedOrganizationFor(user.id) },
    ]
    if (user.type === SERVICE) {
        const billingContexts = await find('BillingIntegrationOrganizationContext', {
            integration: {
                accessRights_some: { user: { id: user.id }, deletedAt: null },
            },
            deletedAt: null,
        })
        const acquiringContexts = await find('AcquiringIntegrationContext', {
            integration: {
                accessRights_some: { user: { id: user.id }, deletedAt: null },
            },
            deletedAt: null,
        })
        const bankIntegrationOrganizationContext = await find('BankIntegrationOrganizationContext', {
            integration: {
                accessRights_some: {
                    user: { id: user.id },
                    deletedAt: null,
                },
                deletedAt: null,
            },
            deletedAt: null,
        })
        const serviceOrganizationIds = uniq(billingContexts
            .map(({ organization }) => organization )
            .concat(acquiringContexts.map(({ organization }) => organization )))
            .concat(bankIntegrationOrganizationContext.map(({ organization }) => organization))
        if (serviceOrganizationIds.length) {
            accessConditions.push({ id_in: serviceOrganizationIds })
        }
    }

    return { OR: accessConditions }
}

async function canManageOrganizations ({ authentication: { item: user }, operation }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isSupport || user.isAdmin) return true

    if (operation === 'create') {
        return false
    } else if (operation === 'update') {
        // user is inside employee list and is not blocked
        return {
            employees_some: { user: { id: user.id }, role: { canManageOrganization: true }, isBlocked: false, deletedAt: null },
        }
    }
}

const canAccessToImportField = {
    read: access.userIsNotResidentUser,
    create: access.userIsAdmin,
    update: access.userIsAdminOrIsSupport,
}

const canAccessOnlyAdminField = {
    read: access.userIsAdmin,
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
    canAccessOnlyAdminField,
}
