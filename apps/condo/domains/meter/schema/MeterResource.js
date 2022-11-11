/**
 * Generated by `createschema meter.MeterResource 'name:Text;'`
 */

const { LocalizedText } = require('@open-condo/keystone/fields')
const { GQLListSchema } = require('@open-condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')

const MeterResource = new GQLListSchema('MeterResource', {
    schemaDoc: 'Kind of consumed resource, measured by meter',
    fields: {
        name: {
            type: LocalizedText,
            isRequired: true,
            template: 'meterResource.*.name',
        },

        measure: {
            type: LocalizedText,
            isRequired: true,
            template: 'meterResource.*.measure',
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: true,
        create: false,
        update: false,
        delete: false,
        auth: false,
    },
    escapeSearch: true,
})

module.exports = {
    MeterResource,
}
