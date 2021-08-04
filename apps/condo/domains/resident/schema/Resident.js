/**
 * Generated by `createschema resident.Resident 'user:Relationship:User:CASCADE; organization:Relationship:Organization:PROTECT; property:Relationship:Property:PROTECT; billingAccount?:Relationship:BillingAccount:SET_NULL; unitName:Text;'`
 */

const { Text, Relationship, Virtual } = require('@keystonejs/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/resident/access/Resident')
const { ADDRESS_META_FIELD } = require('@condo/domains/common/schema/fields')
const { Resident: ResidentAPI } = require('../utils/serverSchema')
const { Property } = require('@condo/domains/property/utils/serverSchema')
const { userIsAdmin } = require('@core/keystone/access')
const { getById } = require('@core/keystone/schema')
const { pick } = require('lodash')

const Resident = new GQLListSchema('Resident', {
    schemaDoc: 'Person, that resides in a specified property and unit',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        user: {
            schemaDoc: 'Mobile user account',
            type: Relationship,
            ref: 'User',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        organization: {
            schemaDoc: 'Organization, that provides service to this resident. Can be missing, when a resident has been registered, but there is no Organization, that serves specified address in our system yet',
            type: Relationship,
            ref: 'Organization',
            isRequired: false,
            knexOptions: { isNotNullable: false }, // Relationship only!
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
            access: {
                read: true,
                create: true,
                update: false,
            },
        },
        // The reason for this field is to avoid adding check for resident user into global Organization read access.
        // This field have specific use case for mobile client.
        residentOrganization: {
            schemaDoc: 'Organization data, that is returned for current resident in mobile client',
            type: Virtual,
            extendGraphQLTypes: ['type ResidentOrganization { id: ID!, name: String }'],
            graphQLReturnType: 'ResidentOrganization',
            resolver: async (item) => {
                if (item.organization) {
                    const organization = await getById('Organization', item.organization)
                    return pick(organization, ['id', 'name'])
                } else {
                    return null
                }
            },
            access: true,
        },

        property: {
            schemaDoc: 'Property, in which this person resides. Can be missing, when a resident has been registered, but there is no Property in our system yet',
            type: Relationship,
            ref: 'Property',
            isRequired: false,
            knexOptions: { isNotNullable: false }, // Required relationship only!
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
            hooks: {
                validateInput: async ({ context, resolvedData, existingItem, addFieldValidationError }) => {
                    const newOrExistingPropertyId = resolvedData.property || existingItem.property
                    if (!newOrExistingPropertyId) return
                    const [property] = await Property.getAll(context, { id: newOrExistingPropertyId })
                    const newOrExistingAddress = resolvedData.address || existingItem.address
                    if (property.address !== newOrExistingAddress) {
                        return addFieldValidationError('Cannot connect property, because its address differs from address of resident')
                    }
                },
            },
        },

        // The reason for this field is to avoid adding check for resident user into global Property read access.
        // This field have specific use case for mobile client.
        residentProperty: {
            schemaDoc: 'Property data, that is returned for current resident in mobile client',
            type: Virtual,
            extendGraphQLTypes: ['type ResidentProperty { id: ID!, name: String, address: String! }'],
            graphQLReturnType: 'ResidentProperty',
            resolver: async (item) => {
                if (item.property) {
                    const property = await getById('Property', item.property)
                    return pick(property, ['id', 'name', 'address'])
                } else {
                    return null
                }
            },
            access: true,
        },

        address: {
            schemaDoc: 'Normalized address',
            type: Text,
            isRequired: true,
        },

        addressMeta: ADDRESS_META_FIELD,

        unitName: {
            schemaDoc: 'Unit of the property, in which this person resides',
            type: Text,
            isRequired: true,
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    hooks: {
        validateInput: async ({ resolvedData, operation, existingItem, addValidationError, context }) => {
            const { property, address, addressMeta, unitName, user: userId } = resolvedData
            if (operation === 'create') {
                const [resident] = await ResidentAPI.getAll(context, {
                    property: { id: property },
                    unitName,
                    user: { id: userId },
                })
                if (resident) {
                    return addValidationError('Cannot create resident, because another resident with the same provided "property", "unitName" fields already exists for current user')
                }
            } else if (operation === 'update') {
                if (property || address || addressMeta || unitName) {
                    return addValidationError('Changing of address, addressMeta, unitName or property is not allowed for already existing Resident')
                }
            }
        },
    },
    access: {
        read: access.canReadResidents,
        create: access.canManageResidents,
        update: access.canManageResidents,
        delete: false,
        auth: true,
    },
})

module.exports = {
    Resident,
}