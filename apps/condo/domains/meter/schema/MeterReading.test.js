/**
 * Generated by `createschema meter.MeterReading 'organization:Relationship:Organization:CASCADE; property:Relationship:Property:CASCADE; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; date:DateTimeUtc; meter:Relationship:Meter:CASCADE; value:Integer; source:Relationship:MeterReadingSource:PROTECT'`
 */

const { BILLING_SOURCE_ID } = require('@condo/domains/meter/constants/constants')
const { catchErrorFrom } = require('@condo/domains/common/utils/testSchema')
const { CALL_METER_READING_SOURCE_ID } = require('../constants/constants')
const { COLD_WATER_METER_RESOURCE_ID } = require('../constants/constants')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')
const { expectToThrowAuthenticationErrorToObjects } = require('@condo/domains/common/utils/testSchema')
const { expectToThrowAuthenticationErrorToObj, expectToThrowAccessDeniedErrorToObj } = require('@condo/domains/common/utils/testSchema')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestResident } = require('@condo/domains/resident/utils/testSchema')
const { makeClientWithResidentUserAndProperty } = require('@condo/domains/property/utils/testSchema')
const { updateTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganizationEmployeeRole } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganizationWithAccessToAnotherOrganization } = require('@condo/domains/organization/utils/testSchema')
const { createTestMeter } = require('../utils/testSchema')
const { MeterResource, MeterReadingSource, MeterReading } = require('../utils/testSchema')
const { makeEmployeeUserClientWithAbilities } = require('@condo/domains/organization/utils/testSchema')
const { makeLoggedInAdminClient, makeClient, UUID_RE } = require('@core/keystone/test.utils')
const { createTestMeterReading, updateTestMeterReading } = require('../utils/testSchema')

