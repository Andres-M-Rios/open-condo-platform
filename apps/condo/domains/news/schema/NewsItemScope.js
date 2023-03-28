/**
 * Generated by `createschema news.NewsItemScope 'newsItem:Relationship:NewsItem:CASCADE; property:Relationship:Property:CASCADE; unitType:Select:get,from,constant,unit_types; unitName:Text'`
 */

const { Text, Relationship,  Select } = require('@keystonejs/fields')

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/news/access/NewsItemScope')
const { UNIT_TYPES } = require('@condo/domains/property/constants/common')

const NewsItemScope = new GQLListSchema('NewsItemScope', {
    schemaDoc: 'Which residents can see the particular news item',
    fields: {

        newsItem: {
            schemaDoc: 'The news item to control access for',
            type: Relationship,
            ref: 'NewsItem',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        property: {
            schemaDoc: 'Residents of this property will be able to read the news item',
            type: Relationship,
            ref: 'Property',
            isRequired: false,
            knexOptions: { isNotNullable: false },
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
        },

        unitType: {
            schemaDoc: 'Which unit type has an ability to read the news item',
            type: Select,
            options: UNIT_TYPES,
        },

        unitName: {
            schemaDoc: 'The particular unit name who can read the news item',
            type: Text,
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadNewsItemScopes,
        create: access.canManageNewsItemScopes,
        update: access.canManageNewsItemScopes,
        delete: false,
        auth: true,
    },
})

module.exports = {
    NewsItemScope,
}