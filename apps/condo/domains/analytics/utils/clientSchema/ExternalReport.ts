/**
 * Generated by `createschema analytics.ExternalReport 'type:Select:metabase; title:Text; description?:Text; meta?:Json'`
 */

import {
    ExternalReport,
    ExternalReportCreateInput,
    ExternalReportUpdateInput,
    QueryAllExternalReportsArgs,
} from '@app/condo/schema'
import { generateReactHooks } from '@open-condo/codegen/generate.hooks'
import { ExternalReport as ExternalReportGQL } from '@condo/domains/analytics/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<ExternalReport, ExternalReportCreateInput, ExternalReportUpdateInput, QueryAllExternalReportsArgs>(ExternalReportGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
