/**
 * Generated by `createschema billing.BillingReceipt 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; importId?:Text; property:Relationship:BillingProperty:CASCADE; account:Relationship:BillingAccount:CASCADE; period:CalendarDay; raw:Json; toPay:Text; services:Json; meta:Json'`
 */

const { Text, Relationship, Virtual } = require('@keystonejs/fields')
const { Big } = require('big.js')
const { get } = require('lodash')

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema, getById } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/billing/access/BillingReceipt')
const { WRONG_TEXT_FORMAT, UNEQUAL_CONTEXT_ERROR } = require('@condo/domains/common/constants/errors')
const { MONEY_AMOUNT_FIELD } = require('@condo/domains/common/schema/fields')

const { RECIPIENT_FIELD } = require('./fields/BillingReceipt/Recipient')
const { SERVICES_FIELD } = require('./fields/BillingReceipt/Services')
const { TO_PAY_DETAILS_FIELD } = require('./fields/BillingReceipt/ToPayDetailsField')
const { RAW_DATA_FIELD, PERIOD_FIELD } = require('./fields/common')
const { INTEGRATION_CONTEXT_FIELD, BILLING_PROPERTY_FIELD, BILLING_ACCOUNT_FIELD } = require('./fields/relations')

const { BillingRecipient } = require('../utils/serverSchema')


const DEFAULT_CATEGORY = '928c97ef-5289-4daa-b80e-4b9fed50c629'


