/**
 * Generated by `createschema user.User name:Text; password?:Password; isAdmin?:Checkbox; email?:Text; isEmailVerified?:Checkbox; phone?:Text; isPhoneVerified?:Checkbox; avatar?:File; meta:Json; importId:Text;`
 */

const { WRONG_EMAIL_ERROR } = require('@condo/domains/user/constants/errors')
const { getRandomString, makeLoggedInAdminClient, makeClient } = require('@core/keystone/test.utils')

const { User, UserAdmin, createTestUser, updateTestUser, makeClientWithNewRegisteredAndLoggedInUser, makeLoggedInClient, createTestLandlineNumber, createTestPhone, createTestEmail, makeClientWithResidentUser } = require('@condo/domains/user/utils/testSchema')
const { expectToThrowAccessDeniedErrorToObj, expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects } = require('@condo/domains/common/utils/testSchema')
const { GET_MY_USERINFO, SIGNIN_MUTATION } = require('@condo/domains/user/gql')
const { DEFAULT_TEST_USER_IDENTITY, DEFAULT_TEST_USER_SECRET } = require('@core/keystone/test.utils')
const { WRONG_PASSWORD_ERROR, EMPTY_PASSWORD_ERROR } = require('@condo/domains/user/constants/errors')

describe('SIGNIN', () => {
    test('anonymous: SIGNIN_MUTATION', async () => {
        const client = await makeClient()
        const { data, errors } = await client.mutate(SIGNIN_MUTATION, {
            'identity': DEFAULT_TEST_USER_IDENTITY,
            'secret': DEFAULT_TEST_USER_SECRET,
        })
        expect(data.auth.user.id).toMatch(/[a-zA-Z0-9-_]+/)
        expect(errors).toEqual(undefined)
    })

    test('anonymous: GET_MY_USERINFO', async () => {
        const client = await makeClient()
        const { data, errors } = await client.query(GET_MY_USERINFO)
        expect(errors).toEqual(undefined)
        expect(data).toEqual({ 'user': null })
    })

    test('user: GET_MY_USERINFO', async () => {
        const client = await makeLoggedInClient()
        const { data, errors } = await client.query(GET_MY_USERINFO)
        expect(errors).toEqual(undefined)
        expect(data.user).toEqual(expect.objectContaining({ id: client.user.id }))
    })

    test('anonymous: SIGNIN_MUTATION by wrong password', async () => {
        const client = await makeClient()
        const { data, errors } = await client.mutate(SIGNIN_MUTATION, {
            'identity': DEFAULT_TEST_USER_IDENTITY,
            'secret': 'wrong password',
        })
        expect(data).toEqual({ 'auth': null })
        expect(JSON.stringify(errors)).toMatch((WRONG_PASSWORD_ERROR))
    })

    test('anonymous: SIGNIN_MUTATION by wrong email', async () => {
        const client = await makeClient()
        const { data, errors } = await client.mutate(SIGNIN_MUTATION, {
            'identity': 'some3571592131usermail@example.com',
            'secret': 'wrong password',
        })
        expect(data).toEqual({ 'auth': null })
        expect(JSON.stringify(errors)).toMatch(WRONG_EMAIL_ERROR)
    })

    test('check auth by empty password', async () => {
        const admin = await makeLoggedInAdminClient()
        const [, userAttrs] = await createTestUser(admin, { password: '' })
        const checkAuthByEmptyPassword = async () => {
            await makeLoggedInClient({ email: userAttrs.email, password: '' })
        }
        await expect(checkAuthByEmptyPassword).rejects.toThrow(EMPTY_PASSWORD_ERROR)
    })
})

