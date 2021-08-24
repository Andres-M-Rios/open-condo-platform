/**
 * Generated by `createschema meter.MeterResource 'name:Text;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')

const gql = require('graphql-tag')

const COMMON_FIELDS = 'id dv sender v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const METER_RESOURCE_FIELDS = `{ name ${COMMON_FIELDS} }`
const MeterResource = generateGqlQueries('MeterResource', METER_RESOURCE_FIELDS)

const METER_FIELDS = `{ number billingAccountMeter { id } account { id } property { id } unitName place resource { id } ${COMMON_FIELDS} }`
const Meter = generateGqlQueries('Meter', METER_FIELDS)

const METER_SOURCE_FIELDS = `{ type name ${COMMON_FIELDS} }`
const MeterSource = generateGqlQueries('MeterSource', METER_SOURCE_FIELDS)

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    MeterResource,
    Meter,
    MeterSource,
/* AUTOGENERATE MARKER <EXPORTS> */
}
