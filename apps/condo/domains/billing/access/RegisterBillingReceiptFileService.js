const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { getById } = require('@open-condo/keystone/schema')

const { checkBillingIntegrationsAccessRights } = require('@condo/domains/billing/utils/accessSchema')
const { SERVICE } = require('@condo/domains/user/constants/common')

async function canRegisterBillingReceiptFile ({ authentication: { item: user }, args: { data: { context: { id: contextId } } } } ) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    if (user.type === SERVICE) {
        const context = await getById('BillingIntegrationOrganizationContext', contextId)
        if (!context) {
            return false
        }
        return await checkBillingIntegrationsAccessRights(user.id, [context.integration])
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canRegisterBillingReceiptFile,
}