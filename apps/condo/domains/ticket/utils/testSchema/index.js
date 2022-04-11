/**
 * Generated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; classifier:Relationship:TicketClassifier:PROTECT; details:Text; meta?:Json;`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const faker = require('faker')
const { get } = require('lodash')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { makeLoggedInAdminClient } = require('@core/keystone/test.utils')
const { TICKET_STATUS_TYPES, ORGANIZATION_COMMENT_TYPE } = require('../../constants')
const { generateGQLTestUtils, throwIfError } = require('@condo/domains/common/utils/codegeneration/generate.test.utils')
const { Ticket: TicketGQL } = require('@condo/domains/ticket/gql')
const {
    TicketStatus: TicketStatusGQL,
    TicketChange: TicketChangeGQL,
    TicketSource: TicketSourceGQL,
    TicketFile: TicketFileGQL,
    TicketClassifier: TicketClassifierGQL,
    TicketComment: TicketCommentGQL,
    TicketPlaceClassifier: TicketPlaceClassifierGQL,
    TicketCategoryClassifier: TicketCategoryClassifierGQL,
    TicketProblemClassifier: TicketProblemClassifierGQL,
    TicketClassifierRule: TicketClassifierRuleGQL,
} = require('@condo/domains/ticket/gql')
const { ResidentTicket: ResidentTicketGQL } = require('@condo/domains/ticket/gql')
const { GET_ALL_RESIDENT_TICKETS_QUERY } = require('@condo/domains/ticket/gql')
const { UPDATE_RESIDENT_TICKET_MUTATION } = require('@condo/domains/ticket/gql')
const { TicketFilterTemplate: TicketFilterTemplateGQL } = require('@condo/domains/ticket/gql')
const { PREDICT_TICKET_CLASSIFICATION_QUERY } = require('@condo/domains/ticket/gql')
const { FLAT_UNIT_TYPE } = require("@condo/domains/property/constants/common");
const { TicketCommentFile: TicketCommentFileGQL } = require('@condo/domains/ticket/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const TICKET_OPEN_STATUS_ID ='6ef3abc4-022f-481b-90fb-8430345ebfc2'
const TICKET_UNKNOWN_CLASSIFIER_ID = '4f4b43d5-0951-425c-9428-945dc6193361'
const TICKET_OTHER_SOURCE_ID = '7da1e3be-06ba-4c9e-bba6-f97f278ac6e4'

const Ticket = generateGQLTestUtils(TicketGQL)
const TicketStatus = generateGQLTestUtils(TicketStatusGQL)
const TicketFile = generateGQLTestUtils(TicketFileGQL)
const TicketChange = generateGQLTestUtils(TicketChangeGQL)
const TicketSource = generateGQLTestUtils(TicketSourceGQL)
const TicketClassifier = generateGQLTestUtils(TicketClassifierGQL)
const TicketComment = generateGQLTestUtils(TicketCommentGQL)
const TicketPlaceClassifier = generateGQLTestUtils(TicketPlaceClassifierGQL)
const TicketCategoryClassifier = generateGQLTestUtils(TicketCategoryClassifierGQL)
const TicketProblemClassifier = generateGQLTestUtils(TicketProblemClassifierGQL)
const TicketClassifierRule = generateGQLTestUtils(TicketClassifierRuleGQL)
const ResidentTicket = generateGQLTestUtils(ResidentTicketGQL)
const TicketFilterTemplate = generateGQLTestUtils(TicketFilterTemplateGQL)
const TicketCommentFile = generateGQLTestUtils(TicketCommentFileGQL)
/* AUTOGENERATE MARKER <CONST> */

