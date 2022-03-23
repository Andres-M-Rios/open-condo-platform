/**
 * Generated by `createschema notification.Message 'organization?:Relationship:Organization:CASCADE; property?:Relationship:Property:CASCADE; ticket?:Relationship:Ticket:CASCADE; user:Relationship:User:CASCADE; type:Text; meta:Json; channels:Json; status:Select:sending,planned,sent,canceled; deliveredAt:DateTimeUtc;'`
 */

const JSON_NO_REQUIRED_ATTR_ERROR = '[json:noRequiredAttr:'
const JSON_SUSPICIOUS_ATTR_NAME_ERROR = '[json:suspiciousAttrName:'
const JSON_UNKNOWN_ATTR_NAME_ERROR = '[json:unknownAttrName:'

const SMS_TRANSPORT = 'sms'
const EMAIL_TRANSPORT = 'email'
const TELEGRAM_TRANSPORT = 'telegram'
const PUSH_TRANSPORT = 'push'
const MESSAGE_TRANSPORTS = [SMS_TRANSPORT, EMAIL_TRANSPORT, TELEGRAM_TRANSPORT, PUSH_TRANSPORT]

const INVITE_NEW_EMPLOYEE_MESSAGE_TYPE = 'INVITE_NEW_EMPLOYEE'
const SHARE_TICKET_MESSAGE_TYPE = 'SHARE_TICKET'
const DIRTY_INVITE_NEW_EMPLOYEE_MESSAGE_TYPE = 'DIRTY_INVITE_NEW_EMPLOYEE'
const REGISTER_NEW_USER_MESSAGE_TYPE = 'REGISTER_NEW_USER'
const RESET_PASSWORD_MESSAGE_TYPE = 'RESET_PASSWORD'
const SMS_VERIFY_CODE_MESSAGE_TYPE = 'SMS_VERIFY'
const DEVELOPER_IMPORTANT_NOTE_TYPE = 'DEVELOPER_IMPORTANT_NOTE_TYPE'
const CUSTOMER_IMPORTANT_NOTE_TYPE = 'CUSTOMER_IMPORTANT_NOTE_TYPE'
const MESSAGE_FORWARDED_TO_SUPPORT = 'MESSAGE_FORWARDED_TO_SUPPORT'
const TICKET_ASSIGNEE_CONNECTED_TYPE = 'TICKET_ASSIGNEE_CONNECTED'
const TICKET_EXECUTOR_CONNECTED_TYPE = 'TICKET_EXECUTOR_CONNECTED'

const MESSAGE_TYPES = [
    INVITE_NEW_EMPLOYEE_MESSAGE_TYPE,
    DIRTY_INVITE_NEW_EMPLOYEE_MESSAGE_TYPE,
    REGISTER_NEW_USER_MESSAGE_TYPE,
    RESET_PASSWORD_MESSAGE_TYPE,
    SMS_VERIFY_CODE_MESSAGE_TYPE,
    SHARE_TICKET_MESSAGE_TYPE,
    DEVELOPER_IMPORTANT_NOTE_TYPE,
    CUSTOMER_IMPORTANT_NOTE_TYPE,
    MESSAGE_FORWARDED_TO_SUPPORT,
    TICKET_ASSIGNEE_CONNECTED_TYPE,
    TICKET_EXECUTOR_CONNECTED_TYPE,
]

const MESSAGE_META = {
    [INVITE_NEW_EMPLOYEE_MESSAGE_TYPE]: {
        dv: { defaultValue: '', required: true },
        inviteCode: { defaultValue: '', required: true },
        userName: { defaultValue: 'USERNAME', required: false },
        userEmail: { defaultValue: '', required: false },
        userPhone: { defaultValue: '', required: false },
        organizationName: { defaultValue: 'ORGANIZATION', required: false },
    },
    [SHARE_TICKET_MESSAGE_TYPE]: {
        dv: { defaultValue: '', required: true },
        ticketNumber: { defaultValue: '', required: true },
        date: { defaultValue: '', required: true },
        id: { defaultValue: '', required: true },
        details: { defaultValue: '', required: true },
    },
    [DIRTY_INVITE_NEW_EMPLOYEE_MESSAGE_TYPE]: {
        dv: { defaultValue: '', required: true },
        organizationName: { defaultValue: 'ORGANIZATION', required: false },
    },
    [REGISTER_NEW_USER_MESSAGE_TYPE]: {
        dv: { defaultValue: '', required: true },
        userPhone: { defaultValue: '', required: false },
        userPassword: { defaultValue: '', required: false },
    },
    [RESET_PASSWORD_MESSAGE_TYPE]: {
        dv: { defaultValue: '', required: true },
        token: { defaultValue: '', required: true },
        userName: { defaultValue: 'USERNAME', required: false },
        userEmail: { defaultValue: '', required: false },
    },
    [SMS_VERIFY_CODE_MESSAGE_TYPE]: {
        dv: { defaultValue: '', required: true },
        smsCode: { defaultValue: '', required: true },
    },
    [DEVELOPER_IMPORTANT_NOTE_TYPE]: {
        dv: { defaultValue: '', required: true },
        type: { defaultValue: 'UNKNOWN', required: true },
        data: { defaultValue: null, required: true },
    },
    [CUSTOMER_IMPORTANT_NOTE_TYPE]: {
        dv: { defaultValue: '', required: true },
        type: { defaultValue: 'UNKNOWN', required: true },
        data: { defaultValue: null, required: true },
    },
    [MESSAGE_FORWARDED_TO_SUPPORT]: {
        dv: { defaultValue: '', required: true },
        text: { defaultValue: null, required: true },
        os: { defaultValue: null, required: true },
        appVersion: { defaultValue: null, required: true },
        organizationsData: { defaultValue: [], isRequired: false },
        attachments: { defaultValue: [], isRequired: false },
    },
    [TICKET_ASSIGNEE_CONNECTED_TYPE]: {
        dv: { defaultValue: '', required: true },
        data: {
            ticketId: { defaultValue: '', required: true },
            ticketNumber: { defaultValue: '', required: true },
            userId: { defaultValue: '', required: true },
        },
    },
    [TICKET_EXECUTOR_CONNECTED_TYPE]: {
        dv: { defaultValue: '', required: true },
        data: {
            ticketId: { defaultValue: '', required: true },
            ticketNumber: { defaultValue: '', required: true },
            userId: { defaultValue: '', required: true },
        },
    },
}

