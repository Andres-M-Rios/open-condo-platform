// @ts-nocheck
const { canReadMeterEntity } = require('@condo/domains/meter/utils/accessSchema')
const { canManageMeterEntity } = require('@condo/domains/meter/utils/accessSchema')
const { MeterReading } = require('../utils/serverSchema')
const moment = require('moment')
/**
 * Generated by `createschema meter.MeterReading 'organization:Relationship:Organization:CASCADE; property:Relationship:Property:CASCADE; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; date:DateTimeUtc; meter:Relationship:Meter:CASCADE; value:Integer; source:Relationship:MeterReadingSource:PROTECT'`
 */

async function canReadMeterReadings ({ authentication: { item: user } }) {
    return await canReadMeterEntity({ user })
}

async function canManageMeterReadings ({ authentication: { item: user }, originalInput, operation, itemId, context }) {
    return await canManageMeterEntity({
        schema: MeterReading,
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
    canReadMeterReadings,
    canManageMeterReadings,
}