async function createTestTicket (client, organization, property, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!organization || !organization.id) throw new Error('no organization.id')
    if (!property || !property.id) throw new Error('no property.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const details = faker.random.alphaNumeric(10)

    const attrs = {
        dv: 1,
        sender,
        details,
        unitType: FLAT_UNIT_TYPE,
        organization: { connect: { id: organization.id } },
        property: { connect: { id: property.id } },
        status: { connect: { id: TICKET_OPEN_STATUS_ID } },
        classifier: { connect: { id: TICKET_UNKNOWN_CLASSIFIER_ID } },
        source: { connect: { id: TICKET_OTHER_SOURCE_ID } },
        ...extraAttrs,
    }
    const obj = await Ticket.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicket (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await Ticket.update(client, id, attrs)
    return [obj, attrs]
}

async function ticketStatusByType (client) {
    const statuses = await TicketStatus.getAll(client)
    return Object.fromEntries(statuses.map(status => [status.type, status.id]))
}

async function createTestTicketStatus (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const name = faker.random.alphaNumeric(8)
    const type = faker.random.arrayElement(TICKET_STATUS_TYPES)

    const attrs = {
        dv: 1,
        sender,
        name, type,
        ...extraAttrs,
    }
    const obj = await TicketStatus.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketStatus (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketStatus.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestTicketChange (client, ticket, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!ticket || !ticket.id) throw new Error('no ticket.id')

    const attrs = {
        dv: 1,
        ticket: { connect: { id: ticket.id } },
        ...extraAttrs,
    }
    const obj = await TicketChange.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketChange (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketChange.update(client, id, attrs)
    return [obj, attrs]
}


async function createTestTicketFile (client, organization, ticket, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!organization || !organization.id) throw new Error('no organization.id')
    const ticketConnection = (ticket && ticket.id) ? { ticket: { connect: { id: ticket.id } } } : {}
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        organization: { connect: { id: organization.id } },
        ...ticketConnection,
        ...extraAttrs,
    }
    const obj = await TicketFile.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketFile (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketFile.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestTicketClassifier (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        name: faker.lorem.word(),
        ...extraAttrs,
    }
    const obj = await TicketClassifier.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketClassifier (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketClassifier.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestTicketComment (client, ticket, user, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!ticket || !ticket.id) throw new Error('no ticket.id')
    if (!user || !user.id) throw new Error('no user.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const content = faker.random.alphaNumeric(10)

    const attrs = {
        dv: 1,
        sender,
        ticket: { connect: { id: ticket.id } },
        user: { connect: { id: user.id } },
        type: ORGANIZATION_COMMENT_TYPE,
        content,
        ...extraAttrs,
    }
    const obj = await TicketComment.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketComment (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        content: faker.random.alphaNumeric(10),
        ...extraAttrs,
    }
    const obj = await TicketComment.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestTicketPlaceClassifier (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        name: faker.lorem.word(),
        sender,
        ...extraAttrs,
    }
    const obj = await TicketPlaceClassifier.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketPlaceClassifier (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketPlaceClassifier.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestTicketCategoryClassifier (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        name: faker.lorem.word(),
        ...extraAttrs,
    }
    const obj = await TicketCategoryClassifier.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketCategoryClassifier (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketCategoryClassifier.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestTicketProblemClassifier (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        name: faker.lorem.word(),
        ...extraAttrs,
    }
    const obj = await TicketProblemClassifier.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketProblemClassifier (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketProblemClassifier.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestTicketClassifierRule (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const admin = await makeLoggedInAdminClient()
    const [place] = await createTestTicketPlaceClassifier(admin)
    const [category] = await createTestTicketCategoryClassifier(admin)
    const [problem] = await createTestTicketProblemClassifier(admin)
    const attrs = {
        dv: 1,
        sender,
        place: { connect: { id: place.id } },
        category: { connect: { id: category.id } },
        problem: { connect: { id: problem.id } },
        ...extraAttrs,
    }
    const obj = await TicketClassifierRule.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketClassifierRule (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketClassifierRule.update(client, id, attrs)
    return [obj, attrs]
}

const TICKET_MOBILE_SOURCE_ID = '3068d49a-a45c-4c3a-a02d-ea1a53e1febb'

async function createResidentTicketByTestClient(client, property, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        details: faker.lorem.words(),
        property: { connect: { id: get(property, 'id') } },
        source: { connect: { id: TICKET_MOBILE_SOURCE_ID } },
        ...extraAttrs,
    }
    const obj = await ResidentTicket.create(client, attrs)
    return [obj, attrs]
}

async function updateResidentTicketByTestClient(client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await ResidentTicket.update(client, id, attrs)
    return [obj, attrs]
}
async function createTestTicketFilterTemplate (client, employee, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!employee || !employee.id) throw new Error('no employee.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const name = faker.random.alphaNumeric(5)
    const ticketUnitFilter = [faker.random.alphaNumeric(5)]
    const fields = { unitName: ticketUnitFilter }

    const attrs = {
        dv: 1,
        sender,
        employee: { connect: { id: employee.id } },
        name,
        fields,
        ...extraAttrs,
    }
    const obj = await TicketFilterTemplate.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketFilterTemplate (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketFilterTemplate.update(client, id, attrs)
    return [obj, attrs]
}

async function predictTicketClassificationByTestClient(client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const attrs = {
        details: faker.lorem.words(),
        ...extraAttrs,
    }
    const { data, errors } = await client.query(PREDICT_TICKET_CLASSIFICATION_QUERY, { data: attrs })
    throwIfError(data, errors)
    return [data.result, attrs]
}
async function createTestTicketCommentFile (client, organization, ticket, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!organization || !organization.id) throw new Error('no organization.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    // TODO(codegen): write createTestTicketCommentFile logic for generate fields

    const attrs = {
        dv: 1,
        sender,
        organization: { connect: { id: organization.id } },
        ticket: { connect: { id: ticket.id} },
        ...extraAttrs,
    }
    const obj = await TicketCommentFile.create(client, attrs)
    return [obj, attrs]
}

async function updateTestTicketCommentFile (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    // TODO(codegen): check the updateTestTicketCommentFile logic for generate fields

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await TicketCommentFile.update(client, id, attrs)
    return [obj, attrs]
}

/* AUTOGENERATE MARKER <FACTORY> */

async function makeClientWithTicket () {
    const client = await makeClientWithProperty()
    const [ticket] = await createTestTicket(client, client.organization, client.property)
    client.ticket = ticket
    return client
}

module.exports = {
    Ticket,
    TicketFile,
    TicketChange,
    TicketStatus,
    TicketSource,
    ResidentTicket,
    createTestTicket,
    updateTestTicket,
    ticketStatusByType,
    createTestTicketStatus,
    updateTestTicketStatus,
    createTestTicketFile,
    updateTestTicketFile,
    createTestTicketChange,
    updateTestTicketChange,
    makeClientWithTicket,
    TicketPlaceClassifier,
    TicketCategoryClassifier,
    TicketProblemClassifier,
    TicketClassifierRule,
    TicketClassifier, createTestTicketClassifier, updateTestTicketClassifier,
    TicketComment, createTestTicketComment, updateTestTicketComment,
    createTestTicketPlaceClassifier, updateTestTicketPlaceClassifier, createTestTicketCategoryClassifier, updateTestTicketCategoryClassifier, createTestTicketProblemClassifier, updateTestTicketProblemClassifier, createTestTicketClassifierRule, updateTestTicketClassifierRule,
    createResidentTicketByTestClient,
    updateResidentTicketByTestClient,
    TicketFilterTemplate, createTestTicketFilterTemplate, updateTestTicketFilterTemplate,
    predictTicketClassificationByTestClient,
    TicketCommentFile, createTestTicketCommentFile, updateTestTicketCommentFile,
/* AUTOGENERATE MARKER <EXPORTS> */
}
