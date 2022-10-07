/**
 * Generated by `createschema contact.ContactRole 'name:Text'`
 */

const { LocalizedText } = require('@condo/keystone/fields')
const { GQLListSchema } = require('@condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@condo/keystone/plugins')
const access = require('@condo/domains/contact/access/ContactRole')
const { COMMON_AND_ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')

const ContactRole = new GQLListSchema('ContactRole', {
    schemaDoc: 'Role for contact',
    fields: {
        organization: COMMON_AND_ORGANIZATION_OWNED_FIELD,

        name: {
            schemaDoc: 'The role\'s name',
            type: LocalizedText,
            isRequired: true,
            template: 'contact.role.*.name',
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadContactRoles,
        create: access.canManageContactRoles,
        update: access.canManageContactRoles,
        delete: false,
        auth: true,
    },
    escapeSearch: true,
})

module.exports = {
    ContactRole,
}
