/**
 * Generated by `createschema acquiring.PaymentsFilterTemplate 'name:Text; employee:Relationship:OrganizationEmployee:CASCADE'`
 */

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')
const { getById, getByCondition } = require('@open-condo/keystone/schema')

async function canReadPaymentsFilterTemplates ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.isAdmin) return {}

    return {
        employee: { organization: { ...queryOrganizationEmployeeFor(user.id) } },
        createdBy: { id: user.id },
    }
}

async function canManagePaymentsFilterTemplates ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    if (operation === 'create') {
        const employeeForUser = await getByCondition('OrganizationEmployee', {
            id: originalInput.employee.connect.id,
            user: { id: user.id },
            deletedAt: null,
            isBlocked: false,
            isAccepted: true,
            isRejected: false,
        })

        if (!employeeForUser) {
            return false
        }

        return true
    } else if (operation === 'update') {
        if (!itemId) return false
        const templateToEdit = await getById('PaymentsFilterTemplate', itemId)

        const employeeForUser = await getByCondition('OrganizationEmployee', {
            id: templateToEdit.employee,
            user: { id: user.id },
            deletedAt: null,
            isBlocked: false,
        })

        if (!employeeForUser) {
            return false
        }

        return true
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadPaymentsFilterTemplates,
    canManagePaymentsFilterTemplates,
}
