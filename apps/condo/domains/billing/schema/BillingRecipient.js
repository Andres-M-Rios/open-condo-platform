/**
 * Generated by `createschema billing.BillingRecipient 'organization:Relationship:Organization:CASCADE; tin:Text; iec:Text; bic:Text; context?:Relationship:BillingIntegrationOrganizationContext:SET_NULL; bankAccount:Text; name?:Text; approved:Checkbox; meta?:Json;'`
 */

const { get, isNil } = require('lodash')

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema, find } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/billing/access/BillingRecipient')
const { INTEGRATION_CONTEXT_FIELD } = require('@condo/domains/billing/schema/fields/relations')
const { IMPORT_ID_FIELD } = require('@condo/domains/common/schema/fields')

const BillingRecipient = new GQLListSchema('BillingRecipient', {
    schemaDoc: 'Organization\' billing information: bank account, bic, and so on',
    labelResolver: item => item.tin,
    fields: {
        importId: IMPORT_ID_FIELD,
        context: INTEGRATION_CONTEXT_FIELD,

        tin: {
            schemaDoc: 'Tax Identification Number',
            type: 'Text',
            isRequired: true,
        },

        iec: {
            schemaDoc: 'Importer-Exporter Code',
            type: 'Text',
            isRequired: false,
        },

        bic: {
            schemaDoc: 'Bank Identification Code',
            type: 'Text',
            isRequired: true,
        },

        bankAccount: {
            schemaDoc: 'Number of bank account of this recipient',
            type: 'Text',
            isRequired: true,
        },

        bankName: {
            schemaDoc: 'Bank name',
            type: 'Text',
            isRequired: false,
        },

        offsettingAccount: {
            schemaDoc: 'Bank account',
            type: 'Text',
            isRequired: false,
        },

        territoryCode: {
            schemaDoc: 'Location code (Classifier of Territories of Municipal Units - OKTMO)',
            type: 'Text',
            isRequired: false,
        },

        purpose: {
            schemaDoc: 'For what reason is this recipient is able to collect payments.',
            type: 'Text',
            isRequired: false,
        },

        name: {
            schemaDoc: 'Billing Recipient name. Usually the juristic name of the organization',
            type: 'Text',
            isRequired: false,
        },

        isApproved: {
            schemaDoc: 'If set to True, then this billing recipient info is considered allowed and users are allowed to pay for receipts with this recipient',
            type: 'Virtual',
            isRequired: false,
            graphQLReturnType: 'Boolean',
            resolver: async (recipient) => {
                /**
                 * There are two case how to validate is this recipient approved
                 * 1. Recipient tin equals context organization tin
                 * 2. There are bank account for the same organization && tin && bic && account number
                 */

                // case 1: let's get organization tin in order to compare recipient tin and context org tin
                const [context] = await find('BillingIntegrationOrganizationContext', {
                    id: get(recipient, 'context'),
                    deletedAt: null,
                })

                // case 1.1: no valid context exists - recipient can not be approved
                if (isNil(context)) {
                    return false
                }

                // try to get context org tin and compare
                const [organization] = await find('Organization', {
                    id: get(context, 'organization'),
                    deletedAt: null,
                })

                // case 1.2: no valid organization exists - recipient can not be approved
                // case 1.3: organization exists and has the same tin
                if (isNil(organization)) {
                    return false
                } else if (!isNil(organization) && recipient.tin === organization.tin) {
                    return true
                }

                // case 2: let's try to find related BankAccount
                const [account] = await find('BankAccount', {
                    organization: { id: get(context, 'organization') },
                    routingNumber: get(recipient, 'bic'),
                    number: get(recipient, 'bankAccount'),
                    isApproved: true,
                    deletedAt: null,
                })

                return !isNil(account)
            },
        },

        classificationCode: {
            schemaDoc: 'Budget classification code, used for state-funded organizations',
            type: 'Text',
            isRequired: false,
        },

        meta: {
            schemaDoc: 'Structured metadata obtained from the `billing data source`. The structure depends on the integration system.',
            type: 'Json',
            isRequired: false,
        },
    },

    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadBillingRecipients,
        create: access.canManageBillingRecipients,
        update: access.canManageBillingRecipients,
        delete: false,
        auth: true,
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['context', 'tin', 'iec', 'bic', 'bankAccount'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'billingRecipient_unique_context_tin_iec_bic_bankAccount',
            },
        ],
    },
})

module.exports = {
    BillingRecipient,
}
