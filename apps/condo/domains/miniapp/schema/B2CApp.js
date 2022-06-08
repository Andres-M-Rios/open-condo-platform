/**
 * Generated by `createschema miniapp.B2CApp 'name:Text;'`
 */

const dayjs = require('dayjs')
const { Text, Relationship } = require('@keystonejs/fields')
const { GQLListSchema, find } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { dvAndSender } = require('@condo/domains/common/schema/plugins/dvAndSender')
const access = require('@condo/domains/miniapp/access/B2CApp')
const {
    LOGO_FIELD,
    SHORT_DESCRIPTION_FIELD,
    DEVELOPER_FIELD,
    IS_HIDDEN_FIELD,
} = require('@condo/domains/miniapp/schema/fields/integration')
const { COLOR_SCHEMA_FIELD } = require('@condo/domains/miniapp/schema/fields/b2cApp')
const { B2CAppBuild } = require('@condo/domains/miniapp/utils/serverSchema')


const B2CApp = new GQLListSchema('B2CApp', {
    schemaDoc: 'B2C App',
    fields: {
        name: {
            schemaDoc: 'Name of B2C App',
            type: Text,
            isRequired: true,
        },
        logo: {
            ...LOGO_FIELD,
            isRequired: true,
        },
        shortDescription: SHORT_DESCRIPTION_FIELD,
        developer: DEVELOPER_FIELD,
        isHidden: IS_HIDDEN_FIELD,
        colorSchema: COLOR_SCHEMA_FIELD,
        builds: {
            schemaDoc: 'List of available app builds. Removing item from this list automatically soft-deletes it',
            type: Relationship,
            ref: 'B2CAppBuild.app',
            many: true,
            hooks: {
                afterChange: async ({ operation, context }) => {
                    if (operation === 'update') {
                        const buildsToDelete = await find('B2CAppBuild', {
                            app: null,
                            deletedAt_not: null,
                        })
                        const deletedAt = dayjs().toISOString()
                        for (const build of buildsToDelete) {
                            await B2CAppBuild.update(context, build.id, { deletedAt })
                        }
                    }
                },
            },
        },
        accessRights: {
            schemaDoc: 'Specifies set of service users, who can modify B2CAppProperties of the app as well as perform actions on behalf of the application',
            type: Relationship,
            ref: 'B2CAppAccessRight.app',
            many: true,
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadB2CApps,
        create: access.canManageB2CApps,
        update: access.canManageB2CApps,
        delete: false,
        auth: true,
    },
})

module.exports = {
    B2CApp,
}
