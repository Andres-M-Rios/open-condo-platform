// @ts-nocheck
const { canReadMeterEntity } = require('@condo/domains/meter/utils/accessSchema')
/**
 * Generated by `createschema meter.Meter 'number:Text; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; account?:Relationship:BillingAccount:SET_NULL; property:Relationship:Property:CASCADE; unitName:Text; place?:Text; resource:Relationship:MeterResource:CASCADE;'`
 */
const { Meter } = require('../utils/serverSchema')
const { canManageMeterEntity } = require('@condo/domains/meter/utils/accessSchema')

async function canReadMeters ({ authentication: { item: user } }) {
    return await canReadMeterEntity({ user })
}

async function canManageMeters ({ authentication: { item: user }, originalInput, operation, itemId, context }) {
    return await canManageMeterEntity({
        schema: Meter,
        user,
        itemId,
        operation,
        originalInput,
        context,
    })
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadMeters,
    canManageMeters,
}
