/**
 * Generated by `createservice ticket.PredictTicketClassificationService --type queries`
 */

const conf = require('@open-condo/config')
const { GQLError, GQLErrorCode: { INTERNAL_ERROR } } = require('@open-condo/keystone/errors')
const { fetch } = require('@open-condo/keystone/fetch')
const { getById, GQLCustomSchema } = require('@open-condo/keystone/schema')

const { NOT_FOUND } = require('@condo/domains/common/constants/errors')
const { canPredictTicketClassification } = require('@condo/domains/ticket/access/PredictTicketClassificationService')

const ML_SPACE_TICKET_CLASSIFIER = conf['ML_SPACE_TICKET_CLASSIFIER'] ? JSON.parse(conf['ML_SPACE_TICKET_CLASSIFIER']) : {}

/**
 * List of possible errors, that this custom schema can throw
 * They will be rendered in documentation section in GraphiQL for this custom schema
 */
const ERRORS = {
    TICKET_RULE_NOT_FOUND: {
        query: 'predictTicketClassification',
        code: INTERNAL_ERROR,
        type: NOT_FOUND,
        message: 'ticket classifier rule not found',
        messageForUser: 'api.user.predictTicketClassification.TICKET_RULE_NOT_FOUND',
    },
    TICKET_PREDICT_REQUEST_FAILED: {
        query: 'predictTicketClassification',
        code: INTERNAL_ERROR,
        type: NOT_FOUND,
        message: 'ML server response is not successful',
        messageForUser: 'api.user.predictTicketClassification.TICKET_RULE_NOT_FOUND',
    },
    ML_SPACE_NOT_CONFIGURED: {
        query: 'predictTicketClassification',
        code: INTERNAL_ERROR,
        type: NOT_FOUND,
        message: 'ML_SPACE_TICKET_CLASSIFIER env variable needs to have endpoint, authKey, workspace',
        messageForUser: 'api.user.predictTicketClassification.ML_SPACE_NOT_CONFIGURED',
    },
}

const PredictTicketClassificationService = new GQLCustomSchema('PredictTicketClassificationService', {
    types: [
        {
            access: true,
            type: 'input PredictTicketClassificationInput { details: String! }',
        },
    ],
    queries: [
        {
            access: canPredictTicketClassification,
            schema: 'predictTicketClassification (data: PredictTicketClassificationInput!): TicketClassifier',
            resolver: async (parent, args, context) => {
                const { data: { details } } = args
                if (conf.NODE_ENV === 'test' || !ML_SPACE_TICKET_CLASSIFIER) {
                    return null
                }

                const { endpoint, authKey, workspace } = ML_SPACE_TICKET_CLASSIFIER
                if (!endpoint || !authKey || !workspace) {
                    throw new GQLError(ERRORS.ML_SPACE_NOT_CONFIGURED, context)
                }
                const response = await fetch(endpoint, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'cookie': `authservice_session=${authKey}`,
                        'x-workspace-id': workspace,
                    },
                    method: 'POST',
                    body: JSON.stringify({ instances: [ { ticket: details } ] }),
                })
                if (response.status !== 200) {
                    throw new GQLError(ERRORS.TICKET_PREDICT_REQUEST_FAILED, context)
                }
                const result = await response.json()
                const { prediction: [id] } = result
                const ticketClassifier = await getById('TicketClassifier', id)
                if (!ticketClassifier) {
                    throw new GQLError(ERRORS.TICKET_RULE_NOT_FOUND, context)
                }
                return ticketClassifier
            },
        },
    ],
    
})

module.exports = {
    PredictTicketClassificationService,
}
