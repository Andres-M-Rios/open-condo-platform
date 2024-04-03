const VALUE_LESS_THAN_PREVIOUS_ERROR = '[value:lessThanPrevious:'
const EXISTING_METER_NUMBER_IN_SAME_ORGANIZATION = '[unique:alreadyExists:number]'
const EXISTING_METER_ACCOUNT_NUMBER_IN_OTHER_UNIT = '[unique:alreadyExists:accountNumber]'
const AUTOMATIC_METER_NO_MASTER_APP = '[isAutomatic:b2bApp:null] Automatic meter must have b2b app master-system'
const B2B_APP_NOT_CONNECTED = '[b2bApp:notConnected] Linked B2B app must be connected to organization'
const B2C_APP_NOT_AVAILABLE = '[b2cApp:notAvailable] Linked B2C app have is not available on meter\'s property address'

const METER_NUMBER_HAVE_INVALID_VALUE = 'METER_NUMBER_HAVE_INVALID_VALUE'
const METER_ACCOUNT_NUMBER_HAVE_INVALID_VALUE = 'METER_ACCOUNT_NUMBER_HAVE_INVALID_VALUE'
const METER_RESOURCE_OWNED_BY_ANOTHER_ORGANIZATION = 'METER_RESOURCE_OWNED_BY_ANOTHER_ORGANIZATION'

const INVALID_START_DATE_TIME = 'INVALID_START_DATE_TIME'
const INVALID_END_DATE_TIME = 'INVALID_END_DATE_TIME'
const INVALID_PERIOD = 'INVALID_PERIOD'

module.exports = {
    VALUE_LESS_THAN_PREVIOUS_ERROR,
    EXISTING_METER_NUMBER_IN_SAME_ORGANIZATION,
    EXISTING_METER_ACCOUNT_NUMBER_IN_OTHER_UNIT,
    AUTOMATIC_METER_NO_MASTER_APP,
    B2B_APP_NOT_CONNECTED,
    B2C_APP_NOT_AVAILABLE,
    METER_NUMBER_HAVE_INVALID_VALUE,
    METER_ACCOUNT_NUMBER_HAVE_INVALID_VALUE,
    METER_RESOURCE_OWNED_BY_ANOTHER_ORGANIZATION,
    INVALID_START_DATE_TIME,
    INVALID_END_DATE_TIME,
    INVALID_PERIOD,
}
