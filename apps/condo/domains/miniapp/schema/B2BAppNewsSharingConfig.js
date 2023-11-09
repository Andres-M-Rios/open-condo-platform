/**
 * Generated by `createschema miniapp.B2BAppNewsSharingConfig 'publishUrl:Text; previewUrl:Text; getRecipientsUrl:Text;'`
 */

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/miniapp/access/B2BAppNewsSharingConfig')


/**
 * News Sharing B2BApp
 * 
 * News Sharing B2BApp allow b2b users to share their NewsItem to external source like Telegram or Whatsapp from /news page
 *
 *                         [ whatsapp-sharing-miniapp ] -> [ whatsapp ]
 * [ condo /news page ] ->              ...                    ...
 *                         [ telegram-sharing-miniapp ] -> [ telegram ]
 *
 * To create miniapp that can be embedded to /news page developer should provide API and information defined here
 * 
 * @type {GQLListSchema}
 */
const B2BAppNewsSharingConfig = new GQLListSchema('B2BAppNewsSharingConfig', {

    schemaDoc: 'News Sharing B2BApp allow b2b users to share their NewsItem to external source (like Telegram) from /news page',
    fields: {
        name: {
            schemaDoc: 'Short and simple name of the external source. For example: Telegram',
            type:  'Text',
            isRequired: true,
        },

        publishUrl: {
            schemaDoc: 'URL that implements publishing NewsItem method',
            type: 'Url',
            isRequired: true,
        },

        previewUrl: {
            schemaDoc: 'URL that returns HTML preview NewsItem',
            type: 'Url',
            isRequired: true,
        },

        getRecipientsUrl: {
            schemaDoc: 'URL that implements getRecipients function',
            type: 'Url',
            isRequired: true,
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadB2BAppNewsSharingConfigs,
        create: access.canManageB2BAppNewsSharingConfigs,
        update: access.canManageB2BAppNewsSharingConfigs,
        delete: false,
        auth: true,
    },
})

module.exports = {
    B2BAppNewsSharingConfig,
}
