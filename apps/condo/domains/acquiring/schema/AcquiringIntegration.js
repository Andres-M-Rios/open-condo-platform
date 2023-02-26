/**
 * Generated by `createschema acquiring.AcquiringIntegration 'name:Text;'`
 */

const { Text, Relationship, Checkbox } = require('@keystonejs/fields')

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/acquiring/access/AcquiringIntegration')
const { FEE_DISTRIBUTION_SCHEMA_FIELD } = require('@condo/domains/acquiring/schema/fields/json/FeeDistribution')
const { DEFAULT_BILLING_INTEGRATION_GROUP } = require('@condo/domains/billing/constants/constants')
const { getFileMetaAfterChange } = require('@condo/domains/common/utils/fileAdapter')
const { GALLERY_FIELD } = require('@condo/domains/miniapp/schema/fields/galleryField')
const {
    LOGO_FIELD,
    APPS_FILE_ADAPTER,
    DEVELOPER_FIELD,
    PARTNER_URL_FIELD,
    SHORT_DESCRIPTION_FIELD,
    APP_DETAILS_FIELD,
    IFRAME_URL_FIELD,
    IS_HIDDEN_FIELD,
    DISPLAY_PRIORITY_FIELD,
    LABEL_FIELD,
    PRICE_FIELD,
    CONTEXT_DEFAULT_STATUS_FIELD,
} = require('@condo/domains/miniapp/schema/fields/integration')

const logoMetaAfterChange = getFileMetaAfterChange(APPS_FILE_ADAPTER, 'logo')


const AcquiringIntegration = new GQLListSchema('AcquiringIntegration', {
    schemaDoc: 'Information about `acquiring component` which will generate `billing receipts` and `payments`',
    fields: {
        name: {
            schemaDoc: 'Name of `acquiring component`, which is set up by developer',
            type: Text,
            isRequired: true,
        },

        logo: LOGO_FIELD,

        shortDescription: SHORT_DESCRIPTION_FIELD,

        developer: DEVELOPER_FIELD,

        partnerUrl: PARTNER_URL_FIELD,

        detailedDescription: APP_DETAILS_FIELD,

        appUrl: IFRAME_URL_FIELD,

        isHidden: IS_HIDDEN_FIELD,

        accessRights: {
            type: Relationship,
            ref: 'AcquiringIntegrationAccessRight.integration',
            many: true,
        },

        canGroupReceipts: {
            schemaDoc: 'Can multiple receipts be united through this acquiring',
            type: Checkbox,
            defaultValue: false,
            knexOptions: { isNotNullable: false },
            isRequired: true,
        },
        
        hostUrl: {
            schemaDoc: 'Url to acquiring integration service. Mobile devices will use it communicate with external acquiring. List of endpoints is the same for all of them.',
            type: Text,
            isRequired: true,
        },

        supportedBillingIntegrationsGroup: {
            adminDoc: 'To successfully complete the payment billing integration of the billing receipt should be supported by acquiring (supportedBillingIntegration should be the same as BillingReceipt.context.integration.group). Validations: Should be a sequence of lowercase latin characters. Should equal any BillingIntegration.group.',
            schemaDoc: 'Supported billing integrations group. Useful when you need to restrict this acquiring to accept payment only from certain billing.',
            type: Text,
            isRequired: true,
            defaultValue: DEFAULT_BILLING_INTEGRATION_GROUP,
        },

        explicitFeeDistributionSchema: {
            ...FEE_DISTRIBUTION_SCHEMA_FIELD,
            schemaDoc: 'Contains information about the default distribution of explicit fee. Each part is paid by the user on top of original amount if there is no part with the same name in the integration context. Otherwise, the part is ignored as it is paid by recipient',
        },
        displayPriority: DISPLAY_PRIORITY_FIELD,
        label: LABEL_FIELD,
        gallery: GALLERY_FIELD,
        price: PRICE_FIELD,
        contextDefaultStatus: CONTEXT_DEFAULT_STATUS_FIELD,
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadAcquiringIntegrations,
        create: access.canManageAcquiringIntegrations,
        update: access.canManageAcquiringIntegrations,
        delete: false,
        auth: true,
    },
    hooks: {
        afterChange: logoMetaAfterChange,
    },
})

module.exports = {
    AcquiringIntegration,
}
