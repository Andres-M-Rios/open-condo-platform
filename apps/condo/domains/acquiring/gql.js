/**
 * Generated by `createschema acquiring.AcquiringIntegration 'name:Text;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateGqlQueries } = require('@condo/codegen/generate.gql')
const { gql } = require('graphql-tag')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const ACQUIRING_INTEGRATION_FIELDS = `{ name shortDescription about logo { publicUrl } developer partnerUrl instruction connectedMessage appUrl canGroupReceipts hostUrl supportedBillingIntegrations { id } ${COMMON_FIELDS} }`
const AcquiringIntegration = generateGqlQueries('AcquiringIntegration', ACQUIRING_INTEGRATION_FIELDS)

const ACQUIRING_INTEGRATION_ACCESS_RIGHT_FIELDS = `{ user { id } integration { id } ${COMMON_FIELDS} }`
const AcquiringIntegrationAccessRight = generateGqlQueries('AcquiringIntegrationAccessRight', ACQUIRING_INTEGRATION_ACCESS_RIGHT_FIELDS)

const ACQUIRING_INTEGRATION_CONTEXT_FIELDS = `{ integration { id name explicitFeeDistributionSchema { recipient percent } } organization { id } state settings ${COMMON_FIELDS} implicitFeeDistributionSchema { recipient percent } email reason recipient { bic bankAccount iec tin } }`
const AcquiringIntegrationContext = generateGqlQueries('AcquiringIntegrationContext', ACQUIRING_INTEGRATION_CONTEXT_FIELDS)

const MULTI_PAYMENT_FIELDS = `{ amount explicitFee explicitServiceCharge implicitFee amountWithoutExplicitFee currencyCode withdrawnAt cardNumber paymentWay serviceCategory payerEmail serviceCategory transactionId meta status payments { id } integration { id } ${COMMON_FIELDS} }`
const MultiPayment = generateGqlQueries('MultiPayment', MULTI_PAYMENT_FIELDS)

const PAYMENT_FIELDS = `{ amount explicitFee explicitServiceCharge implicitFee currencyCode advancedAt accountNumber purpose frozenReceipt receipt { id property { id address } account { unitName } } multiPayment { id transactionId } context { id integration { id name } } status order ${COMMON_FIELDS} period organization { id } recipientBic recipientBankAccount }`
const Payment = generateGqlQueries('Payment', PAYMENT_FIELDS)

const REGISTER_MULTI_PAYMENT_MUTATION = gql`
    mutation registerMultiPayment ($data: RegisterMultiPaymentInput!) {
        result: registerMultiPayment(data: $data) { dv multiPaymentId webViewUrl feeCalculationUrl directPaymentUrl getCardTokensUrl }
    }
`

const PAYMENTS_FILTER_FIELDS = '{ advancedAt accountNumber address type order status }'
const PAYMENTS_FILTER_TEMPLATE_FIELDS = `{ name employee { id } fields ${PAYMENTS_FILTER_FIELDS} ${COMMON_FIELDS} }`
const PaymentsFilterTemplate = generateGqlQueries('PaymentsFilterTemplate', PAYMENTS_FILTER_TEMPLATE_FIELDS)

const REGISTER_MULTI_PAYMENT_FOR_ONE_RECEIPT_MUTATION = gql`
    mutation registerMultiPaymentForOneReceipt ($data: RegisterMultiPaymentForOneReceiptInput!) {
        result: registerMultiPaymentForOneReceipt(data: $data) { dv multiPaymentId webViewUrl feeCalculationUrl directPaymentUrl }
    }
`


const SUM_PAYMENTS_QUERY = gql`
    query _allPaymentsSum ($where: PaymentWhereInput!) {
        result: _allPaymentsSum(where: $where) { sum }
    }
`

/* AUTOGENERATE MARKER <CONST> */

const EXPORT_PAYMENTS_TO_EXCEL =  gql`
    query exportPaymentsToExcel ($data: ExportPaymentsToExcelInput!) {
        result: exportPaymentsToExcel(data: $data) { status, linkToFile }
    }
`

module.exports = {
    AcquiringIntegration,
    AcquiringIntegrationAccessRight,
    AcquiringIntegrationContext,
    MultiPayment,
    Payment,
    REGISTER_MULTI_PAYMENT_MUTATION,
    EXPORT_PAYMENTS_TO_EXCEL,
    PaymentsFilterTemplate,
    REGISTER_MULTI_PAYMENT_FOR_ONE_RECEIPT_MUTATION,
    SUM_PAYMENTS_QUERY,
/* AUTOGENERATE MARKER <EXPORTS> */
}
