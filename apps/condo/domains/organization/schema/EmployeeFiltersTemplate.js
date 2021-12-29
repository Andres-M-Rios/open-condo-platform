/**
 * Generated by `createschema organization.EmployeeFiltersTemplate 'name:Text; employee:Relationship:OrganizationEmployee:CASCADE; schemaName:Text; filters:Json'`
 */

const { Text, Relationship } = require('@keystonejs/fields')
const { Json } = require('@core/keystone/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/organization/access/EmployeeFiltersTemplate')


const EmployeeFiltersTemplate = new GQLListSchema('EmployeeFiltersTemplate', {
    schemaDoc: 'Employee specific filter template',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        name: {
            schemaDoc: 'Template name',
            type: Text,
            isRequired: true,
        },

        employee: {
            schemaDoc: 'Link to employee, who created this template',
            type: Relationship,
            ref: 'OrganizationEmployee',
            isRequired: true,
            knexOptions: { isNotNullable: true },
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        schemaName: {
            schemaDoc: 'What schema is the filter template for (e.g. Ticket)',
            type: Text,
            isRequired: true,
        },

        filters: {
            schemaDoc: 'Filters object',
            type: Json,
            isRequired: true,
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    access: {
        read: access.canReadEmployeeFiltersTemplates,
        create: access.canManageEmployeeFiltersTemplates,
        update: access.canManageEmployeeFiltersTemplates,
        delete: false,
        auth: true,
    },
})

module.exports = {
    EmployeeFiltersTemplate,
}
