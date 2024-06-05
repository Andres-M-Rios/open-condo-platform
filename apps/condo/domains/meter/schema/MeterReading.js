/**
 * Generated by `createschema meter.MeterReading 'number:Integer; date:DateTimeUtc; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; meter:Relationship:Meter:CASCADE; property:Relationship:Property:CASCADE; organization:Relationship:Organization:CASCADE; value:Integer; sectionName?:Text; floorName?:Text; unitName?:Text; client?:Relationship:User:SET_NULL; clientName?:Text; clientEmail?:Text; clientPhone?:Text; contact?:Relationship:Contact:SET_NULL; source:Relationship:MeterSource:PROTECT'`
 */

const get = require('lodash/get')
const isEmpty = require('lodash/isEmpty')

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const { CONTACT_FIELD, CLIENT_EMAIL_FIELD, CLIENT_NAME_FIELD, CLIENT_PHONE_LANDLINE_FIELD, CLIENT_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/meter/access/MeterReading')
const { Meter } = require('@condo/domains/meter/utils/serverSchema')
const { connectContactToMeterReading } = require('@condo/domains/meter/utils/serverSchema/resolveHelpers')
const { addClientInfoToResidentMeterReading } = require('@condo/domains/meter/utils/serverSchema/resolveHelpers')
const { addOrganizationFieldPlugin } = require('@condo/domains/organization/schema/plugins/addOrganizationFieldPlugin')
const { RESIDENT } = require('@condo/domains/user/constants/common')


const MeterReading = new GQLListSchema('MeterReading', {
    schemaDoc: 'Meter reading taken from a client or billing',
    fields: {
        date: {
            schemaDoc: 'Date when the readings were taken',
            type: 'DateTimeUtc',
        },

        meter: {
            schemaDoc: 'Meter from which readings were taken',
            type: 'Relationship',
            ref: 'Meter',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        value1: {
            schemaDoc: 'If the meter is single-tariff, then only this value will be filled in;' +
                'If multi-tariff, then the value of the first tariff will be in this field',
            type: 'Decimal',
        },

        value2: {
            schemaDoc: 'If the meter is multi-tariff, then the value of the second tariff is stored here',
            type: 'Decimal',
        },

        value3: {
            schemaDoc: 'If the meter is multi-tariff, then the value of the third tariff is stored here',
            type: 'Decimal',
        },

        value4: {
            schemaDoc: 'If the meter is multi-tariff, then the value of the fourth tariff is stored here',
            type: 'Decimal',
        },

        client: CLIENT_FIELD,
        contact: CONTACT_FIELD,
        clientName: CLIENT_NAME_FIELD,
        clientEmail: CLIENT_EMAIL_FIELD,
        clientPhone: CLIENT_PHONE_LANDLINE_FIELD,

        source: {
            schemaDoc: 'Meter reading source channel/system. Examples: call, mobile_app, billing, ...',
            type: 'Relationship',
            ref: 'MeterReadingSource',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
        },

    },
    hooks: {
        resolveInput: async ({ operation, context, resolvedData, existingItem }) => {
            const user = get(context, ['req', 'user'])

            if (operation === 'create' && isEmpty(resolvedData['date'])) {
                resolvedData['date'] = new Date().toISOString()
            }

            if (operation === 'create' && user.type === RESIDENT) {
                addClientInfoToResidentMeterReading(context, resolvedData)
            }

            const meter = await Meter.getOne(context, {
                id: get(resolvedData, 'meter', null),
            })
            if (meter && resolvedData.clientName && resolvedData.clientPhone) {
                const contactCreationData = {
                    ...resolvedData,
                    organization: get(meter, ['organization', 'id']),
                    property: get(meter, ['property', 'id']),
                    unitName: get(meter, 'unitName'),
                    unitType: get(meter, 'unitType'),
                }

                resolvedData.contact = await connectContactToMeterReading(context, contactCreationData, existingItem)
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
