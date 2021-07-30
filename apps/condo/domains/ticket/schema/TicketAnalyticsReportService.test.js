/**
 * Generated by `createservice ticket.TicketAnalyticsReportService`
 */

const { TICKET_ANALYTICS_REPORT_MUTATION } = require(('@condo/domains/ticket/gql'))
const moment = require('moment')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestTicket, makeClientWithTicket } = require('@condo/domains/ticket/utils/testSchema')
const { TICKET_STATUS_TYPES } = require('@condo/domains/ticket/constants')
const { makeClient } = require('@core/keystone/test.utils')
const DATE_FORMAT = 'DD.MM.YYYY'
const NOW_DATE = moment().format(DATE_FORMAT)

describe('TicketAnalyticsReportService', () => {
    describe('User', () => {
        it('can read TicketAnalyticsReportService grouped counts [day, status]', async () => {
            const client = await makeClientWithTicket()
            const dateStart = moment().startOf('week')
            const dateEnd = moment().endOf('week')
            const { data: { result: { result } } } = await client.query(TICKET_ANALYTICS_REPORT_MUTATION, {
                dv: 1,
                sender: { dv: 1, fingerprint: 'tests' },
                data: {
                    where: {
                        organization: { id: client.organization.id },
                        AND: [
                            { createdAt_gte: dateStart.toISOString() },
                            { createdAt_lte: dateEnd.toISOString() },
                        ],
                    },
                    groupBy: [ 'day', 'status' ],
                },
            })
            expect(result).toBeDefined()
            expect(Object.keys(result)).toStrictEqual([NOW_DATE])
            expect(Object.values(result[NOW_DATE])).toHaveLength(TICKET_STATUS_TYPES.length)
        })

        it('can read TicketAnalyticsReportService grouped counts [status, day]', async () => {
            const client = await makeClientWithProperty()
            await createTestTicket(client, client.organization, client.property)
            await createTestTicket(client, client.organization, client.property, { isPaid: true })
            await createTestTicket(client, client.organization, client.property, { isEmergency: true })
            const dateStart = moment().startOf('week')
            const dateEnd = moment().endOf('week')
            const { data: { result: { result } } } = await client.query(TICKET_ANALYTICS_REPORT_MUTATION, {
                dv: 1,
                sender: { dv: 1, fingerprint: 'tests' },
                data: {
                    where: {
                        organization: { id: client.organization.id },
                        AND: [
                            { createdAt_gte: dateStart.toISOString() },
                            { createdAt_lte: dateEnd.toISOString() },
                            { isEmergency: true },
                        ],
                    },
                    groupBy: [ 'status', 'day' ],
                },
            })
            const ticketCountMap = Object.values(result).flatMap(dateGroup => Object.values(dateGroup))
            expect(result).toBeDefined()
            expect(ticketCountMap.some(count => count === 1)).toBe(true)
            expect(ticketCountMap.every(count => (count <= 1))).toBe(true)
        })

        it('can read TicketAnalyticsReportService groupped with property filter', async () => {
            const client = await makeClientWithProperty()
            await createTestTicket(client, client.organization, client.property)
            await createTestTicket(client, client.organization, client.property, { isPaid: true })
            await createTestTicket(client, client.organization, client.property, { isEmergency: true })

            const dateStart = moment().startOf('week')
            const dateEnd = moment().endOf('week')
            const { data: { result: { result } } } = await client.query(TICKET_ANALYTICS_REPORT_MUTATION, {
                dv: 1,
                sender: { dv: 1, fingerprint: 'tests' },
                data: {
                    where: {
                        organization: { id: client.organization.id },
                        AND: [
                            { createdAt_gte: dateStart.toISOString() },
                            { createdAt_lte: dateEnd.toISOString() },
                            { property: { id_in: [ client.property.id ] } },
                            { isPaid: false },
                            { isEmergency: false },
                        ],
                    },
                    groupBy: [ 'day', 'status' ],
                },
            })
            expect(result).toBeDefined()
            const countsMap = Object.values(result).flatMap(obj => Object.values(obj))
            expect(countsMap.some(e =>  e === 1)).toBe(true)
            expect(countsMap.filter(e => e === 1)).toHaveLength(1)
        })

        it('can not read TicketAnalyticsReportService from another organization', async () => {
            const client = await makeClientWithProperty()
            await createTestTicket(client, client.organization, client.property)
            const wrongClient = await makeClientWithProperty()
            const dateStart = moment().startOf('week')
            const dateEnd = moment().endOf('week')
            const { data: { result: { result: emptyResult } } } = await wrongClient.query(TICKET_ANALYTICS_REPORT_MUTATION, {
                dv: 1,
                sender: { dv:1, fingerprint: 'tests' },
                data: {
                    where: {
                        organization: { id: wrongClient.organization.id },
                        AND: [
                            { createdAt_gte: dateStart.toISOString() },
                            { createdAt_lte: dateEnd.toISOString() },
                        ],
                    },
                    groupBy: [ 'day', 'status' ],
                },
            })

            const { data: { result: { result } } } = await client.query(TICKET_ANALYTICS_REPORT_MUTATION, {
                dv: 1,
                sender: { dv:1, fingerprint: 'tests' },
                data: {
                    where: {
                        organization: { id: client.organization.id },
                        AND: [
                            { createdAt_gte: dateStart.toISOString() },
                            { createdAt_lte: dateEnd.toISOString() },
                        ],
                    },
                    groupBy: [ 'day', 'status' ],
                },
            })

            expect(emptyResult).toMatchObject({})
            expect(Object.keys(result)).toStrictEqual([NOW_DATE])
            expect(Object.values(result[NOW_DATE])).toHaveLength(TICKET_STATUS_TYPES.length)
        })
    })

    describe('Anonymous', () => {
        it('can not read TicketAnalyticsReportService', async () => {
            const client = await makeClient()
            const clientWithProperty = await makeClientWithProperty()
            const dateStart = moment().startOf('week')
            const dateEnd = moment().endOf('week')
            const { errors, data: { result } } = await client.query(TICKET_ANALYTICS_REPORT_MUTATION, {
                dv: 1, sender: { dv: 1, fingerprint: 'tests' },
                data: {
                    where: {
                        organization: { id: clientWithProperty.organization.id },
                        AND: [
                            { createdAt_gte: dateStart.toISOString() },
                            { createdAt_lte: dateEnd.toISOString() },
                        ],
                    },
                    groupBy: [ 'day', 'status' ],
                },
            })
            expect(result).toBeNull()
            expect(errors).toHaveLength(1)
            expect(errors[0].name).toEqual('AuthenticationError')
        })
    })
})
