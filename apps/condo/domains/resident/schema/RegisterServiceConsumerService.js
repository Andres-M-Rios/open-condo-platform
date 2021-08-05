/**
 * Generated by `createservice resident.RegisterServiceConsumerService --type mutations`
 */

const { getById, GQLCustomSchema } = require('@core/keystone/schema')
const access = require('@condo/domains/resident/access/RegisterServiceConsumerService')
const { Organization } = require('@condo/domains/organization/utils/serverSchema')
const { BillingIntegrationOrganizationContext, BillingAccount } = require('@condo/domains/billing/utils/serverSchema')
const { ServiceConsumer, Resident } = require('../utils/serverSchema')
const { NOT_FOUND_ERROR } = require('@condo/domains/common/constants/errors')


const RegisterServiceConsumerService = new GQLCustomSchema('RegisterServiceConsumerService', {
    types: [
        {
            access: true,
            type: 'input RegisterServiceConsumerInput { dv: Int!, sender: JSON!, residentId: ID!, unitName: String!, accountNumber: String! }',
        },
    ],

    mutations: [
        {
            schemaDoc: 'This mutation tries to create service consumer',
            access: access.canRegisterServiceConsumer,
            schema: 'registerServiceConsumer(data: RegisterServiceConsumerInput!): ServiceConsumer',
            resolver: async (parent, args, context, info, extra = {}) => {
                const { data: { dv, sender, residentId, unitName, accountNumber } } = args

                const attrs = {
                    dv,
                    sender,
                    resident: { connect: { id: residentId } },
                    accountNumber: accountNumber,
                }

                const [resident] = await Resident.getAll(context, {
                    id: residentId,
                })
                if (!resident) {
                    throw new Error(`${NOT_FOUND_ERROR}resident] Resident not found for this user`)
                }

                const [userOrganization] = await Organization.getAll(context, {
                    id : resident.organization.id,
                })
                if (!userOrganization) {
                    throw new Error(`${NOT_FOUND_ERROR}organization] Organization not found for this user, we can't connect ServiceConsumer to global context yet!`)
                }

                const [billingContext] = await BillingIntegrationOrganizationContext.getAll(context, {
                    organization: { id: resident.organization.id },
                })
                if (!billingContext) {
                    throw new Error(`${NOT_FOUND_ERROR}context] BillingIntegrationOrganizationContext not found for this user, we can't connect ServiceConsumer to global context yet!`)
                }

                const applicableBillingAccounts = await BillingAccount.getAll(context, {
                    context: { id: billingContext.id },
                    unitName: unitName,
                })
                if (!Array.isArray(applicableBillingAccounts) || applicableBillingAccounts.length === 0) {
                    throw new Error(`${NOT_FOUND_ERROR}account] BillingAccount not found for this user`)
                }

                applicableBillingAccounts.filter(
                    (billingAccount) => {
                        return accountNumber === billingAccount.number || accountNumber === billingAccount.globalId
                    }
                )

                // todo (toplenboren) learn what to do if there are a lot of applicable billing accounts
                attrs.billingAccount = { connect: { id: applicableBillingAccounts[0].id } }

                const serviceConsumer = await ServiceConsumer.create(context, attrs)

                // Hack that helps to resolve all subfields in result of this mutation
                return await getById('ServiceConsumer', serviceConsumer.id)
            },
        },
    ],
    
})

module.exports = {
    RegisterServiceConsumerService,
}
