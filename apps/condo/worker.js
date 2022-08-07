const { createWorker } = require('@condo/keystone/tasks')

createWorker(require('./index'))
    .catch((error) => {
        console.error(error)
        process.exit(2)
    })
