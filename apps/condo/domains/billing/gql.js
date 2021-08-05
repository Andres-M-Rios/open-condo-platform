/**
 * Generated by `createschema billing.BillingIntegration name:Text;`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')

const COMMON_FIELDS = 'id dv sender v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const BILLING_INTEGRATION_FIELDS = `{ name shortDescription detailsTitle detailsText detailsConfirmButtonText detailsInstructionButtonText detailsInstructionButtonLink ${COMMON_FIELDS} }`
const BillingIntegration = generateGqlQueries('BillingIntegration', BILLING_INTEGRATION_FIELDS)

const BILLING_INTEGRATION_ACCESS_RIGHT_FIELDS = '{ integration { id name } user { id name } id dv createdBy { id name } updatedBy { id name } createdAt updatedAt }'
const BillingIntegrationAccessRight = generateGqlQueries('BillingIntegrationAccessRight', BILLING_INTEGRATION_ACCESS_RIGHT_FIELDS)

const BILLING_INTEGRATION_ORGANIZATION_CONTEXT_FIELDS = `{ integration { id name } organization { id name } settings state status ${COMMON_FIELDS} }`
const BillingIntegrationOrganizationContext = generateGqlQueries('BillingIntegrationOrganizationContext', BILLING_INTEGRATION_ORGANIZATION_CONTEXT_FIELDS)

const BILLING_INTEGRATION_LOG_FIELDS = `{ context ${BILLING_INTEGRATION_ORGANIZATION_CONTEXT_FIELDS} type message meta ${COMMON_FIELDS} }`
const BillingIntegrationLog = generateGqlQueries('BillingIntegrationLog', BILLING_INTEGRATION_LOG_FIELDS)

const BILLING_PROPERTY_FIELDS = `{ context ${BILLING_INTEGRATION_ORGANIZATION_CONTEXT_FIELDS} importId address raw meta ${COMMON_FIELDS} }`
const BillingProperty = generateGqlQueries('BillingProperty', BILLING_PROPERTY_FIELDS)

const BILLING_ACCOUNT_FIELDS = `{ context ${BILLING_INTEGRATION_ORGANIZATION_CONTEXT_FIELDS} importId property { id } number unitName raw meta ${COMMON_FIELDS} }`
const BillingAccount = generateGqlQueries('BillingAccount', BILLING_ACCOUNT_FIELDS)

const BILLING_METER_RESOURCE_FIELDS = `{ name ${COMMON_FIELDS} }`
const BillingMeterResource = generateGqlQueries('BillingMeterResource', BILLING_METER_RESOURCE_FIELDS)

const BILLING_ACCOUNT_METER_FIELDS = `{ context ${BILLING_INTEGRATION_ORGANIZATION_CONTEXT_FIELDS} importId property { id } account { id } resource { id } raw meta ${COMMON_FIELDS} }`
const BillingAccountMeter = generateGqlQueries('BillingAccountMeter', BILLING_ACCOUNT_METER_FIELDS)

const BILLING_ACCOUNT_METER_READING_FIELDS = `{ context ${BILLING_INTEGRATION_ORGANIZATION_CONTEXT_FIELDS} importId property { id } account { id } meter { id } period value1 value2 value3 date raw ${COMMON_FIELDS} }`
const BillingAccountMeterReading = generateGqlQueries('BillingAccountMeterReading', BILLING_ACCOUNT_METER_READING_FIELDS)

const BILLING_RECEIPT_FIELDS = `{ context ${BILLING_INTEGRATION_ORGANIZATION_CONTEXT_FIELDS} importId property { id } account { id } recipient period raw toPay printableNumber toPayDetails services ${COMMON_FIELDS} }`
const BillingReceipt = generateGqlQueries('BillingReceipt', BILLING_RECEIPT_FIELDS)
 
const BILLING_RECEIPTS_FOR_SERVICE_CONSUMER_QUERY = `
    query getBillingReceiptsForServiceConsumer ($data: BillingReceiptsForServiceConsumerInput!) {
        obj: getBillingReceiptsForServiceConsumer(where: {id: $id}) recipient period toPay printableNumber toPayDetails services ${COMMON_FIELDS} 
    }
`

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    BillingIntegration,
    BillingIntegrationAccessRight,
    BillingIntegrationOrganizationContext,
    BillingIntegrationLog,
    BillingProperty,
    BillingAccount,
    BillingMeterResource,
    BillingAccountMeter,
    BillingAccountMeterReading,
    BillingReceipt,
    BILLING_RECEIPTS_FOR_SERVICE_CONSUMER_QUERY,
/* AUTOGENERATE MARKER <EXPORTS> */
}
