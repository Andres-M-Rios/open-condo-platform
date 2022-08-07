/**
 * Generated by `createschema meter.Meter 'number:Text; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; account?:Relationship:BillingAccount:SET_NULL; property:Relationship:Property:CASCADE; unitName:Text; place?:Text; resource:Relationship:MeterResource:CASCADE;'`
 */

const { getAvailableResidentMeters } = require('../utils/serverSchema')
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { checkPermissionInUserOrganizationOrRelatedOrganization } = require('@condo/domains/organization/utils/accessSchema')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { queryOrganizationEmployeeFromRelatedOrganizationFor, queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')
const { get } = require('lodash')
const { getByCondition } = require('@condo/keystone/schema')
const { getUserDivisionsInfo } = require('@condo/domains/division/utils/serverSchema')

async function canReadMeters ({ authentication: { item: user }, context }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    
    if (user.isSupport || user.isAdmin) return {}

    if (user.type === RESIDENT) {
        const availableMeters = await getAvailableResidentMeters(user.id)
        const availableMetersIds = availableMeters.map(meter => meter.id)

        return {
            id_in: availableMetersIds,
            deletedAt: null,
        }
    }

    const userDivisionsInfo = await getUserDivisionsInfo(context, user.id)

    if (userDivisionsInfo) {
        const { organizationsIdsWithEmployeeInDivision, divisionsPropertiesIds } = userDivisionsInfo

        return {
            OR: [
                {
                    AND: [
                        {
                            organization: {
                                id_not_in: organizationsIdsWithEmployeeInDivision,
                                OR: [
                                    queryOrganizationEmployeeFor(user.id),
                                    queryOrganizationEmployeeFromRelatedOrganizationFor(user.id),
                                ],
                            },
                        },
                    ],
                },
                {
                    AND: [
                        {
                            organization: { id_in: organizationsIdsWithEmployeeInDivision },
                            property: { id_in: divisionsPropertiesIds },
                        },
                    ],
                },
            ],
        }

    }

    return {
        organization: {
            OR: [
                queryOrganizationEmployeeFor(user.id),
                queryOrganizationEmployeeFromRelatedOrganizationFor(user.id),
            ],
        },
    }
}

async function canManageMeters ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    if (operation === 'create') {
        const organizationId = get(originalInput, ['organization', 'connect', 'id'])
        if (!organizationId) return false
        const propertyId = get(originalInput, ['property', 'connect', 'id'])
        const property = await getByCondition('Property', {
            id: propertyId,
            deletedAt: null,
        })
        if (!property) return false
        if (organizationId !== get(property, 'organization')) return false

        return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, organizationId, 'canManageMeters')
    }

    if (operation === 'update' && itemId) {
        const meter = await getByCondition('Meter', {
            id: itemId,
            deletedAt: null,
        })
        if (!meter) return false
        // if we pass property then we need check that this Property is in the organization in which the Meter is located
        const meterOrganization = get(meter, 'organization')
        const propertyId = get(originalInput, ['property', 'connect', 'id'])
        if (propertyId) {
            const property = await getByCondition('Property', {
                id: propertyId,
                deletedAt: null,
            })
            if (!property) return false
            if (meterOrganization !== get(property, 'organization')) return false
        }

        return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, meterOrganization, 'canManageMeters')
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadMeters,
    canManageMeters,
}
