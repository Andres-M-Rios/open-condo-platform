/**
 * Generated by `createservice organization.ReplaceOrganizationEmployeeRoleService --type mutations`
 */

const get = require('lodash/get')
const { default: RedLock } = require('redlock')

const conf = require('@open-condo/config')
const { GQLError, GQLErrorCode: { BAD_USER_INPUT, TOO_MANY_REQUESTS } } = require('@open-condo/keystone/errors')
const { checkDvAndSender } = require('@open-condo/keystone/plugins/dvAndSender')
const { getRedisClient } = require('@open-condo/keystone/redis')
const { GQLCustomSchema, getById } = require('@open-condo/keystone/schema')

const { DV_VERSION_MISMATCH, WRONG_FORMAT } = require('@condo/domains/common/constants/errors')
const { loadListByChunks } = require('@condo/domains/common/utils/serverSchema')
const { B2BAppRole } = require('@condo/domains/miniapp/utils/serverSchema')
const access = require('@condo/domains/organization/access/ReplaceOrganizationEmployeeRoleService')
const { OrganizationEmployee, OrganizationEmployeeRole } = require('@condo/domains/organization/utils/serverSchema')


const IS_BUILD = conf['DATABASE_URL'] === 'undefined'
const LOCK_DURATION_IN_SEC = 60 * 1000 // 60 sec

const rLock = (IS_BUILD) ? undefined : new RedLock([getRedisClient()])

/**
 * List of possible errors, that this custom schema can throw
 * They will be rendered in documentation section in GraphiQL for this custom schema
 */
const ERRORS = {
    DV_VERSION_MISMATCH: {
        mutation: 'replaceOrganizationEmployeeRole',
        variable: ['data', 'dv'],
        code: BAD_USER_INPUT,
        type: DV_VERSION_MISMATCH,
        message: 'Wrong value for data version number',
    },
    WRONG_SENDER_FORMAT: {
        mutation: 'replaceOrganizationEmployeeRole',
        variable: ['data', 'sender'],
        code: BAD_USER_INPUT,
        type: WRONG_FORMAT,
        message: 'Invalid format of "sender" field value. {details}',
        correctExample: '{ dv: 1, fingerprint: \'example-fingerprint-alphanumeric-value\'}',
    },
    ORGANIZATION_NOT_FOUND: {
        mutation: 'replaceOrganizationEmployeeRole',
        variable: ['data', 'organization'],
        code: BAD_USER_INPUT,
        type: 'ORGANIZATION_NOT_FOUND',
        message: 'Organization not found',
        messageForUser: 'api.organization.ReplaceOrganizationEmployeeRole.ORGANIZATION_NOT_FOUND',
    },
    OLD_ROLE_NOT_FOUND: {
        mutation: 'replaceOrganizationEmployeeRole',
        variable: ['data', 'oldRole'],
        code: BAD_USER_INPUT,
        type: 'OLD_ROLE_NOT_FOUND',
        message: 'Old role not found in specified organization',
        messageForUser: 'api.organization.ReplaceOrganizationEmployeeRole.OLD_ROLE_NOT_FOUND',
    },
    NEW_ROLE_NOT_FOUND: {
        mutation: 'replaceOrganizationEmployeeRole',
        variable: ['data', 'newRole'],
        code: BAD_USER_INPUT,
        type: 'NEW_ROLE_NOT_FOUND',
        message: 'New role not found in specified organization',
        messageForUser: 'api.organization.ReplaceOrganizationEmployeeRole.NEW_ROLE_NOT_FOUND',
    },
    DEFAULT_ROLE_CANNOT_BE_DELETED: {
        mutation: 'replaceOrganizationEmployeeRole',
        variable: ['data'],
        code: BAD_USER_INPUT,
        type: 'DEFAULT_ROLE_CANNOT_BE_DELETED',
        message: 'The default role cannot be deleted',
        messageForUser: 'api.organization.ReplaceOrganizationEmployeeRole.DEFAULT_ROLE_CANNOT_BE_DELETED',
    },
    ROLES_MUST_BE_DIFFERENT: {
        mutation: 'replaceOrganizationEmployeeRole',
        variable: ['data'],
        code: BAD_USER_INPUT,
        type: 'ROLES_MUST_BE_DIFFERENT',
        message: 'The old role and new role must be different',
        messageForUser: 'api.organization.ReplaceOrganizationEmployeeRole.ROLES_MUST_BE_DIFFERENT',
    },
    ROLES_ARE_BEING_PROCESSED: {
        mutation: 'replaceOrganizationEmployeeRole',
        variable: ['data'],
        code: TOO_MANY_REQUESTS,
        type: 'ROLES_ARE_BEING_PROCESSED',
        message: 'These roles are already being processed. Please try again a little later',
        messageForUser: 'api.organization.ReplaceOrganizationEmployeeRole.ROLES_ARE_BEING_PROCESSED',
    },
}

