import { notification } from 'antd'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { useIntl } from '@open-condo/next/intl'
import { Button } from '@open-condo/ui'

import { SBBOL } from '@condo/domains/banking/constants'
import { BankSyncTask } from '@condo/domains/banking/utils/clientSchema'
import { ITask, TASK_REMOVE_STRATEGY } from '@condo/domains/common/components/tasks'
import { TasksCondoStorage } from '@condo/domains/common/components/tasks/storage/TasksCondoStorage'
import { TASK_COMPLETED_STATUS } from '@condo/domains/common/constants/tasks'

import type { BankSyncTask as BankSyncTaskType } from '@app/condo/schema'

const BANK_ACCOUNT_REPORT_PAGE_PATHNAME = '/property/[id]/report'

export const useBankSyncTaskUIInterface = () => {
    const intl = useIntl()
    const BankSyncTaskProgressTitle = intl.formatMessage({ id: 'tasks.BankSyncTask.file.progress.title' })
    const BankSyncTaskExternalSystemProgressTitle = intl.formatMessage({ id: 'tasks.BankSyncTask.externalSystem.progress.title' })
    const BankSyncTaskProgressDescriptionPreparing = intl.formatMessage({ id: 'tasks.BankSyncTask.progress.description.preparing' })
    const BankSyncTaskProgressDescriptionProcessing = intl.formatMessage({ id: 'tasks.BankSyncTask.progress.description.processing' })
    const BankSyncTaskProgressDescriptionCompleted = intl.formatMessage({ id: 'tasks.BankSyncTask.file.progress.description.completed' })
    const BankSyncTaskExternalSystemProgressDescriptionCompleted = intl.formatMessage({ id: 'tasks.BankSyncTask.externalSystem.progress.description.completed' })
    const UpdateTitle = intl.formatMessage({ id: 'Update' })

    const { reload, push, pathname } = useRouter()

    const getCompleteButtonClickHandler = useCallback((taskRecord) => () => {
        const propertyId = get(taskRecord, 'property.id')

        if (propertyId && BANK_ACCOUNT_REPORT_PAGE_PATHNAME === pathname) {
            push(`/property/${propertyId}/report/`)
        } else {
            reload()
        }
    }, [reload, push, pathname])

    const TaskUIInterface: ITask = {
        storage: new TasksCondoStorage({
            clientSchema: BankSyncTask,
        }),
        removeStrategy: [TASK_REMOVE_STRATEGY.PANEL],
        translations: {
            title: (taskRecord) => {
                return get(taskRecord, 'options.type') === SBBOL
                    ? BankSyncTaskExternalSystemProgressTitle
                    : BankSyncTaskProgressTitle
            },
            description: (taskRecord) => {
                const completedMessage = get(taskRecord, 'options.type') === SBBOL
                    ? BankSyncTaskExternalSystemProgressDescriptionCompleted
                    : BankSyncTaskProgressDescriptionCompleted

                // @ts-ignore
                const { status, processedCount, totalCount } = taskRecord // this record is of type BankSyncTask
                return status === TASK_COMPLETED_STATUS
                    ? completedMessage
                    : !totalCount || !processedCount
                        ? BankSyncTaskProgressDescriptionPreparing
                        : BankSyncTaskProgressDescriptionProcessing
                            .replace('{imported}', processedCount || 0)
                            .replace('{total}', totalCount || 0)
            },
        },
        calculateProgress: (task: BankSyncTaskType) => {
            return Math.floor(task.processedCount / task.totalCount) * 100
        },
        onComplete: (taskRecord) => {
            const propertyId = get(taskRecord, 'property.id')
            if (pathname === BANK_ACCOUNT_REPORT_PAGE_PATHNAME || propertyId) {
                const message = get(taskRecord, 'options.type') === SBBOL
                    ? BankSyncTaskExternalSystemProgressDescriptionCompleted
                    : BankSyncTaskProgressDescriptionCompleted
                notification.success({
                    message,
                    btn: <Button onClick={getCompleteButtonClickHandler(taskRecord)} type='primary'>{UpdateTitle}</Button>,
                    duration: 0,
                })
            }
        },
        onCancel: () => null,
    }

    return {
        BankSyncTask: TaskUIInterface,
    }
}
