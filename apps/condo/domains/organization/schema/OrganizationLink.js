/**
 * Generated by `createschema organization.OrganizationLink 'from:Relationship:Organization:CASCADE; to:Relationship:Organization:SET_NULL;'`
 */

const { Relationship } = require('@keystonejs/fields')

const { GQLListSchema } = require('@condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@condo/keystone/plugins')
const access = require('@condo/domains/organization/access/OrganizationLink')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')

/**
 * Relationship between Organization that allows an employee of a "parent" (or "holding", you name it) Organization to interact as an employee of another "child" Organizations.
 *
 * @example filter for access check to read entities from all "child" Organizations when current user is an employee in only "parent" Organization
 * ```
 * return {
 *     organization: {
 *         OR: [
 *             queryOrganizationEmployeeFor(user.id),
 *             queryOrganizationEmployeeFromRelatedOrganizationFor(user.id),
 *         ],
 *     },
 * }
 *
 */
const OrganizationLink = new GQLListSchema('OrganizationLink', {
    schemaDoc: 'Relationship between Organization that allows an employee of a "parent" (or "holding", you name it) Organization to interact as an employee of another "child" Organizations. If the relationship is created via OrganizationLink between "parent" and "child" Organization, a user does not need to be employee in all "child" Organization to have the abilities, required to perform some actions there. It is enough to be an employee in just one "parent" Organization. "Child" and "parent" means logical connection, not a structural from real world. Example use case of OrganizationLink is to be able to read Ticket from many organization when current user is an employee of Organization that act as a supervisor, like call center, that servers many "client" Organizations. Similar use cases are implemented for abilities to read MeterReading, ExternalReport, Contact, Division, Property, Ticket, TicketComment and other entities.',
    fields: {
        from: {
            ...ORGANIZATION_OWNED_FIELD,
            schemaDoc: '"Parent" Organization that gains its employee an access to all its "child" Organizations',
        },

        to: {
            schemaDoc: '"Child" Organization that is getting accessible by employee of "parent" Organization, also, some entities of "Child" Organization are becoming accessible for CRUD operations.',
            type: Relationship,
            ref: 'Organization.relatedOrganizations',
            isRequired: true,
            knexOptions: { isNotNullable: true },
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadOrganizationLinks,
        create: access.canManageOrganizationLinks,
        update: access.canManageOrganizationLinks,
        delete: false,
        auth: true,
    },
})

module.exports = {
    OrganizationLink,
}
