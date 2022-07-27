/**
 * Generated by `createschema meter.MeterReading 'number:Integer; date:DateTimeUtc; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; meter:Relationship:Meter:CASCADE; property:Relationship:Property:CASCADE; organization:Relationship:Organization:CASCADE; value:Integer; sectionName?:Text; floorName?:Text; unitName?:Text; client?:Relationship:User:SET_NULL; clientName?:Text; clientEmail?:Text; clientPhone?:Text; contact?:Relationship:Contact:SET_NULL; source:Relationship:MeterSource:PROTECT'`
 */

const { Relationship, DateTimeUtc, Decimal } = require('@keystonejs/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { CONTACT_FIELD, CLIENT_EMAIL_FIELD, CLIENT_NAME_FIELD, CLIENT_PHONE_FIELD, CLIENT_FIELD } = require('@condo/domains/common/schema/fields')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')
const { CONTACT_FIELD, CLIENT_EMAIL_FIELD, CLIENT_NAME_FIELD, CLIENT_PHONE_FIELD, CLIENT_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/meter/access/MeterReading')
const get = require('lodash/get')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { addClientInfoToResidentMeterReading } = require('../utils/serverSchema/resolveHelpers')
const { dvAndSender } = require('@condo/domains/common/schema/plugins/dvAndSender')
const { addOrganizationFieldPlugin } = require('@condo/domains/organization/schema/plugins/addOrganizationFieldPlugin')

const MeterReading = new GQLListSchema('MeterReading', {
    schemaDoc: 'Meter reading taken from a client or billing',
    fields: {

        date: {
            schemaDoc: 'Date when the readings were taken',
            type: DateTimeUtc,
            isRequired: true,
        },

        meter: {
            schemaDoc: 'Meter from which readings were taken',
            type: Relationship,
            ref: 'Meter',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        value1: {
            schemaDoc: 'If the meter is single-tariff, then only this value will be filled in;' +
                'If multi-tariff, then the value of the first tariff will be in this field',
            type: Decimal,
        },

        value2: {
            schemaDoc: 'If the meter is multi-tariff, then the value of the second tariff is stored here',
            type: Decimal,
        },

        value3: {
            schemaDoc: 'If the meter is multi-tariff, then the value of the third tariff is stored here',
            type: Decimal,
        },

        value4: {
            schemaDoc: 'If the meter is multi-tariff, then the value of the fourth tariff is stored here',
            type: Decimal,
        },

        client: CLIENT_FIELD,
        contact: CONTACT_FIELD,
        clientName: CLIENT_NAME_FIELD,
        clientEmail:  CLIENT_EMAIL_FIELD,
        clientPhone: CLIENT_PHONE_FIELD,

        source: {
            schemaDoc: 'Meter reading source channel/system. Examples: call, mobile_app, billing, ...',
            type: Relationship,
            ref: 'MeterReadingSource',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
        },

    },
    hooks: {
        resolveInput: async ({ operation, listKey, context, resolvedData, existingItem }) => {
            const user = get(context, ['req', 'user'])

            if (operation === 'create' && user.type === RESIDENT) {
                await addClientInfoToResidentMeterReading(context, resolvedData)
            }

            return resolvedData
        },
    },
    plugins: [
        addOrganizationFieldPlugin({ fromField: 'meter', isRequired: true }),
        uuided(),
        versioned(),
        tracked(),
        softDeleted(),
        dvAndSender(),
        historical(),
    ],
    access: {
        read: access.canReadMeterReadings,
        create: access.canManageMeterReadings,
        update: access.canManageMeterReadings,
        delete: false,
        auth: true,
    },
})

module.exports = {
    MeterReading,
}
