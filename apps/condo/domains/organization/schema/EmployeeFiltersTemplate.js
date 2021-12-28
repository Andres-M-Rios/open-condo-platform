/**
 * Generated by `createschema organization.EmployeeFiltersTemplate 'name:Text; employee:Relationship:OrganizationEmployee:CASCADE; schemaName:Text; filters:Json'`
 */

const { Text, Relationship, Integer, Select, Checkbox, DateTimeUtc, CalendarDay, Decimal, Password, File } = require('@keystonejs/fields')
const { Json } = require('@core/keystone/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/organization/access/EmployeeFiltersTemplate')


const EmployeeFiltersTemplate = new GQLListSchema('EmployeeFiltersTemplate', {
    // TODO(codegen): write doc for the EmployeeFiltersTemplate domain model!
    schemaDoc: 'TODO DOC!',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        name: {
            // TODO(codegen): write doc for EmployeeFiltersTemplate.name field!
            schemaDoc: 'TODO DOC!',
            type: Text,
            isRequired: true,
        },

        employee: {
            // TODO(codegen): write doc for EmployeeFiltersTemplate.employee field!
            schemaDoc: 'TODO DOC!',
            type: Relationship,
            ref: 'OrganizationEmployee',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        schemaName: {
            // TODO(codegen): write doc for EmployeeFiltersTemplate.schemaName field!
            schemaDoc: 'TODO DOC!',
            type: Text,
            isRequired: true,
        },

        filters: {
            // TODO(codegen): write doc for EmployeeFiltersTemplate.filters field!
            schemaDoc: 'TODO DOC!',
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
