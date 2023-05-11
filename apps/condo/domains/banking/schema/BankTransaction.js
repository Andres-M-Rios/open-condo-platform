/**
 * Generated by `createschema banking.BankTransaction 'account:Relationship:BankAccount:CASCADE; contractorAccount:Relationship:BankContractorAccount:CASCADE; costItem?:Relationship:BankCostItem:SET_NULL; organization:Relationship:Organization:CASCADE; number:Text; date:CalendarDay; amount:Decimal; purpose:Text; dateWithdrawed:CalendarDay; dateReceived:CalendarDay; meta:Json; importId:Text; importRemoteSystem:Text;'`
 */

const { Text, Relationship, CalendarDay, Checkbox, Select } = require('@keystonejs/fields')
const { get, has } = require('lodash')

const { Json } = require('@open-condo/keystone/fields')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/banking/access/BankTransaction')
const { IMPORT_REMOTE_SYSTEM_VALUES } = require('@condo/domains/banking/constants')
const { BankCostItem } = require('@condo/domains/banking/utils/serverSchema')
const { POSITIVE_MONEY_AMOUNT_FIELD } = require('@condo/domains/common/schema/fields')
const { CURRENCY_CODE_FIELD } = require('@condo/domains/common/schema/fields')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')


const BankTransaction = new GQLListSchema('BankTransaction', {
    schemaDoc: 'Transaction related to costs of Organization with BankAccount. Full fields set from data import will be stored in "meta"',
    fields: {

        account: {
            schemaDoc: 'Related BankAccount of Organization which payed',
            type: Relationship,
            ref: 'BankAccount',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        integrationContext: {
            schemaDoc: 'Data source from which this transaction was created',
            type: Relationship,
            ref: 'BankIntegrationAccountContext',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        contractorAccount: {
            schemaDoc: 'Related account of contractor, which has received the payment via this transaction',
            type: Relationship,
            ref: 'BankContractorAccount',
            kmigratorOptions: { null: true, on_delete: 'models.CASCADE' },
        },

        costItem: {
            schemaDoc: 'Related costs class',
            type: Relationship,
            ref: 'BankCostItem',
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
        },

        organization: ORGANIZATION_OWNED_FIELD,

        number: {
            schemaDoc: 'Number of transaction, obtained from external system',
            type: Text,
            isRequired: true,
        },

        date: {
            schemaDoc: 'When payment order was created',
            type: CalendarDay,
            isRequired: true,
        },

        amount: {
            ...POSITIVE_MONEY_AMOUNT_FIELD,
            schemaDoc: 'Amount of transaction in specified currency. Always positive number. Look at "isOutcome" field to determine whether this transaction commits negative or positive change to balance',
            isRequired: true,
        },

        isOutcome: {
            schemaDoc: 'Indicator of outcome transaction which commits negative change to balance',
            type: Checkbox,
            isRequired: true,
        },

        currencyCode: CURRENCY_CODE_FIELD,

        purpose: {
            schemaDoc: 'Textual description of payment purpose in free form',
            type: Text,
            isRequired: true,
        },

        meta: {
            schemaDoc: 'Stores data, obtained from external source',
            type: Json,
            isRequired: true,
        },

        importId: {
            schemaDoc: 'Identifier of corresponding record in external system, from that this record was copied',
            type: Text,
            isRequired: true,
        },

        importRemoteSystem: {
            schemaDoc: 'Name of external system, from that this record was copied',
            type: Select,
            options: IMPORT_REMOTE_SYSTEM_VALUES,
            // Cannot use `enum` datatype because a number is presented in first character of a value "1CClientBankExchange".
            dataType: 'string',
            isRequired: true,
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadBankTransactions,
        create: access.canManageBankTransactions,
        update: access.canManageBankTransactions,
        delete: false,
        auth: true,
    },
    hooks: {
        validateInput: async ({ resolvedData, addValidationError, context, operation, existingItem }) => {
            const isOutcome = has(resolvedData, 'isOutcome') ? resolvedData.isOutcome : existingItem.isOutcome
            const costItemId = has(resolvedData, 'costItem') ? resolvedData.costItem : get(existingItem, 'costItem', null)
            if (costItemId) {
                const costItem = await BankCostItem.getOne(context, { id: costItemId })
                if (costItem && costItem.isOutcome !== isOutcome) {
                    addValidationError(`Mismatched value of "isOutcome" field of BankTransaction${operation === 'update' ? `(id="${existingItem.id}")` : ''} with BankCostItem(id="${costItemId}") during ${operation} operation`)
                }
            }
        },
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['organization', 'importRemoteSystem', 'importId'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'Bank_transaction_unique_organization_importRemoteSystem_importId',
            },
        ],
    },
})

module.exports = {
    BankTransaction,
}
