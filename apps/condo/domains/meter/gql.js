/**
 * Generated by `createschema meter.MeterResource 'name:Text;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const METER_RESOURCE_FIELDS = `{ name measure ${COMMON_FIELDS} }`
const MeterResource = generateGqlQueries('MeterResource', METER_RESOURCE_FIELDS)

const METER_READING_SOURCE_FIELDS = `{ type name ${COMMON_FIELDS} }`
const MeterReadingSource = generateGqlQueries('MeterReadingSource', METER_READING_SOURCE_FIELDS)

const METER_FIELDS = `{ number tariffsCount account billingAccountMeter { id } organization { id } property { id } unitName place resource { id } ${COMMON_FIELDS} }`
const Meter = generateGqlQueries('Meter', METER_FIELDS)

const METER_READING_FIELDS = `{ number value1 value2 value3 date account billingAccountMeter { id } meter { id } property { id } organization { id } sectionName floorName unitName client { id } clientName clientEmail clientPhone contact { id } source { id name } ${COMMON_FIELDS} }`
const MeterReading = generateGqlQueries('MeterReading', METER_READING_FIELDS)

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    MeterResource,
    MeterReadingSource,
    Meter,
    MeterReading,
/* AUTOGENERATE MARKER <EXPORTS> */
}

