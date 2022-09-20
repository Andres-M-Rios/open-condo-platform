/**
 * Generated by `createschema scope.SpecializationScope 'employee:Relationship:OrganizationEmployee:CASCADE; specialization:Relationship:TicketCategoryClassifier:CASCADE;'`
 */

const { Relationship } = require('@keystonejs/fields')
const { GQLListSchema } = require('@condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@condo/keystone/plugins')
const { dvAndSender } = require('@condo/domains/common/schema/plugins/dvAndSender')
const access = require('@condo/domains/scope/access/SpecializationScope')


const SpecializationScope = new GQLListSchema('SpecializationScope', {
    schemaDoc: 'A set of specializations (work categories, that this employee can perform) that limits the visibility of the organization\'s objects to the specified employee',
    fields: {

        employee: {
            type: Relationship,
            ref: 'OrganizationEmployee',
            isRequired: true,
            knexOptions: { isNotNullable: true },
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        specialization: {
            schemaDoc: 'Specific work category, that this employee can perform',
            type: Relationship,
            ref: 'TicketCategoryClassifier',
            isRequired: true,
            knexOptions: { isNotNullable: true },
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['employee', 'specialization'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'specialization_scope_unique_employee_and_specialization',
            },
        ],
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadSpecializationScopes,
        create: access.canManageSpecializationScopes,
        update: access.canManageSpecializationScopes,
        delete: false,
        auth: true,
    },
})

module.exports = {
    SpecializationScope,
}
