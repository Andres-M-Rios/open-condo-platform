/**
 * Generated by `createschema ticket.TicketChange 'ticket:Relationship:Ticket:CASCADE;'`
 */

const { Relationship, Virtual, DateTimeUtc } = require('@keystonejs/fields')
const get = require('lodash/get')

const conf = require('@open-condo/config')
const { versioned, uuided, tracked, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema, find, getById } = require('@open-condo/keystone/schema')
const { extractReqLocale } = require('@open-condo/locales/extractReqLocale')
const { getTranslations } = require('@open-condo/locales/loader')

const { generateChangeTrackableFieldsFrom, buildSetOfFieldsToTrackFrom } = require('@condo/domains/common/utils/serverSchema/changeTrackable')
const access = require('@condo/domains/ticket/access/TicketChange')
const { TicketSource } = require('@condo/domains/ticket/schema/TicketSource')
const { TicketStatus } = require('@condo/domains/ticket/schema/TicketStatus')
const { RESIDENT } = require('@condo/domains/user/constants/common')

const { Ticket } = require('./Ticket')

const { OMIT_TICKET_CHANGE_TRACKABLE_FIELDS } = require('../constants')
const { ticketChangeDisplayNameResolversForSingleRelations, relatedManyToManyResolvers } = require('../utils/serverSchema/TicketChange')



const getTranslation = (translations, key) => {
    if (translations[key]) return translations[key]
    return key
}

// Corresponding TicketChange will have
const keysOfLocalizedTextFields = new Map([
    ['status', TicketStatus.schema.fields.name.template],
    ['source', TicketSource.schema.fields.name.template],
])

/**
 *
 * @type {GQLListSchema}
 */
const TicketChange = new GQLListSchema('TicketChange', {
    schemaDoc: 'Incremental changes of Ticket',
    fields: {
        ticket: {
            schemaDoc: 'Related ticket, whose change is logged in this entity',
            type: Relationship,
            ref: 'Ticket',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },
        ...generateChangeTrackableFieldsFrom(
            buildSetOfFieldsToTrackFrom(Ticket.schema, { except: OMIT_TICKET_CHANGE_TRACKABLE_FIELDS }),
            ticketChangeDisplayNameResolversForSingleRelations,
            relatedManyToManyResolvers,
            keysOfLocalizedTextFields,
        ),
        actualCreationDate: {
            schemaDoc: 'Actual creation ticket change date, for case when ticket updated from offline',
            type: DateTimeUtc,
        },
        changedByRole: {
            schemaDoc: 'Type of user who changed the ticket, can be employee role from same organization or related, resident or deleted employee',
            type: Virtual,
            resolver: async (item, args, context) => {
                const locale = extractReqLocale(context.req) || conf.DEFAULT_LOCALE
                const translations = getTranslations(locale)

                const ticket = await getById('Ticket', item.ticket)
                const userId = get(item, 'createdBy')
                if (!ticket || !userId) return getTranslation(translations, 'pages.condo.ticket.TicketChanges.notice.DeletedCreatedAt.title')

                const user = await getById('User', userId)
                if (!user) return getTranslation(translations, 'pages.condo.ticket.TicketChanges.notice.DeletedCreatedAt.title')
                if (user.type === RESIDENT) return getTranslation(translations, 'Contact')

                const orgId = get(ticket, 'organization', null)
                if (!orgId) return getTranslation(translations, 'DeletedEmployee')

                const orgEmployees = await find('OrganizationEmployee', {
                    organization: { id: orgId },
                    user: { id: userId },
                    deletedAt: null,
                    isBlocked: false,
                })

                if (orgEmployees.length) {
                    const roleID = orgEmployees[0].role
                    const role = await getById('OrganizationEmployeeRole', roleID)

                    return getTranslation(translations, role.name)
                }

                const links = await find('OrganizationLink', {
                    to: { id: orgId },
                })
                const relatedOrgIds = links.map(link => link.from).filter(Boolean)
                const relatedOrgEmployees = await find('OrganizationEmployee', {
                    organization: { id_in: relatedOrgIds },
                    user: { id: userId },
                    deletedAt: null,
                    isBlocked: false,
                })

                if (relatedOrgEmployees.length) {
                    const roleID = relatedOrgEmployees[0].role
                    const role = await getById('OrganizationEmployeeRole', roleID)

                    return getTranslation(translations, role.name)
                }

                return getTranslation(translations, 'DeletedEmployee')
            },
        },
    },
    hooks: {
        resolveInput: ({ resolvedData }) => {
            if (!resolvedData.actualCreationDate) {
                resolvedData.actualCreationDate = new Date().toISOString()
            }

            return resolvedData
        },
    },
    plugins: [uuided(), versioned(), tracked(), dvAndSender()],
    access: {
        read: access.canReadTicketChanges,
        create: access.canManageTicketChanges,
        update: false,
        delete: false,
        auth: true,
    },
})

module.exports = {
    TicketChange,
}
