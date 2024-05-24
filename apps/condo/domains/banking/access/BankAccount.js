/**
 * Generated by `createschema banking.BankAccount 'organization:Relationship:Organization:CASCADE; tin:Text; country:Text; routingNumber:Text; number:Text; currency:Text; approvedAt?:DateTimeUtc; approvedBy?:Text; importId?:Text; territoryCode?:Text; bankName?:Text; meta?:Json; tinMeta?:Json; routingNumberMeta?:Json'`
 */
const { get, uniq, map } = require('lodash')

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { getById, find } = require('@open-condo/keystone/schema')

const { canManageBankEntityWithOrganization } = require('@condo/domains/banking/utils/accessSchema')
const { checkBankIntegrationsAccessRights } = require('@condo/domains/banking/utils/accessSchema')
const {
    getEmployedOrRelatedOrganizationsByPermissions,
} = require('@condo/domains/organization/utils/accessSchema')
const { SERVICE, RESIDENT, STAFF } = require('@condo/domains/user/constants/common')

const { BANK_INTEGRATION_IDS } = require('../constants')


async function canReadBankAccounts ({ authentication: { item: user }, context }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin || user.isSupport) return {}

    if (user.type === STAFF) {
        const permittedOrganizations = await getEmployedOrRelatedOrganizationsByPermissions(context, user, [])

        return {
            organization: {
                id_in: permittedOrganizations,
            },
        }
    } else if (user.type === SERVICE) {
        return {
            OR: [
                {
                    integrationContext: {
                        deletedAt: null,
                        integration: {
                            deletedAt: null,
                            accessRights_some: {
                                user: { id: user.id },
                                deletedAt: null,
                            },
                        },
                    },
                },
                { integrationContext_is_null: true },
            ],
        }
    } else if (user.type === RESIDENT) {
        const residents = await find('Resident', { user: { id: user.id } })
        if (residents.length > 0) {
            const propertyIds = uniq(map(residents, 'property'))
            return {
                property: {
                    id_in: propertyIds,
                },
            }
        }
        return false
    }

    return false
}

/**
 * BankAccount can be managed only by:
 * 1. Admin or support
 */
async function canManageBankAccounts (args) {
    const { authentication: { item: user }, context, operation, itemId } = args
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin || user.isSupport) return true

    if (user.type === SERVICE) {
        if (await checkBankIntegrationsAccessRights(context, user.id, [BANK_INTEGRATION_IDS.SBBOL])) {

            if (operation === 'create') return true

            if (operation === 'update') {
                const bankAccount = await getById('BankAccount', itemId)
                const integrationContext = get(bankAccount, 'integrationContext')

                if (integrationContext) {
                    const accountContext = await getById('BankIntegrationAccountContext', integrationContext)

                    if (accountContext.integration === BANK_INTEGRATION_IDS.SBBOL) return true

                    return false
                } else {
                    return true
                }
            }
        }
    }

    return canManageBankEntityWithOrganization(args, 'canManageBankAccounts')
}

/**
 * IsApproved can be set to true only by support or admin
 */
async function canManageIsApprovedField ({ authentication: { item: user } }) {
    if (user.isAdmin || user.isSupport) return true

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadBankAccounts,
    canManageBankAccounts,
    canManageIsApprovedField,
}
