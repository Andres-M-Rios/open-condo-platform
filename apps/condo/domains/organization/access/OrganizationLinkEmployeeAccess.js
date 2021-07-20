/**
 * Generated by `createschema organization.OrganizationLinkEmployeeAccess 'link:Relationship:OrganizationLink:CASCADE; employee:Relationship:OrganizationEmployee:CASCADE; canManageOrganization:Checkbox; canManageEmployees:Checkbox; canManageRoles:Checkbox; canManageIntegrations:Checkbox; canManageProperties:Checkbox; canManageTickets:Checkbox;'`
 */

async function canReadOrganizationLinkEmployeeAccesses ({ authentication: { item: user } }) {
    if (!user) return false
    if (user.isAdmin || user.isSupport) return true
}

async function canManageOrganizationLinkEmployeeAccesses ({ authentication: { item: user }, originalInput, operation, itemId, context }) {
    if (!user) return false
    if (user.isAdmin || user.isSupport) return true
    // добавить проверку что эмплои есть во фром
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadOrganizationLinkEmployeeAccesses,
    canManageOrganizationLinkEmployeeAccesses,
}