describe('User', () => {
    test('user: create User', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await createTestUser(client)
        })
    })

    test('anonymous: create User', async () => {
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObj(async () => {
            await createTestUser(client)
        })
    })

    test('user: read User', async () => {
        const admin = await makeLoggedInAdminClient()
        const [anotherUser] = await createTestUser(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const { data } = await UserAdmin.getAll(client, {}, { raw: true, sortBy: ['updatedAt_DESC'] })
        expect(data.objs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: client.user.id, email: client.userAttrs.email, phone: client.userAttrs.phone }),
                expect.objectContaining({ id: anotherUser.id, email: null, phone: null }),
            ]),
        )
        expect(data.objs.length >= 1).toBeTruthy()
    })

    test('anonymous: read User', async () => {
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObjects(async () => {
            await User.getAll(client)
        })
    })

    test('user: update self User', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = {}
        const [obj, attrs] = await updateTestUser(client, client.user.id, payload)
        expect(obj.updatedBy).toMatchObject({ id: client.user.id })
        expect(obj.sender).toMatchObject(attrs.sender)
        expect(obj.v).toBeGreaterThan(client.user.v)
    })

    test('user: update self User phone should fail', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { phone: createTestPhone() }
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestUser(client, client.user.id, payload)
        })
    })

    // TODO(pahaz): !!! remove this test in the FUTURE
    test('user: update self resident phone should ok', async () => {
        const client = await makeClientWithResidentUser()
        const payload = { phone: client.userAttrs.phone }
        await updateTestUser(client, client.user.id, payload)

        const objs = await UserAdmin.getAll(client, { id: client.user.id })
        expect(objs[0]).toEqual(expect.objectContaining({ phone: client.userAttrs.phone }))
    })

    // TODO(pahaz): !!! unskip!
    test.skip('user: update self User email should fail', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { email: createTestEmail() }
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestUser(client, client.user.id, payload)
        })
    })

    test('user: update self User name', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { name: createTestEmail() }
        const [obj] = await updateTestUser(client, client.user.id, payload)
        expect(obj.name).toEqual(payload.name)
    })

    test('user: update self User isAdmin should fail', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { isAdmin: true }
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestUser(client, client.user.id, payload)
        })
    })

    test('user: update self User password', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const password = getRandomString()
        const payload = { password }
        const [obj, attrs] = await updateTestUser(client, client.user.id, payload)
        expect(obj.updatedBy).toMatchObject({ id: client.user.id })
        expect(obj.sender).toMatchObject(attrs.sender)
        expect(obj.v).toBeGreaterThan(client.user.v)

        const client2 = await makeLoggedInClient({ phone: client.userAttrs.phone, password })
        expect(client2.user.id).toEqual(client.user.id)
    })

    test('user: update another User should fail', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestUser(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = {}
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestUser(client, objCreated.id, payload)
        })
    })

    test('anonymous: update User', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestUser(admin)

        const client = await makeClient()
        const payload = {}
        await expectToThrowAuthenticationErrorToObj(async () => {
            await updateTestUser(client, objCreated.id, payload)
        })
    })

    test('user: delete User', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestUser(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await User.delete(client, objCreated.id)
        })
    })

    test('anonymous: delete User', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestUser(admin)

        const client = await makeClient()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await User.delete(client, objCreated.id)
        })
    })

    test('anonymous: count', async () => {
        const client = await makeClient()
        const { data, errors } = await User.count(client, {}, { raw: true })
        expect(data).toEqual({ meta: { count: null } })
        expect(errors[0]).toMatchObject({
            'message': 'No or incorrect authentication credentials',
            'name': 'AuthenticationError',
            'path': ['meta', 'count'],
        })
    })

    test('user: count', async () => {
        const admin = await makeLoggedInAdminClient()
        const [, userAttrs] = await createTestUser(admin)
        const client = await makeLoggedInClient(userAttrs)
        const count = await User.count(client)
        expect(count).toBeGreaterThanOrEqual(2)
    })
})

describe('User utils', () => {
    test('createUser()', async () => {
        const admin = await makeLoggedInAdminClient()
        const [user, userAttrs] = await createTestUser(admin)
        expect(user.id).toMatch(/^[A-Za-z0-9-]+$/g)
        expect(userAttrs.email).toBeTruthy()
        expect(userAttrs.password).toBeTruthy()
    })

    test('createUser() with landline phone number', async () => {
        const admin = await makeLoggedInAdminClient()
        const phone = createTestLandlineNumber()

        const { data, errors } = await createTestUser(admin, { phone }, { raw: true })

        expect(data).toEqual({ 'obj': null })
        expect(errors).toMatchObject([{
            message: 'You attempted to perform an invalid mutation',
            name: 'ValidationFailureError',
            path: ['obj'],
            data: {
                messages: [ '[format:phone] invalid format' ],
            },
        }])
    })
})

describe('User fields', () => {
    test('Convert email to lower case', async () => {
        const admin = await makeLoggedInAdminClient()
        const email = 'XXX' + getRandomString() + '@example.com'
        const [user, userAttrs] = await createTestUser(admin, { email })

        const objs = await UserAdmin.getAll(admin, { id: user.id })
        expect(objs[0]).toEqual(expect.objectContaining({ email: email.toLowerCase(), id: user.id }))

        const client2 = await makeLoggedInClient({ password: userAttrs.password, email: email.toLowerCase() })
        expect(client2.user.id).toEqual(user.id)

        // TODO(pahaz): fix in a future (it's no OK if you can't logged in by upper case email)
        const checkAuthByUpperCaseEmail = async () => {
            await makeLoggedInClient(userAttrs)
        }
        await expect(checkAuthByUpperCaseEmail).rejects.toThrow(WRONG_EMAIL_ERROR)
    })
})