describe('MeterReading', () => {
    describe('Create', () => {
        test('employee with canManageMeters role: can create MeterReadings', async () => {
            const client = await makeEmployeeUserClientWithAbilities({
                canManageMeters: true,
            })
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(client, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(client, client.organization, client.property, resource, {})

            const [meterReading] = await createTestMeterReading(client, meter,  client.property, client.organization, source)

            expect(meterReading.id).toMatch(UUID_RE)
        })

        test('employee with canManageMeters role: cannot create MeterReading with value less then previous reading', async () => {
            const client = await makeEmployeeUserClientWithAbilities({
                canManageMeters: true,
            })
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [callSource] = await MeterReadingSource.getAll(client, { id: CALL_METER_READING_SOURCE_ID })
            const [billingSource] = await MeterReadingSource.getAll(client, { id: BILLING_SOURCE_ID })
            const [meter] = await createTestMeter(client, client.organization, client.property, resource, {})

            const [meterReading] = await createTestMeterReading(client, meter,  client.property, client.organization, billingSource)

            const oldValue = meterReading.value1
            const newValue = oldValue - 100

            await catchErrorFrom(async () => {
                await createTestMeterReading(client, meter,  client.property, client.organization, callSource, { value1: newValue })
            }, ({ errors, data }) => {
                expect(errors[0].message).toMatch('You attempted to perform an invalid mutation')
                expect(errors[0].data.messages[0]).toContain('Meter reading value less than previous')
                expect(data).toEqual({ 'obj': null })
            })
        })

        test('employee without "canManageMeters" role: cannot create MeterReadings', async () => {
            const admin = await makeLoggedInAdminClient()
            const client = await makeEmployeeUserClientWithAbilities()
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(client, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(admin, client.organization, client.property, resource, {})

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestMeterReading(client, meter,  client.property, client.organization, source)
            })
        })

        test('employee from "from" related organization with "canManageMeters" role: can create MeterReadings', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientFrom, employeeFrom, organizationFrom, organizationTo, propertyTo } = await createTestOrganizationWithAccessToAnotherOrganization()
            const [role] = await createTestOrganizationEmployeeRole(admin, organizationFrom, {
                canManageMeters: true,
            })
            await updateTestOrganizationEmployee(admin, employeeFrom.id, {
                role: { connect: { id: role.id } },
            })
            const [resource] = await MeterResource.getAll(clientFrom, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(clientFrom, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(clientFrom, organizationTo, propertyTo, resource, {})

            const [meterReading] = await createTestMeterReading(clientFrom, meter, propertyTo, organizationTo, source)

            expect(meterReading.id).toMatch(UUID_RE)
        })

        test('employee from "from" related organization without "canManageMeters" role: cannot create MeterReadings', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientFrom, organizationTo, propertyTo } = await createTestOrganizationWithAccessToAnotherOrganization()
            const [resource] = await MeterResource.getAll(clientFrom, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(admin, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(admin, organizationTo, propertyTo, resource, {})

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestMeterReading(clientFrom, meter, propertyTo, organizationTo, source)
            })
        })

        test('resident: can create MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClientWithResidentUserAndProperty()
            await createTestResident(adminClient, client.user, client.organization, client.property)
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(adminClient, client.organization, client.property, resource, {})

            const [meterReading] = await createTestMeterReading(client, meter, client.property, client.organization, source)

            expect(meterReading.id).toMatch(UUID_RE)
        })

        test('resident: cannot create MeterReadings in other organization', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClientWithResidentUserAndProperty()
            await createTestResident(adminClient, client.user, client.organization, client.property)
            const [organization] = await createTestOrganization(adminClient)
            const [property] = await createTestProperty(adminClient, organization)
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {})

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestMeterReading(client, meter, property, organization, source)
            })
        })

        test('user: cannot create MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClientWithProperty()
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(adminClient, client.organization, client.property, resource, {})

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestMeterReading(client, meter, client.property, client.organization, source)
            })
        })

        test('anonymous: cannot create MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClient()
            const [organization] = await createTestOrganization(adminClient)
            const [property] = await createTestProperty(adminClient, organization)
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {})

            await expectToThrowAuthenticationErrorToObj(async () => {
                await createTestMeterReading(client, meter, property, organization, source)
            })
        })

        test('admin: can create MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const [organization] = await createTestOrganization(adminClient)
            const [property] = await createTestProperty(adminClient, organization)
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {})

            const [meterReading] = await createTestMeterReading(adminClient, meter, property, organization, source)

            expect(meterReading.id).toMatch(UUID_RE)
        })
    })
    describe('Update', () => {
        test('employee with canManageMeters role: cannot update MeterReadings', async () => {
            const client = await makeEmployeeUserClientWithAbilities({
                canManageMeters: true,
            })
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(client, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(client, client.organization, client.property, resource, {})
            const [meterReading] = await createTestMeterReading(client, meter, client.property, client.organization, source)

            const oldValue = meterReading.value1
            const newValue = oldValue + 100

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestMeterReading(client, meterReading.id, {
                    value1: newValue,
                })
            })
        })

        test('employee without "canManageMeters" role: cannot update MeterReadings', async () => {
            const admin = await makeLoggedInAdminClient()
            const client = await makeEmployeeUserClientWithAbilities()
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(client, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(admin, client.organization, client.property, resource, {})
            const [meterReading] = await createTestMeterReading(admin, meter, client.property, client.organization, source)

            const oldValue = meterReading.value1
            const newValue = oldValue + 100

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestMeterReading(client, meterReading.id, {
                    value1: newValue,
                })
            })
        })

        test('employee from "from" related organization: cannot update MeterReadings', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientFrom, employeeFrom, organizationFrom, organizationTo, propertyTo } = await createTestOrganizationWithAccessToAnotherOrganization()
            const [role] = await createTestOrganizationEmployeeRole(admin, organizationFrom, {
                canManageMeters: true,
            })
            await updateTestOrganizationEmployee(admin, employeeFrom.id, {
                role: { connect: { id: role.id } },
            })
            const [resource] = await MeterResource.getAll(clientFrom, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(clientFrom, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(clientFrom, organizationTo, propertyTo, resource, {})

            const [meterReading] = await createTestMeterReading(clientFrom, meter, propertyTo, organizationTo, source)

            const oldValue = meterReading.value1
            const newValue = oldValue + 100

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestMeterReading(clientFrom, meterReading.id, {
                    value1: newValue,
                })
            })
        })

        test('resident: cannot update MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClientWithResidentUserAndProperty()
            await createTestResident(adminClient, client.user, client.organization, client.property)
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(adminClient, client.organization, client.property, resource, {})
            const [meterReading] = await createTestMeterReading(client, meter, client.property, client.organization, source)

            const oldValue = meterReading.value1
            const newValue = oldValue + 100
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestMeterReading(client, meterReading.id, {
                    value1: newValue,
                })
            })
        })

        test('user: cannot update MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClientWithProperty()
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(adminClient, client.organization, client.property, resource, {})
            const [meterReading] = await createTestMeterReading(adminClient, meter, client.property, client.organization, source)

            const oldValue = meterReading.value1
            const newValue = oldValue + 100
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestMeterReading(client, meterReading.id, {
                    value1: newValue,
                })
            })
        })

        test('anonymous: cannot update MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClient()
            const [organization] = await createTestOrganization(adminClient)
            const [property] = await createTestProperty(adminClient, organization)
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {})
            const [meterReading] = await createTestMeterReading(adminClient, meter, property, organization, source)

            const oldValue = meterReading.value1
            const newValue = oldValue + 100
            await expectToThrowAuthenticationErrorToObj(async () => {
                await updateTestMeterReading(client, meterReading.id, {
                    value1: newValue,
                })
            })
        })

        test('admin: can update MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const [organization] = await createTestOrganization(adminClient)
            const [property] = await createTestProperty(adminClient, organization)
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {})
            const [meterReading] = await createTestMeterReading(adminClient, meter, property, organization, source)

            const oldValue = meterReading.value1
            const newValue = oldValue + 100
            const [updatedMeterReading] = await updateTestMeterReading(adminClient, meterReading.id, {
                value1: newValue,
            })

            expect(updatedMeterReading.id).toMatch(UUID_RE)
            expect(updatedMeterReading.value1).toEqual(newValue)
        })
    })
    describe('Read', () => {
        test('employee: can read MeterReadings', async () => {
            const admin = await makeLoggedInAdminClient()
            const client = await makeEmployeeUserClientWithAbilities({})
            const [resource] = await MeterResource.getAll(admin, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(admin, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(admin, client.organization, client.property, resource, {})

            const [meterReading] = await createTestMeterReading(admin, meter,  client.property, client.organization, source)

            const meterReadings = await MeterReading.getAll(client, { id: meterReading.id })
            expect(meterReadings).toHaveLength(1)
        })

        test('employee from "from" related organization: can read MeterReadings', async () => {
            const admin = await makeLoggedInAdminClient()
            const { clientFrom, organizationTo, propertyTo } = await createTestOrganizationWithAccessToAnotherOrganization()
            const [resource] = await MeterResource.getAll(admin, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(admin, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(admin, organizationTo, propertyTo, resource, {})

            const [meterReading] = await createTestMeterReading(admin, meter, propertyTo, organizationTo, source)

            const meterReadings = await MeterReading.getAll(clientFrom, { id: meterReading.id })
            expect(meterReadings).toHaveLength(1)
        })

        test('resident: can read his own MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClientWithResidentUserAndProperty()
            await createTestResident(adminClient, client.user, client.organization, client.property)
            const [resource] = await MeterResource.getAll(client, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(adminClient, client.organization, client.property, resource, {})

            const [meterReading] = await createTestMeterReading(client, meter, client.property, client.organization, source)

            const meterReadings = await MeterReading.getAll(client, { id: meterReading.id })
            expect(meterReadings).toHaveLength(1)
        })

        test('resident: cannot read not his own MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client1 = await makeClientWithResidentUserAndProperty()
            await createTestResident(adminClient, client1.user, client1.organization, client1.property)
            const client2 = await makeClientWithResidentUserAndProperty()
            await createTestResident(adminClient, client2.user, client2.organization, client2.property)
            const [resource] = await MeterResource.getAll(client1, { id: COLD_WATER_METER_RESOURCE_ID })
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [meter] = await createTestMeter(adminClient, client1.organization, client1.property, resource, {})

            const [meterReading] = await createTestMeterReading(client1, meter, client1.property, client1.organization, source)

            const meterReadings = await MeterReading.getAll(client2, { id: meterReading.id })
            expect(meterReadings).toHaveLength(0)
        })

        test('user: cannot read MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClientWithNewRegisteredAndLoggedInUser()
            const [organization] = await createTestOrganization(adminClient)
            const [property] = await createTestProperty(adminClient, organization)
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {})
            const [meterReading] = await createTestMeterReading(adminClient, meter, property, organization, source)

            const meterReadings = await MeterReading.getAll(client, { id: meterReading.id })
            expect(meterReadings).toHaveLength(0)
        })

        test('anonymous: cannot read MeterReadings', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const client = await makeClient()
            const [organization] = await createTestOrganization(adminClient)
            const [property] = await createTestProperty(adminClient, organization)
            const [source] = await MeterReadingSource.getAll(adminClient, { id: CALL_METER_READING_SOURCE_ID })
            const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
            const [meter] = await createTestMeter(adminClient, organization, property, resource, {})
            const [meterReading] = await createTestMeterReading(adminClient, meter, property, organization, source)

            await expectToThrowAuthenticationErrorToObjects(async () => {
                await MeterReading.getAll(client, { id: meterReading.id })
            })
        })
    })
})
