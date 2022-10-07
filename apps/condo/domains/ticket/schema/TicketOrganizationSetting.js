/**
 * Generated by `createschema ticket.TicketOrganizationSetting 'organization:Relationship:Organization:CASCADE; defaultDeadline?:Integer; paidDeadline?:Integer; emergencyDeadline?:Integer; warrantyDeadline?:Integer;'`
 */

const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
const { get, isNull } = require('lodash')

const { GQLListSchema } = require('@condo/keystone/schema')
const { DateInterval } = require('@condo/keystone/fields')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@condo/keystone/plugins')
const access = require('@condo/domains/ticket/access/TicketOrganizationSetting')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')
const { MAX_TICKET_DEADLINE_DURATION, MIN_TICKET_DEADLINE_DURATION, DEFAULT_TICKET_DEADLINE_DURATION } = require('@condo/domains/ticket/constants/common')
const { WRONG_VALUE } = require('@condo/domains/common/constants/errors')

dayjs.extend(duration)


const MIN_DURATION_AS_MILLISECONDS = dayjs.duration(MIN_TICKET_DEADLINE_DURATION).asMilliseconds()
const MAX_DURATION_AS_MILLISECONDS = dayjs.duration(MAX_TICKET_DEADLINE_DURATION).asMilliseconds()

const TicketOrganizationSetting = new GQLListSchema('TicketOrganizationSetting', {
    schemaDoc: 'Ticket settings rules for each organization. (Setting the "deadline" fields for each ticket type)',
    fields: {
        organization: ORGANIZATION_OWNED_FIELD,
        defaultDeadlineDuration: {
            schemaDoc: 'Default deadline duration for default tickets (ISO 8601 format)',
            type: DateInterval,
            defaultValue: DEFAULT_TICKET_DEADLINE_DURATION,
            kmigratorOptions: { null: true },
            hooks: {
                validateInput: async ({ existingItem, resolvedData, addFieldValidationError, fieldPath }) => {
                    const newItem = { ...existingItem, ...resolvedData }
                    const duration = get(newItem, fieldPath, null)

                    if (!isNull(duration)) {
                        const durationAsMilliseconds = dayjs.duration(duration).asMilliseconds()
                        if (durationAsMilliseconds < MIN_DURATION_AS_MILLISECONDS || durationAsMilliseconds > MAX_DURATION_AS_MILLISECONDS) {
                            return addFieldValidationError(`${WRONG_VALUE} the value of the "${fieldPath}" field must be between values from ${MIN_TICKET_DEADLINE_DURATION} to ${MAX_TICKET_DEADLINE_DURATION} inclusive`)
                        }
                    }
                },
            },
        },
        paidDeadlineDuration: {
            schemaDoc: 'Default deadline duration for paid tickets (ISO 8601 format)',
            type: DateInterval,
            defaultValue: DEFAULT_TICKET_DEADLINE_DURATION,
            kmigratorOptions: { null: true },
            hooks: {
                validateInput: async ({ existingItem, resolvedData, addFieldValidationError, fieldPath }) => {
                    const newItem = { ...existingItem, ...resolvedData }
                    const duration = get(newItem, fieldPath, null)

                    if (!isNull(duration)) {
                        const durationAsMilliseconds = dayjs.duration(duration).asMilliseconds()
                        if (durationAsMilliseconds < MIN_DURATION_AS_MILLISECONDS || durationAsMilliseconds > MAX_DURATION_AS_MILLISECONDS) {
                            return addFieldValidationError(`${WRONG_VALUE} the value of the "${fieldPath}" field must be between values from ${MIN_TICKET_DEADLINE_DURATION} to ${MAX_TICKET_DEADLINE_DURATION} inclusive`)
                        }
                    }
                },
            },
        },
        emergencyDeadlineDuration: {
            schemaDoc: 'Default deadline duration for emergency tickets (ISO 8601 format)',
            type: DateInterval,
            defaultValue: DEFAULT_TICKET_DEADLINE_DURATION,
            kmigratorOptions: { null: true },
            hooks: {
                validateInput: async ({ existingItem, resolvedData, addFieldValidationError, fieldPath }) => {
                    const newItem = { ...existingItem, ...resolvedData }
                    const duration = get(newItem, fieldPath, null)

                    if (!isNull(duration)) {
                        const durationAsMilliseconds = dayjs.duration(duration).asMilliseconds()
                        if (durationAsMilliseconds < MIN_DURATION_AS_MILLISECONDS || durationAsMilliseconds > MAX_DURATION_AS_MILLISECONDS) {
                            return addFieldValidationError(`${WRONG_VALUE} the value of the "${fieldPath}" field must be between values from ${MIN_TICKET_DEADLINE_DURATION} to ${MAX_TICKET_DEADLINE_DURATION} inclusive`)
                        }
                    }
                },
            },
        },
        warrantyDeadlineDuration: {
            schemaDoc: 'Default deadline duration for warranty tickets (ISO 8601 format)',
            type: DateInterval,
            defaultValue: DEFAULT_TICKET_DEADLINE_DURATION,
            kmigratorOptions: { null: true },
            hooks: {
                validateInput: async ({ existingItem, resolvedData, addFieldValidationError, fieldPath }) => {
                    const newItem = { ...existingItem, ...resolvedData }
                    const duration = get(newItem, fieldPath, null)

                    if (!isNull(duration)) {
                        const durationAsMilliseconds = dayjs.duration(duration).asMilliseconds()
                        if (durationAsMilliseconds < MIN_DURATION_AS_MILLISECONDS || durationAsMilliseconds > MAX_DURATION_AS_MILLISECONDS) {
                            return addFieldValidationError(`${WRONG_VALUE} the value of the "${fieldPath}" field must be between values from ${MIN_TICKET_DEADLINE_DURATION} to ${MAX_TICKET_DEADLINE_DURATION} inclusive`)
                        }
                    }
                },
            },
        },
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['organization'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'TicketOrganizationSetting_unique_organization',
            },
        ],
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadTicketOrganizationSettings,
        create: access.canManageTicketOrganizationSettings,
        update: access.canManageTicketOrganizationSettings,
        delete: false,
        auth: true,
    },
})

module.exports = {
    TicketOrganizationSetting,
}
