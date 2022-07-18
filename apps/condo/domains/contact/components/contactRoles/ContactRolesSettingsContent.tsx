import { PlusCircleOutlined } from '@ant-design/icons'
import { SortContactRolesBy } from '@app/condo/schema'
import ActionBar from '@condo/domains/common/components/ActionBar'
import { Button } from '@condo/domains/common/components/Button'
import { DEFAULT_PAGE_SIZE, Table } from '@condo/domains/common/components/Table/Index'
import { useQueryMappers } from '@condo/domains/common/hooks/useQueryMappers'
import { getPageIndexFromOffset, parseQuery } from '@condo/domains/common/utils/tables.utils'
import { useContactRolesTableColumns } from '@condo/domains/contact/hooks/useContactRolesTableColumns'
import { ContactRole } from '@condo/domains/contact/utils/clientSchema'
import { useOrganization } from '@core/next/organization'
import styled from '@emotion/styled'
import { Col, Row, Typography } from 'antd'
import { Gutter } from 'antd/es/grid/row'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'

const SORTABLE_PROPERTIES = ['name']
const DEFAULT_SORT_BY = ['name_DESC']

const StyledTable = styled(Table)`
  .ant-table-cell-ellipsis {
    white-space: inherit;
  }
`

const MEDIUM_VERTICAL_GUTTER: [Gutter, Gutter] = [0, 40]

export const ContactRolesSettingsContent = (props) => {
    const intl = useIntl()
    const titleMessage = intl.formatMessage({ id: 'ContactRoles' })
    const addMessage = intl.formatMessage({ id: 'ContactRoles.add' })

    const router = useRouter()
    const { filters, sorters, offset } = parseQuery(router.query)

    const userOrganization = useOrganization()
    const userOrganizationId = get(userOrganization, ['organization', 'id'])
    const canManageContacts = useMemo(() => get(userOrganization, ['link', 'role', 'canManageContacts']), [userOrganization])

    const currentPageIndex = getPageIndexFromOffset(offset, DEFAULT_PAGE_SIZE)

    const { filtersToWhere, sortersToSortBy } = useQueryMappers([], SORTABLE_PROPERTIES)
    const sortBy = sortersToSortBy(sorters, DEFAULT_SORT_BY) as SortContactRolesBy[]

    const searchContactRolesQuery = useMemo(() => ({
        ...filtersToWhere(filters),
        OR: [
            { organization_is_null: true },
            { organization: { id: userOrganizationId } },
        ],
    }), [filters, userOrganizationId])

    const {
        loading: isRolesLoading,
        count: totalRoles,
        objs: roles,
    } = ContactRole.useObjects({
        sortBy,
        where: searchContactRolesQuery,
        first: DEFAULT_PAGE_SIZE,
        skip: (currentPageIndex - 1) * DEFAULT_PAGE_SIZE,
    })

    const tableColumns = useContactRolesTableColumns([])

    const handleAddHintButtonClick = useCallback(async () => {
        if (!canManageContacts) {
            return
        }

        await router.push('/settings/contactRole/create')
    }, [router, canManageContacts])

    const handleRowAction = useCallback((record) => {
        return {
            onClick: async () => {
                await router.push(`/settings/contactRole/${record.id}/`)
            },
        }
    }, [router])

    return (
        <Row gutter={MEDIUM_VERTICAL_GUTTER}>
            <Col span={24}>
                <Typography.Title level={3}>{titleMessage}</Typography.Title>
            </Col>
            <Col span={24}>
                <StyledTable
                    totalRows={totalRoles}
                    loading={isRolesLoading}
                    onRow={handleRowAction}
                    dataSource={roles}
                    columns={tableColumns}
                    data-cy={'contactRoles__table'}
                />
            </Col>
            {
                canManageContacts && (
                    <Col span={24}>
                        <ActionBar>
                            <Button
                                type={'sberDefaultGradient'}
                                icon={<PlusCircleOutlined/>}
                                onClick={handleAddHintButtonClick}
                            >
                                {addMessage}
                            </Button>
                        </ActionBar>
                    </Col>
                )
            }
        </Row>
    )
}