const BillingReceipt = new GQLListSchema('BillingReceipt', {
    schemaDoc: 'Account monthly invoice document',
    fields: {
        context: {
            ...INTEGRATION_CONTEXT_FIELD,
            access: { ...INTEGRATION_CONTEXT_FIELD.access, read: access.canReadSensitiveBillingReceiptData },
        },
        property: {
            ...BILLING_PROPERTY_FIELD,
            access: { read: access.canReadSensitiveBillingReceiptData },
        },
        account: {
            ...BILLING_ACCOUNT_FIELD,
            access: { read: access.canReadSensitiveBillingReceiptData },
        },

        period: PERIOD_FIELD,

        // Refs migration: 20210823172647-0047_auto_20210823_1226.js
        importId: {
            schemaDoc: '`billing receipt` local object ID. Unique up to billing context. It is unique up to the context. ' +
                'The constrain is a combination of contextId and importId.',
            type: Text,
            isRequired: true,
            kmigratorOptions: { unique: true, null: false },
            hooks: {
                validateInput: async ({ resolvedData, addFieldValidationError }) => {
                    const resolvedImportId = get(resolvedData, ['importId'])

                    if (!resolvedImportId || typeof resolvedImportId !== 'string' || resolvedImportId.length === 0) {
                        addFieldValidationError(
                            `${WRONG_TEXT_FORMAT}importId] Cannot mutate billing receipt with empty or null importId, found ${resolvedImportId}`)
                    }
                },
            },
            access: { read: access.canReadSensitiveBillingReceiptData },
        },

        category: {
            schemaDoc: 'A category to print on display on the payment document.',
            type: Relationship,
            ref: 'BillingCategory',
            isRequired: true,
            knexOptions: { isNotNullable: true },
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
            defaultValue: { connect: { id: DEFAULT_CATEGORY } },
        },

        printableNumber: {
            schemaDoc: 'A number to print on the payment document.',
            type: Text,
            isRequired: false,
        },

        raw: {
            ...RAW_DATA_FIELD,
            access: { read: access.canReadSensitiveBillingReceiptData },
        },

        toPay: {
            ...MONEY_AMOUNT_FIELD,
            schemaDoc: 'Total sum to pay. Usually counts as the sum of all services.',
            isRequired: true,
        },

        toPayDetails: TO_PAY_DETAILS_FIELD,

        services: SERVICES_FIELD,

        // TODO(pahaz): remove this field! we already have `receiver` field! And we can save this date in raw/meta field
        recipient: RECIPIENT_FIELD,

        // TODO @toplenboren (Doma-2241) make this not null!
        receiver: {
            schemaDoc: 'Relation to the BillingRecipient. Going to override recipient field, has the same meaning',
            type: Relationship,
            ref: 'BillingRecipient',
            isRequired: true,
            knexOptions: { isNotNullable: false },
            kmigratorOptions: { null: true, on_delete: 'models.CASCADE' },
        },

        invalidServicesError:  {
            schemaDoc: 'Indicates if services are valid and add up to total sum toPay.',
            type: Virtual,
            isRequired: false,
            resolver: async (receipt) => {
                const toPay = Big(get(receipt, 'toPay'))
                const services = get(receipt, 'services', [])

                const servicesTotal = services
                    ? services.reduce((total, { toPay = 0 }) => Big(total).add(Big(toPay)), Big(0))
                    : Big(0)

                const servicesAreValid = servicesTotal.cmp(toPay) === 0

                if (services && services.length > 0 && !servicesAreValid) return `Services sum (${servicesTotal}) does not add up to the toPay (${toPay}) amount correctly`

                return null
            },
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadBillingReceipts,
        create: access.canManageBillingReceipts,
        update: access.canManageBillingReceipts,
        delete: false,
        auth: true,
    },
    hooks: {
        validateInput: async ({ resolvedData, addValidationError, existingItem }) => {
            const newItem = { ...existingItem, ...resolvedData }
            const { context: contextId, property: propertyId, account: accountId } = newItem
            
            const account = await getById('BillingAccount', accountId)
            const { context: accountContextId } = account
            const property = await getById('BillingProperty', propertyId)
            const { context: propertyContextId } = property
            if (contextId !== accountContextId) {
                return addValidationError(`${UNEQUAL_CONTEXT_ERROR}:account:context] Context is not equal to account.context`)
            }
            if (contextId !== propertyContextId) {
                return addValidationError(`${UNEQUAL_CONTEXT_ERROR}:property:context] Context is not equal to property.context`)
            }

        },
        beforeChange: async ({
            existingItem,
            resolvedData,
            context,
        }) => {
            const { sender: { fingerprint } } = resolvedData

            // Handle cases when we do not need to search for BillingRecipient
            // receiver is explicitly set
            if ('receiver' in resolvedData) {
                return
            }
            // receiver is in existing item and not being updated
            if (existingItem && 'receiver' in existingItem && !('receiver' in resolvedData) && !('recipient' in resolvedData)) {
                return
            }

            const newItem = { ...existingItem, ...resolvedData }
            const contextId = get(newItem, 'context')
            const recipient = get(newItem, 'recipient')
            const billingIntegrationContext = await getById('BillingIntegrationOrganizationContext', contextId)
            const billingIntegration = await getById('BillingIntegration', get(billingIntegrationContext, 'integration'))
            const organization = await getById('Organization', get(billingIntegrationContext, 'organization'))
            const isTrustedBankAccountSource = get(billingIntegration, 'isTrustedBankAccountSource')

            const tinMatches = recipient.tin && recipient.tin === organization.tin

            let receiverId
            const sameRecipient = await BillingRecipient.getOne(context, {
                context: { id: contextId },
                tin: get(recipient, 'tin'),
                bic: get(recipient, 'bic'),
                bankAccount: get(recipient, 'bankAccount'),
                deletedAt: null, // TODO(zuch): DOMA-2395 Move deletedAt filter to getOne
            })
            const { bankName = '', territoryCode = '', offsettingAccount = '' } = recipient
            if (sameRecipient) {
                receiverId = sameRecipient.id
            } else {
                const createdRecipient = await BillingRecipient.create(context, {
                    dv: 1,
                    sender: { dv: 1, fingerprint: fingerprint },
                    context: { connect: { id: contextId } },
                    name: get(recipient, 'name', null),
                    tin: get(recipient, 'tin'),
                    iec: get(recipient, 'iec'),
                    bic: get(recipient, 'bic'),
                    bankAccount: get(recipient, 'bankAccount'),
                    isApproved: isTrustedBankAccountSource && tinMatches,
                    bankName, territoryCode, offsettingAccount,
                })
                receiverId = createdRecipient.id
            }
            resolvedData.receiver = receiverId
        },
    },
})

module.exports = {
    BillingReceipt,
}
