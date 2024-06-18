/**
 * Generated by `createschema meter.MeterReadingsImportTask 'status:Select:processing,completed,canceled,error; format:Select:excel,csv; importedRecordsCount:Integer; totalRecordsCount:Integer; file?:File; errorFile?:File; user:Relationship:User:CASCADE;meta?:Json'`
 */

import {
    MeterReadingsImportTask,
    MeterReadingsImportTaskCreateInput,
    MeterReadingsImportTaskUpdateInput,
    QueryAllMeterReadingsImportTasksArgs,
} from '@app/condo/schema'

import { generateReactHooks } from '@open-condo/codegen/generate.hooks'

import { MeterReadingsImportTask as MeterReadingsImportTaskGQL } from '@condo/domains/meter/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<MeterReadingsImportTask, MeterReadingsImportTaskCreateInput, MeterReadingsImportTaskUpdateInput, QueryAllMeterReadingsImportTasksArgs>(MeterReadingsImportTaskGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
