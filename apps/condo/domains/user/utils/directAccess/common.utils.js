const pluralize = require('pluralize')


function _capitalize (input) {
    return `${input.charAt(0).toUpperCase()}${input.slice(1)}`
}

/**
 * Fills default values in case when list is passed as string
 * @param {DirectAccessList | string} directListConfig
 * @return {DirectAccessList}
 * @private
 */
function getListConfig (directListConfig) {
    if (typeof directListConfig === 'string') {
        return { schemaName: directListConfig, readonly: false }
    } else {
        return directListConfig
    }
}

function generateReadSchemaFieldName (schemaName) {
    return `canRead${pluralize.plural(schemaName)}`
}

function generateManageSchemaFieldName (schemaName) {
    return `canManage${pluralize.plural(schemaName)}`
}

function generateFieldNameToManageField (schemaName, fieldName) {
    return `canManage${schemaName}${_capitalize(fieldName)}Field`
}

function generateExecuteServiceFieldName (serviceName) {
    return `canExecute${_capitalize(serviceName)}`
}

/**
 * Based on provided config generates all field names,
 * which are used in gql.js as well as in field generation
 * @param {DirectAccessConfig} config
 * @return {string[]}
 */
function generateFieldNames (config) {
    const fields = []
    for (const listSchema of config.lists) {
        const listConfig = getListConfig(listSchema)
        fields.push(generateReadSchemaFieldName(listConfig.schemaName))
        if (!listConfig.readonly) {
            fields.push(generateManageSchemaFieldName(listConfig.schemaName))
        }
    }
    for (const serviceName of config.services) {
        fields.push(generateExecuteServiceFieldName(serviceName))
    }

    const fieldsConfig = Object.entries(config.fields)
    for (const [schemaName, fieldNames] of fieldsConfig) {
        for (const fieldName of fieldNames) {
            fields.push(generateFieldNameToManageField(schemaName, fieldName))
        }
    }

    return fields
}

module.exports = {
    getListConfig,
    generateFieldNameToManageField,
    generateReadSchemaFieldName,
    generateManageSchemaFieldName,
    generateExecuteServiceFieldName,
    generateFieldNames,
}