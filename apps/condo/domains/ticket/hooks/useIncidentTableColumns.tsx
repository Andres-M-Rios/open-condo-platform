import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useIntl } from '@open-condo/next/intl'

import {
    Incident as IIncident, IncidentStatusType,
} from '@app/condo/schema'

import { FiltersMeta, getFilterDropdownByKey } from '@condo/domains/common/utils/filters.utils'
import { useRouter } from 'next/router'
import { getSorterMap, parseQuery } from '../../common/utils/tables.utils'
import get from 'lodash/get'
import { getFilteredValue } from '../../common/utils/helpers'
import { ColumnsType } from 'antd/es/table/interface'
import { getFilterIcon } from '../../common/components/TableFilter'
import { getDateRender, getTableCellRenderer } from '../../common/components/Table/Renders'
import { IncidentProperty, IncidentTicketClassifier } from '@condo/domains/ticket/utils/clientSchema'
import { ColumnType } from 'rc-table/lib/interface'
import { geOneAddressAndPropertiesCountRender } from '../../property/utils/clientSchema/Renders'
import { getManyClassifiersGroupByPlaceRender } from '../utils/clientSchema/Renders'
import { Tag, Typography } from '@open-condo/ui'
import { INCIDENT_STATUS_COLORS } from '../constants/incident'
import { getTimeLeftMessage, getTimeLeftMessageType } from '../../../pages/incident/[id]'
import dayjs from 'dayjs'


type UseTableColumnsPropsType <T = any> = {
    filterMetas: Array<FiltersMeta<T>>
    incidents: IIncident[]
}

type UseTableColumnsReturnType = {
    columns: ColumnsType<IIncident>
    loading: boolean
}

export type UseTableColumnsType = (props: UseTableColumnsPropsType) => UseTableColumnsReturnType

const COLUMNS_WIDTH = {
    number: '6%',
    properties: '19%',
    classifiers: '21%',
    details: '25%',
    status: '9%',
    workStart: '10%',
    workFinish: '10%',
}


