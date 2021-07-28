const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')

async function canReadTicketReportWidgetData ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin) return true

    return { organization: queryOrganizationEmployeeFor(user.id) }
}

module.exports = {
    canReadTicketReportWidgetData,
}
