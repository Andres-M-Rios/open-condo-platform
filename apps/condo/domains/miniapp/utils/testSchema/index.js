/**
 * Generated by `createservice miniapp.AllOrganizationAppsService --type queries`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const { faker } = require('@faker-js/faker')
const get = require('lodash/get')
const capitalize = require('lodash/capitalize')
const path = require('path')
const conf = require('@open-condo/config')
const { UploadingFile } = require('@open-condo/keystone/test.utils')
const { throwIfError, generateGQLTestUtils } = require('@open-condo/codegen/generate.test.utils')
const { PROMO_BLOCK_TEXT_VARIANTS_TO_PROPS } = require('@condo/domains/miniapp/constants')
const {
    B2C_APP_MESSAGE_PUSH_TYPE,
} = require('@condo/domains/notification/constants/constants')

const {
    ALL_MINI_APPS_QUERY,
    SEND_B2C_APP_PUSH_MESSAGE_MUTATION,
    B2BApp: B2BAppGQL,
    B2BAppContext: B2BAppContextGQL,
    B2BAppAccessRight: B2BAppAccessRightGQL,
    B2BAppPromoBlock: B2BAppPromoBlockGQL,
    B2CApp: B2CAppGQL,
    B2CAppProperty: B2CAppPropertyGQL,
    B2CAppAccessRight: B2CAppAccessRightGQL,
    B2CAppBuild: B2CAppBuildGQL,
} = require('@condo/domains/miniapp/gql')
const { MessageAppBlackList: MessageAppBlackListGQL } = require('@condo/domains/miniapp/gql')
const { B2BAppPermission: B2BAppPermissionGQL } = require('@condo/domains/miniapp/gql')
const { B2BAppRole: B2BAppRoleGQL } = require('@condo/domains/miniapp/gql')
const { B2BAppAccessRightSet: B2BAppAccessRightSetGQL } = require('@condo/domains/miniapp/gql')
/* AUTOGENERATE MARKER <IMPORT> */

function randomChoice(options) {
    const index = Math.floor(Math.random() * options.length);
    return options[index];
}

function randomHex() {
    return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
}

function generatePermissionKey() {
    const action = capitalize(faker.word.verb()).replace(/-/g, '')
    const subject = capitalize(faker.word.noun()).replace(/-/g, '')

    return `can${action}${subject}`
}

const B2BApp = generateGQLTestUtils(B2BAppGQL)
const B2BAppContext = generateGQLTestUtils(B2BAppContextGQL)
const B2BAppAccessRight = generateGQLTestUtils(B2BAppAccessRightGQL)
const B2CApp = generateGQLTestUtils(B2CAppGQL)
const B2CAppAccessRight = generateGQLTestUtils(B2CAppAccessRightGQL)
const B2CAppBuild = generateGQLTestUtils(B2CAppBuildGQL)
const B2CAppProperty = generateGQLTestUtils(B2CAppPropertyGQL)
const B2BAppPromoBlock = generateGQLTestUtils(B2BAppPromoBlockGQL)
const MessageAppBlackList = generateGQLTestUtils(MessageAppBlackListGQL)
const B2BAppPermission = generateGQLTestUtils(B2BAppPermissionGQL)
const B2BAppRole = generateGQLTestUtils(B2BAppRoleGQL)
const B2BAppAccessRightSet = generateGQLTestUtils(B2BAppAccessRightSetGQL)
/* AUTOGENERATE MARKER <CONST> */


async function allMiniAppsByTestClient(client, organization, extraAttrs) {
    if (!client) throw new Error('no client')
    if (!organization || !organization.id) throw new Error('no organization id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        organization: { id: organization.id },
        ...extraAttrs,
    }
    const { data, errors } = await client.query(ALL_MINI_APPS_QUERY, { data: attrs })
    throwIfError(data, errors)
    return [data.objs, attrs]
}