// todo(DOMA-2567) add translations
export const useIncidentTableColumns: UseTableColumnsType = (props)  => {
    const { incidents, filterMetas } = props

    const intl = useIntl()
    const NumberLabel = '№'
    const PropertiesLabel = 'Адреса'
    const ClassifiersLabel = 'Классификатор'
    const DetailsLabel = 'Описание'
    const StatusLabel = 'Статус'
    const WorkStartLabel = 'Начало работ'
    const WorkFinishLabel = 'Завершение работ'
    const AllPropertiesMessage = 'Все дома'
    const ActualMessage = 'ActualMessage'
    const NotActualMessage = 'NotActualMessage'

    const incidentIds = useMemo(() => incidents.map(incident => incident.id), [incidents])

    const [incidentProperties, setIncidentProperties] = useState([])
    const [incidentClassifiers, setIncidentClassifiers] = useState([])
    const [loading, setLoading] = useState<boolean>(true)

    const {
        refetch: refetchIncidentProperty,
    } = IncidentProperty.useAllObjects({}, { skip: true })

    const {
        refetch: refetchIncidentTicketClassifier,
    } = IncidentTicketClassifier.useAllObjects({}, { skip: true })

    const getIncidentProperties = useCallback(async (incidentIds: string[]) => {
        if (incidentIds.length < 1) {
            return { incidentProperties: [] }
        }

        const response = await refetchIncidentProperty({
            where: {
                incident: { id_in: incidentIds, deletedAt: null },
                deletedAt: null,
            },
        })
        return { incidentProperties: response.data.objs }
    }, [])

    const getIncidentTicketClassifiers = useCallback(async (incidentIds: string[]) => {
        if (incidentIds.length < 1) {
            return { incidentClassifiers: [] }
        }

        const response = await refetchIncidentTicketClassifier({
            where: {
                incident: { id_in: incidentIds, deletedAt: null },
                deletedAt: null,
            },
        })
        return { incidentClassifiers: response.data.objs }
    }, [])

    const getPropertiesAndClassifiers = useCallback(async (incidentIds: string[]) => {
        setLoading(true)
        const { incidentProperties } = await getIncidentProperties(incidentIds)
        const { incidentClassifiers } = await getIncidentTicketClassifiers(incidentIds)
        setIncidentProperties(incidentProperties)
        setIncidentClassifiers(incidentClassifiers)
        setLoading(false)
    }, [getIncidentProperties, getIncidentTicketClassifiers])

    useEffect(() => {
        getPropertiesAndClassifiers(incidentIds)
    }, [getPropertiesAndClassifiers, incidentIds])

    const router = useRouter()
    const { filters, sorters } = parseQuery(router.query)
    const sorterMap = getSorterMap(sorters)
    const search = getFilteredValue(filters, 'search')

    const renderNumber = useMemo(() => getTableCellRenderer(), [])

    const renderDetails = useMemo(() => getTableCellRenderer(), [])

    const renderStatus = useCallback((status, incident) => {
        const isActual = status === IncidentStatusType.Actual
        return (
            <Tag
                bgColor={INCIDENT_STATUS_COLORS[incident.status].background}
                textColor={INCIDENT_STATUS_COLORS[incident.status].text}
            >
                {isActual ? ActualMessage : NotActualMessage}
            </Tag>
        )
    }, [])

    const renderWorkStart = useMemo(() => getDateRender(intl), [intl])
    const renderWorkFinish = useCallback((stringDate: string, incident) => {
        const renderDate = getDateRender(intl)(stringDate)
        if (!stringDate) return renderDate

        const isActual = incident.status === IncidentStatusType.Actual
        const currentDate = dayjs().toISOString()
        const timeLeftMessageType = getTimeLeftMessageType({
            deadline: stringDate,
            isDefault: !isActual,
            startWithDate: currentDate,
        })
        const renderTimeLeftMessage = getTimeLeftMessage({
            show: isActual,
            deadline: incident.workFinish,
            startWithDate: currentDate,
        })

        return (
            <>
                {renderDate}
                <Typography.Text type={timeLeftMessageType}>
                    {renderTimeLeftMessage}
                </Typography.Text>
            </>
        )
    }, [intl])

    const renderProperties: ColumnType<IIncident>['render'] = useCallback((_, incident) => {
        if (get(incident, 'hasAllProperties')) {
            return AllPropertiesMessage
        }

        const properties = incidentProperties
            .filter(item => get(item, 'incident.id') === incident.id)
            .map(item => item.property)

        // todo(DOMA-2567) fix function name
        return geOneAddressAndPropertiesCountRender(search)(intl, properties)
    }, [incidentProperties, intl, search])

    const renderClassifiers: ColumnType<IIncident>['render'] = useCallback((_, incident) => {
        const classifiers = incidentClassifiers
            .filter(item => get(item, 'incident.id') === incident.id)
            .map(item => item.classifier)

        return getManyClassifiersGroupByPlaceRender()(classifiers)
    }, [incidentClassifiers])

    return useMemo(() => ({
        loading,
        columns: [
            {
                title: NumberLabel,
                sortOrder: get(sorterMap, 'number'),
                filteredValue: getFilteredValue(filters, 'number'),
                dataIndex: 'number',
                key: 'number',
                sorter: true,
                width: COLUMNS_WIDTH.number,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'number'),
                filterIcon: getFilterIcon,
                render: renderNumber,
            },
            {
                title: PropertiesLabel,
                key: 'properties',
                width: COLUMNS_WIDTH.properties,
                render: renderProperties,
            },
            {
                title: ClassifiersLabel,
                key: 'classifiers',
                width: COLUMNS_WIDTH.classifiers,
                render: renderClassifiers,
            },
            {
                title: DetailsLabel,
                sortOrder: get(sorterMap, 'details'),
                filteredValue: getFilteredValue(filters, 'details'),
                dataIndex: 'details',
                key: 'details',
                width: COLUMNS_WIDTH.details,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'details'),
                filterIcon: getFilterIcon,
                render: renderDetails,
            },
            {
                title: StatusLabel,
                sortOrder: get(sorterMap, 'status'),
                filteredValue: getFilteredValue(filters, 'status'),
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                width: COLUMNS_WIDTH.status,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'status'),
                filterIcon: getFilterIcon,
                render: renderStatus,
            },
            {
                title: WorkStartLabel,
                sortOrder: get(sorterMap, 'workStart'),
                filteredValue: getFilteredValue(filters, 'workStart'),
                dataIndex: 'workStart',
                key: 'workStart',
                sorter: true,
                width: COLUMNS_WIDTH.workStart,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'workStart'),
                filterIcon: getFilterIcon,
                render: renderWorkStart,
            },
            {
                title: WorkFinishLabel,
                sortOrder: get(sorterMap, 'workFinish'),
                filteredValue: getFilteredValue(filters, 'workFinish'),
                dataIndex: 'workFinish',
                key: 'workFinish',
                sorter: true,
                width: COLUMNS_WIDTH.workFinish,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'workFinish'),
                filterIcon: getFilterIcon,
                render: renderWorkFinish,
            },
        ],
    }), [filterMetas, filters, loading, renderClassifiers, renderDetails, renderNumber, renderProperties, renderStatus, renderWorkFinish, renderWorkStart, sorterMap])
}
