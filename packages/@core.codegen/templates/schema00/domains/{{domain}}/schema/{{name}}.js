/**
 * Generated by `{{ command }}`
 */

const { Text, Relationship, Integer, Select, Checkbox, DateTimeUtc, CalendarDay, Decimal, Password, File, Url } = require('@keystonejs/fields')
const { Json } = require('@condo/keystone/fields')
const { GQLListSchema } = require('@condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@condo/keystone/plugins')
const { dvAndSender } = require('@{{app}}/domains/common/schema/plugins/dvAndSender')
const access = require('@{{app}}/domains/{{ domain }}/access/{{name}}')


const {{ name }} = new GQLListSchema('{{ name }}', {
    // TODO(codegen): write doc for the {{ name }} domain model!
    schemaDoc: 'TODO DOC!',
    fields: {
{% for field in signature %}
        {{ field.name }}: {
            // TODO(codegen): write doc for {{ name }}.{{ field.name }} field!
            schemaDoc: 'TODO DOC!',
            type: {{ field.type }},
{%- if field.isRelation %}
            ref: '{{ field.ref }}',
{%- elif field.type === 'Select' %}
            options: '{{ field.options }}',
{%- endif %}
{%- if field.isRequired %}
            isRequired: true,
{%- endif %}
{%- if field.isRelation %}
{%- if field.isRequired %}
            knexOptions: { isNotNullable: true }, // Required relationship only!
{%- endif %}
            kmigratorOptions: { null: {{ not field.isRequired }}, on_delete: 'models.{{ field.on_delete }}' },
{%- endif %}
        },
{% endfor %}
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canRead{{ pluralize.plural(name) }},
        create: access.canManage{{ pluralize.plural(name) }},
        update: access.canManage{{ pluralize.plural(name) }},
        delete: false,
        auth: true,
    },
})

module.exports = {
    {{ name }},
}