async function createTestB2BApp (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        name: faker.company.name().replace(/ /, '-').toUpperCase() + ' B2B APP',
        shortDescription: faker.commerce.productDescription(),
        developer: faker.company.name(),
        detailedDescription: faker.lorem.paragraphs(5),
        isHidden: true,
        ...extraAttrs,
    }
    const obj = await B2BApp.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2BApp (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }

    const obj = await B2BApp.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2BAppContext (client, app, organization, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!app || !app.id) throw new Error('no app.id')
    if (!organization || !organization.id) throw new Error('no organization.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        app: { connect: { id: app.id } },
        organization: { connect: { id: organization.id } },
        ...extraAttrs,
    }
    const obj = await B2BAppContext.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2BAppContext (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2BAppContext.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2BAppAccessRight (client, user, app, accessRightSet = null, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!user || !user.id) throw new Error('no user.id')
    if (!app || !app.id) throw new Error('no user.id')
    if (accessRightSet && !accessRightSet.id) throw new Error('no accessRightSet.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        user: { connect: { id: user.id } },
        app: { connect: { id: app.id } },
        ...(accessRightSet ? { accessRightSet: { connect: { id: accessRightSet.id } } } : null),
        ...extraAttrs,
    }
    const obj = await B2BAppAccessRight.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2BAppAccessRight (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2BAppAccessRight.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2CApp (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const colorSchema = { main: '#fff', secondary: '#123321' }
    const logoFile = new UploadingFile(path.resolve(conf.PROJECT_ROOT, 'apps/condo/domains/common/test-assets/dino.png'))

    const attrs = {
        dv: 1,
        sender,
        name: faker.random.word() + ' B2C APP',
        shortDescription: faker.company.bs(),
        developer: faker.name.firstName(),
        isHidden: true,
        colorSchema,
        logo: logoFile,
        ...extraAttrs,
    }
    const obj = await B2CApp.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2CApp (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2CApp.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2CAppAccessRight (client, user, app, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!user || !user.id) throw new Error('no user.id')
    if (!app || !app.id) throw new Error('no app.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        user: { connect: { id: user.id } },
        app: { connect: { id: app.id } },
        ...extraAttrs,
    }
    const obj = await B2CAppAccessRight.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2CAppAccessRight (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2CAppAccessRight.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2CAppBuild (client, app, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!app || !app.id) throw new Error('no app.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const version = `${faker.datatype.number(20)}.${faker.datatype.number(500)}.${faker.datatype.number(99999)}`
    const data = new UploadingFile(path.resolve(conf.PROJECT_ROOT, 'apps/condo/domains/common/test-assets/archive.zip'))

    const attrs = {
        dv: 1,
        sender,
        app: { connect: { id: app.id } },
        version,
        data,
        ...extraAttrs,
    }
    const obj = await B2CAppBuild.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2CAppBuild (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2CAppBuild.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2CAppProperty (client, app, extraAttrs = {}, validAddress = true, validHouse = true) {
    if (!client) throw new Error('no client')
    if (!app || !app.id) throw new Error('no app.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        app: { connect: { id: app.id } },
        address: getFakeAddress(validAddress, validHouse),
        ...extraAttrs,
    }
    const obj = await B2CAppProperty.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2CAppProperty (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2CAppProperty.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2BAppPromoBlock (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const title = faker.company.catchPhrase()
    const subtitle = faker.commerce.productName()
    const textVariant = randomChoice(Object.keys(PROMO_BLOCK_TEXT_VARIANTS_TO_PROPS))
    const backgroundColor = randomChoice(['hex', 'grad']) === 'hex'
        ? randomHex()
        : `linear-gradient(90deg,  ${randomHex()} 0%, ${randomHex()} 100%)`
    const backgroundImage = new UploadingFile(path.resolve(conf.PROJECT_ROOT, 'apps/condo/domains/common/test-assets/dino.png'))
    const targetUrl  = faker.internet.url()

    const attrs = {
        dv: 1,
        sender,
        title,
        subtitle,
        textVariant,
        backgroundColor,
        backgroundImage,
        targetUrl,
        ...extraAttrs,
    }
    const obj = await B2BAppPromoBlock.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2BAppPromoBlock (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')

    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2BAppPromoBlock.update(client, id, attrs)

    return [obj, attrs]
}


async function sendB2CAppPushMessageByTestClient(client, extraAttrs = {}) {
    if (!client) throw new Error('no client')

    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
        data: {
            body: `testBody ${faker.random.alphaNumeric(8)}`,
            ...get(extraAttrs, 'data', {}),
        },
    }
    const { data, errors } = await client.mutate(SEND_B2C_APP_PUSH_MESSAGE_MUTATION, { data: attrs })

    throwIfError(data, errors, { query: SEND_B2C_APP_PUSH_MESSAGE_MUTATION, variables: { data: attrs }})

    return [data.result, attrs]
}
async function createTestMessageAppBlackList (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')

    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const description = faker.random.alphaNumeric(8)
    const type = B2C_APP_MESSAGE_PUSH_TYPE
    const attrs = {
        dv: 1,
        description,
        sender,
        type,
        ...extraAttrs,
    }
    const obj = await MessageAppBlackList.create(client, attrs)

    return [obj, attrs]
}

async function updateTestMessageAppBlackList (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await MessageAppBlackList.update(client, id, attrs)
    return [obj, attrs]
}
async function createTestB2BAppPermission (client, app, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!app || !app.id) throw new Error('no app.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const key = generatePermissionKey()
    const name = `${faker.word.noun()} management`

    const attrs = {
        dv: 1,
        sender,
        app: { connect: { id: app.id } },
        key,
        name,
        ...extraAttrs,
    }
    const obj = await B2BAppPermission.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2BAppPermission (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2BAppPermission.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2BAppRole (client, app, role, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!app || !app.id) throw new Error('no app.id')
    if (!role || !role.id) throw new Error('no role.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        app: { connect: { id: app.id } },
        role: { connect: { id: role.id } },
        permissions: {},
        ...extraAttrs,
    }
    const obj = await B2BAppRole.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2BAppRole (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2BAppRole.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestB2BAppAccessRightSet (client, app, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!app || !app.id) throw new Error('no app.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        app: { connect: { id: app.id } },
        ...extraAttrs,
    }
    const obj = await B2BAppAccessRightSet.create(client, attrs)
    return [obj, attrs]
}

async function updateTestB2BAppAccessRightSet (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await B2BAppAccessRightSet.update(client, id, attrs)
    return [obj, attrs]
}

/* AUTOGENERATE MARKER <FACTORY> */
function getFakeAddress(validAddress = true, validHouse = true) {
    const cityPart = `город ${faker.name.firstName()}`
    const streetPart = `улица ${faker.name.firstName()}`
    const houseType = validHouse ? 'дом' : 'бунгало'
    const houseNumber = validAddress ? `${faker.datatype.number({min: 1, max: 100})}` : ''
    const housePart = `${houseType} ${houseNumber}`

    return [cityPart, streetPart, housePart].join(', ')
}

module.exports = {
    allMiniAppsByTestClient,
    B2BApp, createTestB2BApp, updateTestB2BApp,
    B2BAppContext, createTestB2BAppContext, updateTestB2BAppContext,
    B2BAppAccessRight, createTestB2BAppAccessRight, updateTestB2BAppAccessRight,
    B2BAppPermission, createTestB2BAppPermission, updateTestB2BAppPermission, generatePermissionKey,
    B2BAppPromoBlock, createTestB2BAppPromoBlock, updateTestB2BAppPromoBlock,
    B2CApp, createTestB2CApp, updateTestB2CApp,
    B2CAppAccessRight, createTestB2CAppAccessRight, updateTestB2CAppAccessRight,
    B2CAppBuild, createTestB2CAppBuild, updateTestB2CAppBuild,
    B2CAppProperty, createTestB2CAppProperty, updateTestB2CAppProperty,
    sendB2CAppPushMessageByTestClient,
    MessageAppBlackList, createTestMessageAppBlackList, updateTestMessageAppBlackList,
    B2BAppRole, createTestB2BAppRole, updateTestB2BAppRole,
    B2BAppAccessRightSet, createTestB2BAppAccessRightSet, updateTestB2BAppAccessRightSet,
/* AUTOGENERATE MARKER <EXPORTS> */
    getFakeAddress,
}
