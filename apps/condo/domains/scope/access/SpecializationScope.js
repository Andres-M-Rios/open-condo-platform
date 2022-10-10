/**
 * Generated by `createschema scope.SpecializationScope 'employee:Relationship:OrganizationEmployee:CASCADE; specialization:Relationship:TicketCategoryClassifier:CASCADE;'`
 */
const get = require('lodash/get')

const { getById } = require('@condo/keystone/schema')
const { isSoftDelete } = require('@condo/keystone/access')
const { throwAuthenticationError } = require('@condo/keystone/apolloErrorFormatter')

const { queryOrganizationEmployeeFor, queryOrganizationEmployeeFromRelatedOrganizationFor, checkOrganizationPermission } = require('@condo/domains/organization/utils/accessSchema')

async function canReadSpecializationScopes ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.isAdmin || user.isSupport) return {}

    return {
        employee: {
            organization: {
                OR: [
                    queryOrganizationEmployeeFor(user.id),
                    queryOrganizationEmployeeFromRelatedOrganizationFor(user.id),
                ],
            },
        },
    }
}

async function canManageSpecializationScopes ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin || user.isSupport) return true

    if (operation === 'create') {
        const employeeId = get(originalInput, ['employee', 'connect', 'id'])
        if (!employeeId) return false

        const employee = await getById('OrganizationEmployee', employeeId)
        const organizationId = get(employee, 'organization')

        return await checkOrganizationPermission(user.id, organizationId, 'canManageEmployees')
    } else if (operation === 'update' && itemId) {
        if (!isSoftDelete(originalInput)) return false

        const specializationScope = await getById('SpecializationScope', itemId)
        if (!specializationScope) return false

        const employeeId = specializationScope.employee
        const employee = await getById('OrganizationEmployee', employeeId)
        const organizationId = get(employee, 'organization')

        return await checkOrganizationPermission(user.id, organizationId, 'canManageEmployees')
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadSpecializationScopes,
    canManageSpecializationScopes,
}