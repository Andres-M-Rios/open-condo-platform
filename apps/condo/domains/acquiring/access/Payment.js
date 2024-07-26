/**
 * Generated by `createschema acquiring.Payment 'amount:Decimal; currencyCode:Text; time:DateTimeUtc; accountNumber:Text; purpose?:Text; receipts:Relationship:BillingReceipt:PROTECT; multiPayment:Relationship:MultiPayment:PROTECT; context:Relationship:AcquiringIntegrationContext:PROTECT;' --force`
 */
const get = require('lodash/get')

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { find } = require('@open-condo/keystone/schema')

const { checkPermissionsInEmployedOrganizations } = require('@condo/domains/organization/utils/accessSchema')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { canDirectlyReadSchemaObjects } = require('@condo/domains/user/utils/directAccess')

const { checkAcquiringIntegrationAccessRight } = require('../utils/accessSchema')

async function canReadPayments ({ authentication: { item: user }, listKey }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.isSupport || user.isAdmin) return {}

    const hasDirectAccess = await canDirectlyReadSchemaObjects(user, listKey)
    if (hasDirectAccess) return {}

    if (user.type === RESIDENT) {
        return { multiPayment: { user: { id: user.id } } }
    }

    return {
        OR: [
            // Acquiring integration account can see it's payments
            { context: { integration: { accessRights_some: { user: { id: user.id }, deletedAt: null } } } },
            // Employee with `canReadPayments` can see theirs organization payments
            {
                AND: [
                    {
                        invoice_is_null: true,
                        organization: { employees_some: { user: { id: user.id }, role: { canReadPayments: true }, deletedAt: null, isBlocked: false } },
                    },
                ],
            },
            // Employee with `canReadPaymentsWithInvoices` can see theirs organization payments with invoices
            {
                AND: [
                    {
                        invoice_is_null: false,
                        organization: { employees_some: { user: { id: user.id }, role: { canReadPaymentsWithInvoices: true }, deletedAt: null, isBlocked: false } },
                    },
                ],
            },
        ],
    }
}

async function canManagePayments ({ authentication: { item: user }, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.isAdmin) return true
    // Nobody can create Payments manually
    if (operation === 'create') return false
    // Acquiring integration can update it's own Payments
    if (operation === 'update' && itemId) {
        return { context: { integration: { accessRights_some: { user: { id: user.id }, deletedAt: null } } } }
    }
    return false
}

async function canReadPaymentsSensitiveData ({ authentication: { item: user }, existingItem, context, listKey }) {
    if (!user || user.deletedAt) return false
    if (user.isSupport || user.isAdmin) return true

    const hasDirectAccess = await canDirectlyReadSchemaObjects(user, listKey)
    if (hasDirectAccess) return true

    const [acquiringContext] = await find('AcquiringIntegrationContext', {
        deletedAt: null,
        id: existingItem.context,
    })
    // If context exist => check is it's integration account
    if (acquiringContext) {
        const integrationId = get(acquiringContext, ['integration'])
        if (await checkAcquiringIntegrationAccessRight(user.id, integrationId)) return true
    }

    // Otherwise check if it's employee or not
    const canReadPayments = !!(await checkPermissionsInEmployedOrganizations(context, user, existingItem.organization, 'canReadPayments'))
    if (canReadPayments) {
        return true
    }

    const canReadPaymentsWithInvoices = !!(await checkPermissionsInEmployedOrganizations(context, user, existingItem.organization, 'canReadPaymentsWithInvoices'))
    if (canReadPaymentsWithInvoices) {
        return true
    }
}


/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadPayments,
    canManagePayments,
    canReadPaymentsSensitiveData,
}
