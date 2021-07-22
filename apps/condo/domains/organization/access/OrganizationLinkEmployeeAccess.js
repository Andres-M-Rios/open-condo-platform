/**
 * Generated by `createschema organization.OrganizationLinkEmployeeAccess 'link:Relationship:OrganizationLink:CASCADE; employee:Relationship:OrganizationEmployee:CASCADE; canManageOrganization:Checkbox; canManageEmployees:Checkbox; canManageRoles:Checkbox; canManageIntegrations:Checkbox; canManageProperties:Checkbox; canManageTickets:Checkbox;'`
 */

const { OrganizationLinkEmployeeAccess } = require('../utils/serverSchema')
const { OrganizationEmployee } = require('../utils/serverSchema')
const { OrganizationLink } = require('../utils/serverSchema')

async function canReadOrganizationLinkEmployeeAccesses ({ authentication: { item: user } }) {
    if (!user) return false
    if (user.isAdmin || user.isSupport) return true
}

async function canManageOrganizationLinkEmployeeAccesses ({ authentication: { item: user }, originalInput, operation, itemId, context }) {
    if (!user) return false
    if (user.isAdmin || user.isSupport) {
        let linkId
        let employeeFromId
        if (operation === 'create') {
            const { employee : { connect: { id } }, link: { connect: { id: connectedLinkId } } } = originalInput
            employeeFromId = id
            linkId = connectedLinkId
        } else if (operation === 'update') {
            const [access] = await OrganizationLinkEmployeeAccess.getAll(context, { id: itemId })
            if (!access) return false
            linkId = access.link.id
            employeeFromId = access.employee.id
        } else {
            return false
        }

        const [link] = await OrganizationLink.getAll(context, { id: linkId })
        if (!link) return false
        // checking that the employee is in the organization "from"
        const [employeeFrom] = await OrganizationEmployee.getAll(context, {
            AND: [
                { organization: { id: link.from.id } },
                { id: employeeFromId, isBlocked: false, deletedAt: null },
            ],
        })
        if (!employeeFrom) return false
        return true
    }
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadOrganizationLinkEmployeeAccesses,
    canManageOrganizationLinkEmployeeAccesses,
}
