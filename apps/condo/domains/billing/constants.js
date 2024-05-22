/**
 * Generated by `createservice billing.ValidateQRCodeService --type mutations`
 */

const BILLING_VALIDATE_QR_CODE_WINDOW = 60 * 60 // seconds
const MAX_CLIENT_VALIDATE_QR_CODE_BY_WINDOW = 10

const REGISTER_BILLING_RECEIPT_FILE_CREATED_STATUS = 'CREATED'
const REGISTER_BILLING_RECEIPT_FILE_UPDATED_STATUS = 'UPDATED'
const REGISTER_BILLING_RECEIPT_FILE_SKIPPED_STATUS = 'SKIPPED'
const REGISTER_BILLING_RECEIPT_FILE_STATUSES = [
    REGISTER_BILLING_RECEIPT_FILE_CREATED_STATUS,
    REGISTER_BILLING_RECEIPT_FILE_UPDATED_STATUS,
    REGISTER_BILLING_RECEIPT_FILE_SKIPPED_STATUS,
]

module.exports = {
    BILLING_VALIDATE_QR_CODE_WINDOW,
    MAX_CLIENT_VALIDATE_QR_CODE_BY_WINDOW,
    REGISTER_BILLING_RECEIPT_FILE_STATUSES,
    REGISTER_BILLING_RECEIPT_FILE_CREATED_STATUS,
    REGISTER_BILLING_RECEIPT_FILE_UPDATED_STATUS,
    REGISTER_BILLING_RECEIPT_FILE_SKIPPED_STATUS,
}
