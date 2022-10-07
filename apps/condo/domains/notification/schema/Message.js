/**
 * Generated by `createschema notification.Message 'organization?:Relationship:Organization:CASCADE; property?:Relationship:Property:CASCADE; ticket?:Relationship:Ticket:CASCADE; user:Relationship:User:CASCADE; type:Text; meta:Json; channels:Json; status:Select:sending,planned,sent,canceled; deliveredAt:DateTimeUtc;'`
 */

const { GQLListSchema } = require('@condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@condo/keystone/plugins')

const { LOCALES } = require('@condo/domains/common/constants/locale')
const { hasValidJsonStructure } = require('@condo/domains/common/utils/validation.utils')

const access = require('@condo/domains/notification/access/Message')
const { MESSAGE_STATUSES, MESSAGE_SENDING_STATUS } = require('@condo/domains/notification/constants/constants')

const Message = new GQLListSchema('Message', {
    schemaDoc: 'Notification message',
    fields: {
        organization: {
            schemaDoc: 'This message is related to some organization. Organization can manage their messages',
            type: 'Relationship',
            ref: 'Organization',
            kmigratorOptions: { null: true, on_delete: 'models.CASCADE' },
            access: {
                create: true,
                read: true,
                update: false,
            },
        },

        user: {
            schemaDoc: 'to User',
            type: 'Relationship',
            ref: 'User',
            isRequired: false,
            kmigratorOptions: { null: true, on_delete: 'models.CASCADE' },
        },

        phone: {
            schemaDoc: 'to Phone',
            type: 'Text',
            isRequired: false,
        },

        email: {
            schemaDoc: 'to Email',
            type: 'Text',
            isRequired: false,
        },

        emailFrom: {
            schemaDoc: 'from Email',
            type: 'Text',
            isRequired: false,
        },

        lang: {
            schemaDoc: 'Message status',
            type: 'Select',
            options: Object.keys(LOCALES).join(','),
            isRequired: true,
        },

        type: {
            schemaDoc: 'Message type',
            type: 'Text',
            isRequired: true,
        },

        meta: {
            schemaDoc: 'Message context',
            type: 'Json',
            isRequired: true,
            hooks: {
                validateInput: (args) => {
                    if (!hasValidJsonStructure(args, true, 1, {})) return
                },
            },
        },

        status: {
            schemaDoc: 'Message status',
            type: 'Select',
            defaultValue: MESSAGE_SENDING_STATUS,
            options: MESSAGE_STATUSES.join(','),
            isRequired: true,
        },

        processingMeta: {
            schemaDoc: 'Task processing metadata. Just for debug purpose. You can see exactly what and where the message was sent',
            type: 'Json',
            isRequired: false,
            hooks: {
                validateInput: (args) => {
                    if (!hasValidJsonStructure(args, false, 1, {})) return
                },
            },
        },

        deliveredAt: {
            schemaDoc: 'Delivered (received) at time',
            type: 'DateTimeUtc',
            isRequired: false,
        },

        sentAt: {
            schemaDoc: 'Sent at time',
            type: 'DateTimeUtc',
            isRequired: false,
        },

        readAt: {
            schemaDoc: 'Read at time',
            type: 'DateTimeUtc',
            isRequired: false,
        },

        uniqKey: {
            schemaDoc: 'Unique message key. You can use it if you need to make sure that the message you are trying to create has not been created before. Fields `user`, `type` and `uniqkey` is to be unique. If you don\'t have a `user`, the fields `type` and `uniqkey` is to be unique',
            type: 'Text',
            isRequired: false,
        },

    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.CheckConstraint',
                check: 'Q(user__isnull=False) | Q(phone__isnull=False) | Q(email__isnull=False)',
                name: 'has_phone_or_email_or_user',
            },
            {
                type: 'models.UniqueConstraint',
                fields: ['user', 'type', 'uniqKey'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'message_unique_user_type_uniqKey',
            },
            {
                type: 'models.UniqueConstraint',
                fields: ['type', 'uniqKey'],
                condition: 'Q(user__isnull=True) & Q(deletedAt__isnull=True)',
                name: 'message_unique_type_uniqKey',
            },
        ],
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadMessages,
        create: access.canManageMessages,
        update: access.canManageMessages,
        delete: false,
        auth: true,
    },
})

module.exports = {
    Message,
}