const ReplaceOrganizationEmployeeRoleService = new GQLCustomSchema('ReplaceOrganizationEmployeeRoleService', {
    types: [
        {
            access: true,
            type: 'input ReplaceOrganizationEmployeeRoleInput { dv: Int!, sender: SenderFieldInput!, organization: OrganizationWhereUniqueInput!, oldRole: OrganizationEmployeeRoleWhereUniqueInput!, newRole: OrganizationEmployeeRoleWhereUniqueInput!, withDeletionOldRole: Boolean! }',
        },
        {
            access: true,
            type: 'type ReplaceOrganizationEmployeeRoleOutput { status: String! }',
        },
    ],

    mutations: [
        {
            access: access.canReplaceOrganizationEmployeeRole,
            schema: 'replaceOrganizationEmployeeRole(data: ReplaceOrganizationEmployeeRoleInput!): ReplaceOrganizationEmployeeRoleOutput',
            doc: {
                summary: 'Replaces old role "A" with new role "B" for all employees with role "A"',
                description: 'Replaces old role "A" with new role "B" for all employees with role "A". ' +
                    'By default, old role is retained. If you pass the “withDeletionOldRole” flag, then old role will be deleted.',
                errors: ERRORS,
            },
            resolver: async (parent, args, context) => {
                const { data } = args

                const sender = get(data, 'sender', null)
                const dv = get(data, 'dv', null)
                const organizationId = get(data, 'organization.id', null)
                const oldRoleId = get(data, 'oldRole.id', null)
                const newRoleId = get(data, 'newRole.id', null)
                const withDeletionOldRole = get(data, 'withDeletionOldRole', false)

                checkDvAndSender(data, ERRORS.DV_VERSION_MISMATCH, ERRORS.WRONG_SENDER_FORMAT, context)

                const organization = await getById('Organization', organizationId)
                if (!organization || organization.deletedAt) throw new GQLError(ERRORS.ORGANIZATION_NOT_FOUND, context)

                const oldRole = await getById('OrganizationEmployeeRole', oldRoleId)
                if (!oldRole || oldRole.deletedAt || oldRole.organization !== organizationId) throw new GQLError(ERRORS.OLD_ROLE_NOT_FOUND, context)
                if (oldRole.isDefault && withDeletionOldRole) {
                    throw new GQLError(ERRORS.DEFAULT_ROLE_CANNOT_BE_DELETED, context)
                }

                const newRole = await getById('OrganizationEmployeeRole', newRoleId)
                if (!newRole || newRole.deletedAt || newRole.organization !== organizationId) throw new GQLError(ERRORS.NEW_ROLE_NOT_FOUND, context)

                if (oldRoleId === newRoleId) throw new GQLError(ERRORS.ROLES_MUST_BE_DIFFERENT, context)

                let lock

                try {
                    const oldRoleLockKey = `replaceOrganizationEmployeeRole:${oldRoleId}`
                    const newRoleLockKey = `replaceOrganizationEmployeeRole:${newRoleId}`
                    lock = await rLock.acquire([oldRoleLockKey, newRoleLockKey], LOCK_DURATION_IN_SEC, {
                        retryCount: 0,
                    })

                    await loadListByChunks({
                        context,
                        list: OrganizationEmployee,
                        chunkSize: 20,
                        where: {
                            organization: { id: organizationId, deletedAt: null },
                            role: { id: oldRoleId },
                            deletedAt: null,
                        },
                        sortBy: ['createdAt_ASC', 'id_ASC'],
                        chunkProcessor: async (chunk) => {
                            const payload = chunk.map(employee => ({
                                id: employee.id,
                                data: {
                                    dv,
                                    sender,
                                    role: { connect: { id: newRoleId } },
                                },
                            }))
                            await OrganizationEmployee.updateMany(context, payload)

                            return []
                        },
                    })

                    if (withDeletionOldRole) {
                        await loadListByChunks({
                            context,
                            list: B2BAppRole,
                            chunkSize: 20,
                            where: {
                                role: { id: oldRoleId },
                                deletedAt: null,
                            },
                            sortBy: ['createdAt_ASC', 'id_ASC'],
                            chunkProcessor: async (chunk) => {
                                const ids = chunk.map(b2bAppRole => b2bAppRole.id)
                                await B2BAppRole.softDeleteMany(context, ids, { dv, sender })

                                return []
                            },
                        })

                        await OrganizationEmployeeRole.softDelete(context, oldRole.id, { dv, sender })
                    }

                    return {
                        status: 'ok',
                    }
                } catch (error) {
                    if (String(get(error, 'message', '')).includes('The operation was unable to achieve a quorum during its retry window')) {
                        throw new GQLError(ERRORS.ROLES_ARE_BEING_PROCESSED, context)
                    }

                    throw error
                } finally {
                    if (lock) {
                        await lock.release()
                    }
                }
            },
        },
    ],
    
})

module.exports = {
    ReplaceOrganizationEmployeeRoleService,
    ERRORS,
}