const MESSAGE_SENDING_STATUS = 'sending'
const MESSAGE_RESENDING_STATUS = 'resending'
const MESSAGE_PROCESSING_STATUS = 'processing'
const MESSAGE_ERROR_STATUS = 'error'
const MESSAGE_DELIVERED_STATUS = 'delivered'
const MESSAGE_CANCELED_STATUS = 'canceled'
const MESSAGE_STATUSES = [
    MESSAGE_SENDING_STATUS, MESSAGE_RESENDING_STATUS,
    MESSAGE_PROCESSING_STATUS, MESSAGE_ERROR_STATUS,
    MESSAGE_DELIVERED_STATUS, MESSAGE_CANCELED_STATUS,
]

const PUSH_TRANSPORT_FIREBASE = 'firebase'
const PUSH_TRANSPORT_APPLE = 'apple'
const PUSH_TRANSPORT_HUAWEI = 'huawei'
const PUSH_TRANSPORT_TYPES = [PUSH_TRANSPORT_FIREBASE, PUSH_TRANSPORT_APPLE, PUSH_TRANSPORT_HUAWEI]
const PUSH_FAKE_TOKEN_SUCCESS = 'PUSH_FAKE_TOKEN_SUCCESS'
const PUSH_FAKE_TOKEN_FAIL = 'PUSH_FAKE_TOKEN_FAIL'

const FIREBASE_CONFIG_ENV = 'FIREBASE_CONFIG_JSON'
const FIREBASE_CONFIG_TEST_PUSHTOKEN_ENV = 'FIREBASE_PUSH_TOKEN_TEST'

module.exports = {
    JSON_NO_REQUIRED_ATTR_ERROR,
    JSON_SUSPICIOUS_ATTR_NAME_ERROR,
    JSON_UNKNOWN_ATTR_NAME_ERROR,
    SMS_TRANSPORT,
    EMAIL_TRANSPORT,
    TELEGRAM_TRANSPORT,
    PUSH_TRANSPORT,
    MESSAGE_TRANSPORTS,
    REGISTER_NEW_USER_MESSAGE_TYPE,
    SMS_VERIFY_CODE_MESSAGE_TYPE,
    INVITE_NEW_EMPLOYEE_MESSAGE_TYPE,
    RESET_PASSWORD_MESSAGE_TYPE,
    DEVELOPER_IMPORTANT_NOTE_TYPE,
    MESSAGE_TYPES,
    MESSAGE_META,
    MESSAGE_SENDING_STATUS,
    MESSAGE_RESENDING_STATUS,
    MESSAGE_PROCESSING_STATUS,
    MESSAGE_ERROR_STATUS,
    MESSAGE_DELIVERED_STATUS,
    MESSAGE_CANCELED_STATUS,
    DIRTY_INVITE_NEW_EMPLOYEE_MESSAGE_TYPE,
    MESSAGE_STATUSES,
    SHARE_TICKET_MESSAGE_TYPE,
    CUSTOMER_IMPORTANT_NOTE_TYPE,
    PUSH_TRANSPORT_TYPES,
    MESSAGE_FORWARDED_TO_SUPPORT,
    TICKET_ASSIGNEE_CONNECTED_TYPE,
    TICKET_EXECUTOR_CONNECTED_TYPE,
    PUSH_TRANSPORT_FIREBASE,
    PUSH_TRANSPORT_APPLE,
    PUSH_TRANSPORT_HUAWEI,
    PUSH_FAKE_TOKEN_SUCCESS,
    PUSH_FAKE_TOKEN_FAIL,
    FIREBASE_CONFIG_ENV,
    FIREBASE_CONFIG_TEST_PUSHTOKEN_ENV,
}
