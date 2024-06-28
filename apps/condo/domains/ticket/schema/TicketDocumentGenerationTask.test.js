/**
 * Generated by `createschema ticket.TicketDocumentGenerationTask 'where:Json; status:Select:processing,completed,error,cancelled; format:Select:docx; progress:Integer; user:Relationship:User:CASCADE; timeZone:Text; file?:File; documentType:Select:completion; meta?:Json;'`
 */

const { faker } = require('@faker-js/faker')

const {
    makeLoggedInAdminClient, makeClient, DATETIME_RE,
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects, waitFor, expectToThrowGQLError,
    catchErrorFrom,
} = require('@open-condo/keystone/test.utils')

const { DEFAULT_ORGANIZATION_TIMEZONE } = require('@condo/domains/organization/constants/common')
const { makeEmployeeUserClientWithAbilities, updateTestOrganization, createTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')
const {
    TICKET_DOCUMENT_GENERATION_TASK_STATUS,
    TICKET_DOCUMENT_GENERATION_TASK_FORMAT,
    TICKET_DOCUMENT_TYPE,
} = require('@condo/domains/ticket/constants/ticketDocument')
const {
    TicketDocumentGenerationTask, createTestTicketDocumentGenerationTask, updateTestTicketDocumentGenerationTask,
    createTestTicket,
} = require('@condo/domains/ticket/utils/testSchema')
const { makeClientWithResidentUser, makeClientWithServiceUser, makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')

const { ERRORS } = require('./TicketDocumentGenerationTask')


describe('TicketDocumentGenerationTask', () => {
    let admin, support, staff, secondStaff, resident, serviceUser, anonymous,
        organization, o10nWithoutAccess,
        ticket, ticketFromO10nWithoutAccess

    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        support = await makeClientWithSupportUser()
        anonymous = await makeClient()

        resident = await makeClientWithResidentUser()
        serviceUser = await makeClientWithServiceUser()

        staff = await makeEmployeeUserClientWithAbilities({
            canReadTickets: true,
        })
        organization = staff.organization
        await updateTestOrganization(admin, organization.id, { country: 'ru' });
        [ticket] = await createTestTicket(admin, organization, staff.property)

        secondStaff = await makeEmployeeUserClientWithAbilities({
            canReadTickets: false,
        })
        o10nWithoutAccess = secondStaff.organization
        await updateTestOrganization(admin, o10nWithoutAccess.id, { country: 'ru' });
        [ticketFromO10nWithoutAccess] = await createTestTicket(admin, o10nWithoutAccess, secondStaff.property)
        await createTestOrganizationEmployee(admin, o10nWithoutAccess, staff.user, secondStaff.role, { isAccepted: true })
        await createTestOrganizationEmployee(admin, organization, secondStaff.user, staff.role, { isAccepted: true })
    })

    describe('Accesses', () => {
        describe('Admin', () => {
            let task

            beforeAll(async () => {
                [task] = await createTestTicketDocumentGenerationTask(admin, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })
            })

            test('can create for any user', async () => {
                expect(task).toHaveProperty('ticket', { id: ticket.id })
                expect(task).toHaveProperty('status', TICKET_DOCUMENT_GENERATION_TASK_STATUS.PROCESSING)
                expect(task).toHaveProperty('format', TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX)
                expect(task).toHaveProperty('progress', 0)
                expect(task).toHaveProperty('user', { id: staff.user.id })
                expect(task).toHaveProperty('timeZone', DEFAULT_ORGANIZATION_TIMEZONE)
                expect(task).toHaveProperty('file', null)
                expect(task).toHaveProperty('documentType', TICKET_DOCUMENT_TYPE.COMPLETION_WORKS)
                expect(task).toHaveProperty('meta', null)
            })

            test('can read any task', async () => {
                const foundedTask = await TicketDocumentGenerationTask.getOne(admin, {
                    id: task.id,
                })
                expect(foundedTask).toHaveProperty('id', task.id)
            })

            test('can update any task', async () => {
                const [task] = await createTestTicketDocumentGenerationTask(admin, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })

                // NOTE: we cannot guarantee that the task has been cancelled
                // because the task completion may happen very quickly before we send the task cancellation request
                await waitFor(async () => {
                    const foundedTask = await TicketDocumentGenerationTask.getOne(admin, { id: task.id })
                    expect(foundedTask).toHaveProperty('status', TICKET_DOCUMENT_GENERATION_TASK_STATUS.COMPLETED)
                })

                await expectToThrowGQLError(async () => {
                    await updateTestTicketDocumentGenerationTask(admin, task.id, {
                        status: TICKET_DOCUMENT_GENERATION_TASK_STATUS.CANCELLED,
                    })
                }, ERRORS.STATUS_IS_ALREADY_COMPLETED)
            })

            test('cannot delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.delete(admin, task.id)
                })
            })

            test('can soft-delete any task', async () => {
                const [deletedTask] = await TicketDocumentGenerationTask.softDelete(admin, task.id)
                expect(deletedTask.deletedAt).toMatch(DATETIME_RE)
            })
        })

        describe('Support', () => {
            let task

            beforeAll(async () => {
                [task] = await createTestTicketDocumentGenerationTask(admin, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })
            })

            test('cannot create for other user', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestTicketDocumentGenerationTask(support, staff.user, {
                        ticket: { connect: { id: ticket.id } },
                        format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                        documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                    })
                })
            })

            test('cannot read any task', async () => {
                const foundedTask = await TicketDocumentGenerationTask.getOne(support, {
                    id: task.id,
                })
                expect(foundedTask).toBeUndefined()
            })

            test('cannot update any task', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestTicketDocumentGenerationTask(support, task.id, {
                        status: TICKET_DOCUMENT_GENERATION_TASK_STATUS.CANCELLED,
                    })
                })
            })

            test('cannot delete any task', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.delete(support, task.id)
                })
            })

            test('cannot soft-delete any task', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.softDelete(support, task.id)
                })
            })
        })

        describe('Staff', () => {
            let task

            beforeAll(async () => {
                [task] = await createTestTicketDocumentGenerationTask(staff, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })
            })

            test('can create for self if has canReadTickets: true', async () => {
                expect(task).toBeDefined()
            })
            test('cannot create for other user', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestTicketDocumentGenerationTask(staff, secondStaff.user, {
                        ticket: { connect: { id: ticket.id } },
                        format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                        documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                    })
                })
            })
            test('cannot create with filter for ticket in another organization', async () => {
                const client = await makeEmployeeUserClientWithAbilities()
                const otherOrganization = client.organization
                const [ticketFromOtherO10n] = await createTestTicket(admin, otherOrganization, client.property)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestTicketDocumentGenerationTask(staff, staff.user, {
                        ticket: { connect: { id: ticketFromOtherO10n.id } },
                        format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                        documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                    })
                })
            })
            test('cannot create if employee has not canReadTickets: true', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestTicketDocumentGenerationTask(staff, staff.user, {
                        ticket: { connect: { id: ticketFromO10nWithoutAccess.id } },
                        format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                        documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                    })
                })
            })

            test('can read its task', async () => {
                const foundedTask = await TicketDocumentGenerationTask.getOne(staff, {
                    id: task.id,
                })
                expect(foundedTask).toHaveProperty('id', task.id)
            })
            test('cannot read other user\'s task', async () => {
                const [taskWithOtherUser] = await createTestTicketDocumentGenerationTask(secondStaff, secondStaff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })
                const foundedTask = await TicketDocumentGenerationTask.getOne(staff, {
                    id: taskWithOtherUser.id,
                })
                expect(foundedTask).toBeUndefined()
            })

            test('can update its task status to cancel', async () => {
                const [task] = await createTestTicketDocumentGenerationTask(staff, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })

                // NOTE: we cannot guarantee that the task has been cancelled
                // because the task completion may happen very quickly before we send the task cancellation request
                await waitFor(async () => {
                    const foundedTask = await TicketDocumentGenerationTask.getOne(staff, { id: task.id })
                    expect(foundedTask).toHaveProperty('status', TICKET_DOCUMENT_GENERATION_TASK_STATUS.COMPLETED)
                })

                await expectToThrowGQLError(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        status: TICKET_DOCUMENT_GENERATION_TASK_STATUS.CANCELLED,
                    })
                }, ERRORS.STATUS_IS_ALREADY_COMPLETED)
            })
            test('cannot update any fields except status for its task', async () => {
                const [task] = await createTestTicketDocumentGenerationTask(staff, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })

                await catchErrorFrom(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        ticket: { connect: { id: ticketFromO10nWithoutAccess.id } },
                    })
                }, (e) => {
                    expect(e.errors[0].message).toContain('Field "ticket" is not defined by type "TicketDocumentGenerationTaskUpdateInput"')
                })

                await catchErrorFrom(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    })
                }, (e) => {
                    expect(e.errors[0].message).toContain('Field "format" is not defined by type "TicketDocumentGenerationTaskUpdateInput"')
                })

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        progress: 10,
                    })
                })

                await catchErrorFrom(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        user: { connect: { id: secondStaff.user.id } },
                    })
                }, (e) => {
                    expect(e.errors[0].message).toContain('Field "user" is not defined by type "TicketDocumentGenerationTaskUpdateInput"')
                })

                await catchErrorFrom(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        timeZone: 'America/Toronto',
                    })
                }, (e) => {
                    expect(e.errors[0].message).toContain('Field "timeZone" is not defined by type "TicketDocumentGenerationTaskUpdateInput"')
                })

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        file: null,
                    })
                })

                await catchErrorFrom(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                    })
                }, (e) => {
                    expect(e.errors[0].message).toContain('Field "documentType" is not defined by type "TicketDocumentGenerationTaskUpdateInput"')
                })

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        meta: { [faker.random.word()]: faker.random.word() },
                    })
                })
            })
            test('cannot update other user\'s task', async () => {
                const [task] = await createTestTicketDocumentGenerationTask(secondStaff, secondStaff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestTicketDocumentGenerationTask(staff, task.id, {
                        status: TICKET_DOCUMENT_GENERATION_TASK_STATUS.CANCELLED,
                    })
                })
            })

            test('cannot delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.delete(staff, task.id)
                })
            })

            test('cannot soft-delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.softDelete(staff, task.id)
                })
            })
        })

        describe('Resident', () => {
            let task

            beforeAll(async () => {
                [task] = await createTestTicketDocumentGenerationTask(admin, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })
            })

            test('cannot create', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestTicketDocumentGenerationTask(resident, staff.user, {
                        ticket: { connect: { id: ticket.id } },
                        format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                        documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                    })
                })
            })

            test('cannot read', async () => {
                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await TicketDocumentGenerationTask.getOne(resident, {
                        id: task.id,
                    })
                })
            })

            test('cannot update', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestTicketDocumentGenerationTask(resident, task.id, {
                        status: TICKET_DOCUMENT_GENERATION_TASK_STATUS.CANCELLED,
                    })
                })
            })

            test('cannot delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.delete(resident, task.id)
                })
            })

            test('cannot soft-delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.softDelete(resident, task.id)
                })
            })
        })

        describe('Service user', () => {
            let task

            beforeAll(async () => {
                [task] = await createTestTicketDocumentGenerationTask(admin, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })
            })

            test('cannot create', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestTicketDocumentGenerationTask(serviceUser, staff.user, {
                        ticket: { connect: { id: ticket.id } },
                        format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                        documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                    })
                })
            })

            test('cannot read', async () => {
                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await TicketDocumentGenerationTask.getOne(serviceUser, {
                        id: task.id,
                    })
                })
            })

            test('cannot update', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestTicketDocumentGenerationTask(serviceUser, task.id, {
                        status: TICKET_DOCUMENT_GENERATION_TASK_STATUS.CANCELLED,
                    })
                })
            })

            test('cannot delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.delete(serviceUser, task.id)
                })
            })

            test('cannot soft-delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.softDelete(serviceUser, task.id)
                })
            })
        })

        describe('Anonymous', () => {
            let task

            beforeAll(async () => {
                [task] = await createTestTicketDocumentGenerationTask(admin, staff.user, {
                    ticket: { connect: { id: ticket.id } },
                    format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                    documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                })
            })

            test('cannot create', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestTicketDocumentGenerationTask(anonymous, staff.user, {
                        ticket: { connect: { id: ticket.id } },
                        format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                        documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
                    })
                })
            })

            test('cannot read', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await TicketDocumentGenerationTask.getOne(anonymous, {
                        id: task.id,
                    })
                })
            })

            test('cannot update', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestTicketDocumentGenerationTask(anonymous, task.id, {
                        status: TICKET_DOCUMENT_GENERATION_TASK_STATUS.CANCELLED,
                    })
                })
            })

            test('cannot delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await TicketDocumentGenerationTask.delete(anonymous, task.id)
                })
            })

            test('cannot soft-delete', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await TicketDocumentGenerationTask.softDelete(anonymous, task.id)
                })
            })
        })
    })

    describe('task logic', () => {
        test('should be generate docx document', async () => {
            const [task] = await createTestTicketDocumentGenerationTask(admin, staff.user, {
                ticket: { connect: { id: ticket.id } },
                format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
            })

            await waitFor(async () => {
                const foundedTask = await TicketDocumentGenerationTask.getOne(admin, { id: task.id })
                expect(foundedTask).toHaveProperty('status', TICKET_DOCUMENT_GENERATION_TASK_STATUS.COMPLETED)
                expect(foundedTask).toHaveProperty('format', TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX)
                expect(foundedTask).toHaveProperty('documentType', TICKET_DOCUMENT_TYPE.COMPLETION_WORKS)
                expect(foundedTask.file.originalFilename).toEqual(expect.stringMatching(/^[\w\W]+.docx$/))
            })
        })

        test('task should fail if unsupported locale', async () => {
            const staff = await makeEmployeeUserClientWithAbilities({
                canReadTickets: true,
            })
            const [ticket] = await createTestTicket(admin, staff.organization, staff.property)

            const [task] = await createTestTicketDocumentGenerationTask(admin, staff.user, {
                ticket: { connect: { id: ticket.id } },
                format: TICKET_DOCUMENT_GENERATION_TASK_FORMAT.DOCX,
                documentType: TICKET_DOCUMENT_TYPE.COMPLETION_WORKS,
            })

            await waitFor(async () => {
                const foundedTask = await TicketDocumentGenerationTask.getOne(admin, { id: task.id })
                expect(foundedTask).toHaveProperty('status', TICKET_DOCUMENT_GENERATION_TASK_STATUS.ERROR)
                expect(foundedTask.meta.error).toEqual(expect.stringContaining('unsupported locale'))
            })
        })
    })
})
