/**
 * Generated by `createschema meter.MeterResource 'name:Text;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const faker = require('faker')
const { generateGQLTestUtils } = require('@condo/domains/common/utils/codegeneration/generate.test.utils')

const { MeterResource: MeterResourceGQL } = require('@condo/domains/meter/gql')
const { MeterReadingSource: MeterReadingSourceGQL } = require('@condo/domains/meter/gql')
const { Meter: MeterGQL } = require('@condo/domains/meter/gql')
const { MeterReading: MeterReadingGQL } = require('@condo/domains/meter/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const MeterResource = generateGQLTestUtils(MeterResourceGQL)
const MeterReadingSource = generateGQLTestUtils(MeterReadingSourceGQL)
const Meter = generateGQLTestUtils(MeterGQL)
const MeterReading = generateGQLTestUtils(MeterReadingGQL)
/* AUTOGENERATE MARKER <CONST> */

async function createTestMeterResource (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await MeterResource.create(client, attrs)
    return [obj, attrs]
}

async function updateTestMeterResource (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await MeterResource.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestMeterReadingSource (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await MeterReadingSource.create(client, attrs)
    return [obj, attrs]
}

async function updateTestMeterReadingSource (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await MeterReadingSource.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestMeter (client, organization, property, resource, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!organization || !organization.id) throw new Error('no organization.id')
    if (!property || !property.id) throw new Error('no property.id')
    if (!resource || !resource.id) throw new Error('no resource.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    const accountNumber = faker.random.alphaNumeric(8)

    const attrs = {
        dv: 1,
        sender,
        number: faker.random.alphaNumeric(5),
        unitName: faker.random.alphaNumeric(5),
        organization: { connect: { id: organization.id } },
        property: { connect: { id: property.id } },
        resource: { connect: { id: resource.id } },
        accountNumber,
        numberOfTariffs: 1,
        ...extraAttrs,
    }
    const obj = await Meter.create(client, attrs)
    return [obj, attrs]
}

async function updateTestMeter (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await Meter.update(client, id, attrs)
    return [obj, attrs]
}

async function createTestMeterReading (client, meter, organization, source, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!meter || !meter.id) throw new Error('no meter.id')
    if (!organization || !organization.id) throw new Error('no organization.id')
    if (!source || !source.id) throw new Error('no source.id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        meter: { connect: { id: meter.id } },
        organization: { connect: { id: organization.id } },
        source: { connect: { id: source.id } },
        date: faker.date.recent(),
        value1: '888.00',
        ...extraAttrs,
    }
    const obj = await MeterReading.create(client, attrs)
    return [obj, attrs]
}

async function updateTestMeterReading (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await MeterReading.update(client, id, attrs)
    return [obj, attrs]
}

/* AUTOGENERATE MARKER <FACTORY> */

module.exports = {
    MeterResource, createTestMeterResource, updateTestMeterResource,
    MeterReadingSource, createTestMeterReadingSource, updateTestMeterReadingSource,
    Meter, createTestMeter, updateTestMeter,
    MeterReading, createTestMeterReading, updateTestMeterReading,
/* AUTOGENERATE MARKER <EXPORTS> */
}
