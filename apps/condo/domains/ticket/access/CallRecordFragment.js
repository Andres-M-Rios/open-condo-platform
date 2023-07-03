/**
 * Generated by `createschema ticket.CallRecordFragment 'ticket:Relationship:Ticket:CASCADE;callRecord:Relationship:CallRecord:CASCADE;'`
 */

const get = require('lodash/get')

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { getByCondition } = require('@open-condo/keystone/schema')

const { checkPermissionInUserOrganizationOrRelatedOrganization, queryOrganizationEmployeeFor, queryOrganizationEmployeeFromRelatedOrganizationFor } = require('@condo/domains/organization/utils/accessSchema')

async function canReadCallRecordFragments ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return {}

    return {
        organization: {
            OR: [
                queryOrganizationEmployeeFor(user.id),
                queryOrganizationEmployeeFromRelatedOrganizationFor(user.id),
            ],
        },
    }
}

async function canManageCallRecordFragments ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    let organizationId
    if (operation === 'create') {
        const callRecordId = get(originalInput, 'callRecord.connect.id')
        const callRecord = await getByCondition('CallRecord', {
            id: callRecordId,
            deletedAt: null,
        })

        organizationId = get(callRecord, 'organization', null)
    } else if (operation === 'update') {
        if (!itemId) return false
        const callRecordFragment = await getByCondition('CallRecordFragment', {
            id: itemId,
            deletedAt: null,
        })
        
        organizationId = get(callRecordFragment, 'organization', null)
    }

    return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, organizationId, 'canManageCallRecords')
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadCallRecordFragments,
    canManageCallRecordFragments,
}