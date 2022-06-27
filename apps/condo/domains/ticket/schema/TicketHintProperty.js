/**
 * Generated by `createschema ticket.TicketHintProperty 'organization:Relationship:Organization:CASCADE;ticketHint:Relationship:TicketHint:CASCADE; property:Relationship:Property:SET_NULL;'`
 */

const { Relationship } = require('@keystonejs/fields')

const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')

const { dvAndSender } = require('@condo/domains/common/schema/plugins/dvAndSender')
const access = require('@condo/domains/ticket/access/TicketHintProperty')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')

const TicketHintProperty = new GQLListSchema('TicketHintProperty', {
    schemaDoc: 'Sets to which property the ticketHint belongs',
    fields: {

        organization: ORGANIZATION_OWNED_FIELD,

        ticketHint: {
            schemaDoc: 'TicketHint which belongs to property',
            type: Relationship,
            ref: 'TicketPropertyHint',
            isRequired: true,
            knexOptions: { isNotNullable: true },
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        property: {
            schemaDoc: 'Property for which ticketHint exists',
            type: Relationship,
            ref: 'Property',
            isRequired: true,
            knexOptions: { isNotNullable: false },
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
        },

    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['ticketHint', 'property'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'unique_ticketHint_and_property',
            },
        ],
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadTicketHintProperties,
        create: access.canManageTicketHintProperties,
        update: access.canManageTicketHintProperties,
        delete: false,
        auth: true,
    },
})

module.exports = {
    TicketHintProperty,
}
