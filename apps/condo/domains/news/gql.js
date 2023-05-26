/**
 * Generated by `createschema news.OrganizationNewsItem 'organization:Relationship:Organization:CASCADE; title:Text; body:Text; type:Select:common,emergency'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateGqlQueries } = require('@open-condo/codegen/generate.gql')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const NEWS_ITEM_FIELDS = `{ organization { id } title body type validBefore sendAt sentAt isPublished ${COMMON_FIELDS} }`
const NewsItem = generateGqlQueries('NewsItem', NEWS_ITEM_FIELDS)

const NEWS_ITEM_SCOPE_FIELDS = `{ newsItem { id organization { id } isPublished } property { id address } unitType unitName ${COMMON_FIELDS} }`
const NewsItemScope = generateGqlQueries('NewsItemScope', NEWS_ITEM_SCOPE_FIELDS)

const NEWS_ITEM_TEMPLATE_FIELDS = `{ organization { id } title body ${COMMON_FIELDS} }`
const NewsItemTemplate = generateGqlQueries('NewsItemTemplate', NEWS_ITEM_TEMPLATE_FIELDS)

const NEWS_ITEM_USER_READ_FIELDS = `{ newsItem { id } user { id } ${COMMON_FIELDS} }`
const NewsItemUserRead = generateGqlQueries('NewsItemUserRead', NEWS_ITEM_USER_READ_FIELDS)

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    NewsItem,
    NewsItemScope,
    NewsItemTemplate,
    NewsItemUserRead,
/* AUTOGENERATE MARKER <EXPORTS> */
}
