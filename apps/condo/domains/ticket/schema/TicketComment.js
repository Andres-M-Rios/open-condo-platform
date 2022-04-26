/**
 * Generated by `createschema ticket.TicketComment 'ticket:Relationship:Ticket:CASCADE; user:Relationship:User:CASCADE; content:Text;'`
 */
const isNull = require('lodash/isNull')
const get = require('lodash/get')

const { Text, Relationship, Select } = require('@keystonejs/fields')
const { GQLListSchema, find } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')

const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/ticket/access/TicketComment')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { COMMENT_TYPES, RESIDENT_COMMENT_TYPE, ORGANIZATION_COMMENT_TYPE } = require('@condo/domains/ticket/constants')

const { Ticket, UserTicketCommentRead } = require('../utils/serverSchema')
const { sendDifferentKindsOfNotifications } = require('@condo/domains/ticket/utils/handlers')

const TicketComment = new GQLListSchema('TicketComment', {
    schemaDoc: 'Textual comment for tickets',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        type: {
            schemaDoc: 'Comment type (internal for an organization or with a resident)',
            isRequired: true,
            type: Select,
            dataType: 'string',
            options: COMMENT_TYPES,
            hooks: {
                resolveInput: ({ resolvedData, context, fieldPath, operation }) => {
                    const user = get(context, ['req', 'user'])
                    const userType = get(user, 'type')

                    if (userType !== RESIDENT && operation === 'create') {
                        const commentType = get(resolvedData, 'type', null)

                        if (isNull(commentType)) {
                            resolvedData[fieldPath] = ORGANIZATION_COMMENT_TYPE
                        }
                    }

                    return resolvedData[fieldPath]
                },
            },
        },

        ticket: {
            schemaDoc: 'Related ticket of the comment',
            type: Relationship,
            ref: 'Ticket',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        // This field will take part in business logic and should be declared here explicitly.
        // That's why `createdBy` field, generated by `tracked` plugin, is not used for association of a comment with ticket.
        user: {
            schemaDoc: 'User, who created the comment',
            type: Relationship,
            ref: 'User',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
            access: {
                read: access.canReadUserField,
                update: access.canSetUserField,
                create: access.canSetUserField,
            },
        },

        content: {
            schemaDoc: 'Plain text content',
            type: Text,
        },
    },
    hooks: {
        resolveInput: async ({ operation, listKey, context, resolvedData, existingItem }) => {
            const user = get(context, ['req', 'user'])
            const userType = get(user, 'type')
            const commentType = get(resolvedData, 'type')

            if (operation === 'create' && commentType === RESIDENT_COMMENT_TYPE) {
                const ticketId = get(resolvedData, 'ticket')
                const dv = get(resolvedData, 'dv')
                const sender = get(resolvedData, 'sender')
                const now = new Date().toISOString()

                if (userType === RESIDENT) {
                    await Ticket.update(context, ticketId, {
                        dv,
                        sender,
                        lastResidentCommentAt: now,
                    })
                } else {
                    await Ticket.update(context, ticketId, {
                        dv,
                        sender,
                        lastAnsweredToResidentAt: now,
                    })

                    const userTicketCommentReadObjects = await find('UserTicketCommentRead', {
                        ticket: { id: ticketId },
                    })

                    for (const { id } of userTicketCommentReadObjects) {
                        await UserTicketCommentRead.update(context, id, {
                            dv: 1,
                            sender,
                            readResidentCommentAt: now,
                        })
                    }
                }
            }

            return resolvedData
        },
        afterChange: async (requestData) => {
            // NOTE: disabled at 2022-04-25 because of @MikhailRumanovskii request until ticket comments will be implemented in all mobile applications for all platforms
            // await sendTicketCommentNotifications(requestData)
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    access: {
        read: access.canReadTicketComments,
        create: access.canManageTicketComments,
        update: access.canManageTicketComments,
        delete: false,
        auth: true,
    },
})

module.exports = {
    TicketComment,
}
