/**
 * Generated by `createschema user.User 'name:Text;isAdmin:Checkbox;email:Text;password:Password;'`
 */

const { Text, Checkbox, Password } = require('@keystonejs/fields')
const { GQLListSchema } = require('@open-condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const access = require('@address-service/domains/user/access/User')

const User = new GQLListSchema('User', {
    schemaDoc: 'Users authorized by oidc auth',
    labelResolver: ({ name = 'noname', email = 'noemail' }) => `${name}, ${email}`,
    fields: {
        name: {
            schemaDoc: 'The user\'s name',
            type: Text,
            isRequired: true,
        },

        isAdmin: {
            schemaDoc: 'Whether the user admin or not',
            type: Checkbox,
            defaultValue: false,
        },

        isSupport: {
            schemaDoc: 'Whether the user support or not',
            type: Checkbox,
            defaultValue: false,
        },

        // `email` and `password` fields are not required because we allow login only using condo users via oidc
        // At the same time, we keep the ability to log in using default initial data for developers' purposes
        email: {
            schemaDoc: 'The user\'s email',
            type: Text,
        },

        password: {
            schemaDoc: 'The user\'s password',
            type: Password,
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadUsers,
        create: access.canManageUsers,
        update: access.canManageUsers,
        delete: false,
        auth: true,
    },
})

module.exports = {
    User,
}
