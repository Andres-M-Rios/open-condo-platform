/**
 * Generated by `createschema onboarding.OnBoardingStep 'icon:Text; title:Text; description:Text; action:Select:create,read,update,delete; entity:Text; onBoarding:Relationship:OnBoarding:SET_NULL;'`
 */

const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const get = require('lodash/get')
const { getById } = require('@condo/keystone/schema')

async function canReadOnBoardingSteps ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    return {
        onBoarding: { user: { id: user.id } },
    }
}

async function canManageOnBoardingSteps ({ authentication: { item: user }, itemId, operation, originalInput }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (operation === 'create') {
        const onBoardingId = get(originalInput, ['onBoarding', 'connect', 'id'])
        if (!onBoardingId) return false
        const onboarding = await getById('OnBoarding', onBoardingId)
        return onboarding.user === user.id
    } else if (operation === 'update') {
        const obj = await getById('OnBoardingStep', itemId)
        if (!obj || !obj.onBoarding) return false
        const onboarding = await getById('OnBoarding', obj.onBoarding)
        if (!onboarding || !onboarding.user) return false
        return onboarding.user === user.id
    }
    return true
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadOnBoardingSteps,
    canManageOnBoardingSteps,
}
