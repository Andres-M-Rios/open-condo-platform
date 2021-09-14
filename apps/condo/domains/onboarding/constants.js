/**
 * Generated by `createschema onboarding.OnBoarding 'completed:Checkbox; stepsTransitions:Json;'`
 */
const ADMINISTRATOR = 'ADMINISTRATOR'
const ONBOARDING_TYPES = [ADMINISTRATOR]

const DEFAULT_ADMINISTRATOR_ONBOADRING_STEPS = [
    {
        icon: 'organization',
        required: true,
        action: 'create',
        entity: 'Organization',
        order: 1,
    },
    {
        icon: 'house',
        required: true,
        action: 'create',
        entity: 'Property',
        order: 2,
    },
    {
        icon: 'user',
        required: true,
        action: 'create',
        entity: 'OrganizationEmployee',
        order: 3,
    },
    {
        icon: 'division',
        action: 'create',
        entity: 'Division',
        order: 4,
    },
    {
        icon: 'chat',
        action: 'create',
        entity: 'Squad', // should be renamed
        order: 5,
    },
    {
        icon: 'billing',
        action: 'create',
        entity: 'BillingAccount',
        order: 6,
    },
    {
        icon: 'creditCard',
        action: 'create',
        entity: 'Acquiring',
        order: 7,
    },
]

const DEFAULT_ADMINISTRATOR_STEPS_TRANSITION = {
    'create.Organization': [
        'create.Property',
        'create.OrganizationEmployee',
    ],
    'create.Property': [],
    'create.OrganizationEmployee': [
        'create.Division',
    ],
    'create.Division': [],
}

const ONBOARDING_STEPS = {
    [ADMINISTRATOR]: {
        steps: DEFAULT_ADMINISTRATOR_ONBOADRING_STEPS,
        transitions: DEFAULT_ADMINISTRATOR_STEPS_TRANSITION,
    },
}

module.exports = {
    ADMINISTRATOR,
    ONBOARDING_TYPES,
    ONBOARDING_STEPS,
}
