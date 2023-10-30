/**
 * Generated by `createschema meter.MeterResourceOwner 'organization:Relationship:Organization:CASCADE; resource:Relationship:MeterResource:CASCADE;'`
 */
const { omit } = require('lodash')

const userAccess = require('@open-condo/keystone/access')
const { GQLError, GQLErrorCode: { FORBIDDEN } } = require('@open-condo/keystone/errors')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { addressService } = require('@open-condo/keystone/plugins/addressService')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const { OPERATION_FORBIDDEN } = require('@condo/domains/common/constants/errors')
const access = require('@condo/domains/meter/access/MeterResourceOwner')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')

const ERRORS = {
    OPERATION_FORBIDDEN: {
        code: FORBIDDEN,
        type: OPERATION_FORBIDDEN,
        variable: ['data', 'address'],
        message: 'Fields related to the address are not allowed to be updated',
    },
}


const MeterResourceOwner = new GQLListSchema('MeterResourceOwner', {
    schemaDoc: 'Determines whether the meter belongs to the organization for a specific apartment',
    fields: {
        organization: {
            ...ORGANIZATION_OWNED_FIELD,
            access: {
                create: true,
                read: true,
                update: userAccess.userIsAdminOrIsSupport,
            },
        },
        resource: {
            schemaDoc: 'Meter resource that organization is owned by',
            type: 'Relationship',
            ref: 'MeterResource',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
            access: {
                create: true,
                read: true,
                update: false,
            },
        },
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['organization', 'resource', 'addressKey'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'meterResourceOwner_unique_organization_resource_addressKey',
            },
        ],
    },
    plugins: [
        uuided(),
        addressService({
            resolveAddressFields: ({ addressFields, operation }) => {
                return operation === 'update'
                    ? omit(addressFields, ['address', 'addressMeta'])
                    : addressFields
            },
        }),
        versioned(),
        tracked(),
        softDeleted(),
        dvAndSender(),
        historical(),
    ],
    hooks: {
        validateInput: async ({ resolvedData, operation, context }) => {
            const { address, addressMeta } = resolvedData
            if (operation === 'update' && (address || addressMeta)) {
                throw new GQLError(ERRORS.OPERATION_FORBIDDEN, context)
            }
        },
    },
    access: {
        read: access.canReadMeterResourceOwners,
        create: access.canManageMeterResourceOwners,
        update: access.canManageMeterResourceOwners,
        delete: false,
        auth: true,
    },
})

module.exports = {
    MeterResourceOwner,
}
