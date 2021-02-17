const { genTestGQLUtils } = require('@core/keystone/gen.gql.utils')

const APPLICATION_FIELDS = '{ id dv sender organization { id name } property { id name address } status { id name type organization { id } } statusReason statusReopenedCounter number client { id name } clientName clientEmail clientPhone operator { id name } assignees { id name } executors { id name } classifier { id name organization { id } parent { id name } } details related { id details } meta source { id name type } sourceMeta v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt }'
const Application = genTestGQLUtils('Application', APPLICATION_FIELDS)

module.exports = {
    Application,
}
