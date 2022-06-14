/**
 * Generated by `createschema miniapp.B2CAppProperty 'app:Relationship:B2CApp:PROTECT; address:Text;' --force`
 */

const dayjs = require('dayjs')
const get = require('lodash/get')
const { Text, Relationship } = require('@keystonejs/fields')
const { GQLListSchema, getById } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { dvAndSender } = require('@condo/domains/common/schema/plugins/dvAndSender')
const access = require('@condo/domains/miniapp/access/B2CAppProperty')
const { getAddressSuggestions } = require('@condo/domains/common/utils/serverSideAddressApi')
const { VALID_HOUSE_TYPES } = require('@condo/domains/property/constants/common')
const {
    NO_APP_ERROR,
    RESTRICT_PROPERTY_APP_CHANGE_ERROR,
    INCORRECT_ADDRESS_ERROR,
    INCORRECT_HOUSE_TYPE_ERROR,
} = require('@condo/domains/miniapp/constants')


const B2CAppProperty = new GQLListSchema('B2CAppProperty', {
    schemaDoc: 'Link between specific home address and B2C App. used to filter B2C applications that can be run on a specific address',
    labelResolver: async (item) => {
        const app = await getById('B2CApp', item.app)
        const appName = get(app, 'name', 'deleted')
        const appDeveloper = get(app, 'developer', 'deleted')
        return `${appDeveloper}-${appName}-${item.address}`
    },
    fields: {
        app: {
            schemaDoc: 'Link to B2C App',
            type: Relationship,
            ref: 'B2CApp.properties',
            isRequired: false,
            kmigratorOptions: { null: true, on_delete: 'models.PROTECT' },
            access: {
                update: access.canUpdateAppLink,
            },
            hooks: {
                validateInput: async ({ operation, resolvedData, addFieldValidationError }) => {
                    if (operation === 'update') {
                        if (resolvedData.hasOwnProperty('app') && resolvedData.app !== null) {
                            return addFieldValidationError(RESTRICT_PROPERTY_APP_CHANGE_ERROR)
                        }
                    }
                },
            },
        },
        address: {
            schemaDoc: 'Property address. Must match the address lookup service with case accuracy',
            type: Text,
            isRequired: true,
            hooks: {
                resolveInput: ({ resolvedData, fieldPath }) => {
                    if (typeof resolvedData[fieldPath] === 'string') {
                        resolvedData[fieldPath] = resolvedData[fieldPath].toLowerCase()
                    }
                    return resolvedData[fieldPath]
                },
                validateInput: async ({ resolvedData, fieldPath, addFieldValidationError }) => {
                    const inputAddress = resolvedData[fieldPath]
                    if (!inputAddress) {
                        return addFieldValidationError(INCORRECT_ADDRESS_ERROR)
                    }
                    // TODO(DOMA-3250) Fix this mess after migration to new address-suggestion service
                    const suggestions = await getAddressSuggestions(inputAddress, 1)
                    const suggestionAddress = get(suggestions, ['0', 'value'], '')
                    const suggestionHouseType = get(suggestions, ['0', 'data', 'house_type_full'])
                    if (!VALID_HOUSE_TYPES.includes(suggestionHouseType)) {
                        return addFieldValidationError(`${INCORRECT_HOUSE_TYPE_ERROR}. Valid values are: [${VALID_HOUSE_TYPES.join(', ')}]`)
                    }
                    if (suggestionAddress.toLowerCase() !== inputAddress.toLowerCase()) {
                        return addFieldValidationError(INCORRECT_ADDRESS_ERROR)
                    }
                },
            },
        },
    },
    hooks: {
        resolveInput: async ({ resolvedData }) => {
            if (resolvedData && resolvedData.hasOwnProperty('app') && resolvedData['app'] === null) {
                resolvedData['deletedAt'] = dayjs().toISOString()
            }
            return resolvedData
        },
        validateInput: async ({ operation, addValidationError, resolvedData }) => {
            if (operation === 'create' && !resolvedData['app']) {
                return addValidationError(NO_APP_ERROR)
            }
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadB2CAppProperties,
        create: access.canManageB2CAppProperties,
        update: access.canManageB2CAppProperties,
        delete: false,
        auth: true,
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['address', 'app'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'b2c_app_property_unique_address',
            },
        ],
    },
})

module.exports = {
    B2CAppProperty,
}
