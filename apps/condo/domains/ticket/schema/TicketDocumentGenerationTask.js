/**
 * Generated by `createschema ticket.TicketDocumentGenerationTask 'where:Json; status:Select:processing,completed,error,cancelled; format:Select:docx; progress:Integer; user:Relationship:User:CASCADE; timeZone:Text; file?:File; documentType:Select:completion; meta?:Json;'`
 */

const { canOnlyServerSideWithoutUserRequest } = require('@open-condo/keystone/access')
const { GQLError, GQLErrorCode: { BAD_USER_INPUT  } } = require('@open-condo/keystone/errors')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const { WRONG_VALUE } = require('@condo/domains/common/constants/errors')
const FileAdapter = require('@condo/domains/common/utils/fileAdapter')
const { normalizeTimeZone } = require('@condo/domains/common/utils/timezone')
const { DEFAULT_ORGANIZATION_TIMEZONE } = require('@condo/domains/organization/constants/common')
const access = require('@condo/domains/ticket/access/TicketDocumentGenerationTask')
const {
    TICKET_DOCUMENT_TYPE,
    TICKET_DOCUMENT_GENERATION_TASK_FORMAT,
    TICKET_DOCUMENT_GENERATION_TASK_STATUS,
} = require('@condo/domains/ticket/constants/ticketDocument')
const { generateTicketDocument } = require('@condo/domains/ticket/tasks')

const { getFileMetaAfterChange } = FileAdapter


const TICKET_DOCUMENT_GENERATION_TASK_FOLDER_NAME = 'TicketDocumentGenerationTask'
const TicketDocumentGenerationTaskFileAdapter = new FileAdapter(TICKET_DOCUMENT_GENERATION_TASK_FOLDER_NAME)
const setFileMetaAfterChange = getFileMetaAfterChange(TicketDocumentGenerationTaskFileAdapter, 'file')

const ERRORS = {
    STATUS_IS_ALREADY_COMPLETED: {
        code: BAD_USER_INPUT,
        type: WRONG_VALUE,
        message: 'Status is already completed',
        messageForUser: 'api.ticket.TicketDocumentGenerationTask.STATUS_IS_ALREADY_COMPLETED',
        mutation: 'updateTicketDocumentGenerationTask',
        variable: ['data', 'status'],
    },
    STATUS_IS_ALREADY_ERROR: {
        code: BAD_USER_INPUT,
        type: WRONG_VALUE,
        message: 'Status is already error',
        messageForUser: 'api.ticket.TicketDocumentGenerationTask.STATUS_IS_ALREADY_ERROR',
        mutation: 'updateTicketDocumentGenerationTask',
        variable: ['data', 'status'],
    },
}

const TicketDocumentGenerationTask = new GQLListSchema('TicketDocumentGenerationTask', {
    schemaDoc: 'Information about generation process of ticket document',
    fields: {

        ticket: {
            schemaDoc: 'The application for which the document is generated',
            type: 'Relationship',
            ref: 'Ticket',
            isRequired: true,
            knexOptions: { isNotNullable: false }, // Required relationship only!
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
            access: {
                read: true,
                create: true,
                update: false,
            },
        },

        status: {
            schemaDoc: 'Status of current generation operation',
            type: 'Select',
            options: Object.values(TICKET_DOCUMENT_GENERATION_TASK_STATUS).join(','),
            defaultValue: TICKET_DOCUMENT_GENERATION_TASK_STATUS.PROCESSING,
            isRequired: true,
            access: {
                read: true,
                create: canOnlyServerSideWithoutUserRequest,
                update: true,
            },
        },

        format: {
            schemaDoc: 'Output file format',
            type: 'Select',
            options: Object.values(TICKET_DOCUMENT_GENERATION_TASK_FORMAT).join(','),
            isRequired: true,
            access: {
                read: true,
                create: true,
                update: false,
            },
        },

        progress: {
            schemaDoc: 'Progress of current generation operation',
            type: 'Integer',
            isRequired: true,
            defaultValue: 0,
            access: {
                read: true,
                create: canOnlyServerSideWithoutUserRequest,
                update: canOnlyServerSideWithoutUserRequest,
            },
        },

        user: {
            schemaDoc: 'User that requested this generation operation. Will be used for read access checks to display all generating tasks somewhere and to display progress indicator of ongoing generating task for current user',
            type: 'Relationship',
            ref: 'User',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
            access: {
                read: true,
                create: true,
                update: false,
            },
        },

        timeZone: {
            schemaDoc: 'All datetime fields in export template will be converted to specified tz',
            type: 'Text',
            isRequired: true,
            access: {
                read: true,
                create: true,
                update: false,
            },
            hooks: {
                resolveInput: async ({ resolvedData }) => {
                    const { timeZone } = resolvedData
                    return normalizeTimeZone(timeZone) || DEFAULT_ORGANIZATION_TIMEZONE
                },
            },
        },

        file: {
            schemaDoc: 'Meta information about file, saved outside of database somewhere. Shape of meta information JSON object is specific to file adapter, used by saving a file.',
            type: 'File',
            adapter: TicketDocumentGenerationTaskFileAdapter,
            access: {
                create: canOnlyServerSideWithoutUserRequest,
                read: true,
                update: canOnlyServerSideWithoutUserRequest,
            },
        },

        documentType: {
            schemaDoc: 'Type of document',
            type: 'Select',
            options: Object.values(TICKET_DOCUMENT_TYPE).join(','),
            isRequired: true,
            access: {
                read: true,
                create: true,
                update: false,
            },
        },

        meta: {
            schemaDoc: 'Structured untyped metadata, can be used to store errors or anything else',
            type: 'Json',
            access: {
                create: canOnlyServerSideWithoutUserRequest,
                read: true,
                update: canOnlyServerSideWithoutUserRequest,
            },
        },

    },
    hooks: {
        validateInput: async ({ resolvedData, existingItem, context }) => {
            if (existingItem) {
                if (resolvedData['status'] && existingItem['status'] === TICKET_DOCUMENT_GENERATION_TASK_STATUS.COMPLETED) {
                    throw new GQLError(ERRORS.STATUS_IS_ALREADY_COMPLETED, context)
                }
                if (resolvedData['status'] && existingItem['status'] === TICKET_DOCUMENT_GENERATION_TASK_STATUS.ERROR) {
                    throw new GQLError(ERRORS.STATUS_IS_ALREADY_ERROR, context)
                }
            }
        },

        afterChange: async (args) => {
            const { updatedItem, operation } = args

            await setFileMetaAfterChange(args)

            if (operation === 'create') {
                await generateTicketDocument.delay(updatedItem.id)
            }
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadTicketDocumentGenerationTasks,
        create: access.canManageTicketDocumentGenerationTasks,
        update: access.canManageTicketDocumentGenerationTasks,
        delete: false,
        auth: true,
    },
})

module.exports = {
    TicketDocumentGenerationTask,
    ERRORS,
}
