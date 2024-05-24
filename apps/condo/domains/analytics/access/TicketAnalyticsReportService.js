/**
 * Generated by `createservice ticket.TicketAnalyticsReportService`
 */
const get = require('lodash/get')

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')

const { checkUserEmploymentInOrganizations } = require('@condo/domains/organization/utils/accessSchema')

async function canReadTicketAnalyticsReport ({ authentication: { item: user }, context, args: { data: { where } } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    const organizationId = get(where, ['organization', 'id'], false)
    if (!organizationId) return false

    return await checkUserEmploymentInOrganizations(context, user, organizationId)
}

async function canReadExportTicketAnalyticsToExcel ({ authentication: { item: user }, context, args: { data: { where } } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    const organizationId = get(where, ['organization', 'id'], false)
    if (!organizationId) return false

    return await checkUserEmploymentInOrganizations(context, user, organizationId)
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadTicketAnalyticsReport,
    canReadExportTicketAnalyticsToExcel,
}
