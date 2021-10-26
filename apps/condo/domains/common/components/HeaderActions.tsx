import { useIntl } from '@core/next/intl'
import { LinkWithIcon } from './LinkWithIcon'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { colors } from '../constants/style'
import React, { useContext, useEffect, useState } from 'react'
import { MessageDescriptor } from '@formatjs/intl/src/types'
import Router, { useRouter } from 'next/router'
import get from 'lodash/get'
import { Space, Typography } from 'antd'
import { AuthLayoutContext } from '@condo/domains/user/components/containers/AuthLayoutContext'
import { Button } from './Button'

interface IReturnBackHeaderActionProps {
    descriptor: MessageDescriptor
    path: ((id: string) => string) | string
}

interface ITitleHeaderActionProps {
    descriptor: MessageDescriptor
}

interface IRightButtonHeaderActionProps {
    descriptor: MessageDescriptor
    path: string
}

export const ReturnBackHeaderAction: React.FC<IReturnBackHeaderActionProps> = (props) => {
    const { descriptor, path } = props
    const intl = useIntl()
    const BackMessage = intl.formatMessage(descriptor)
    const [isBackLink, setIsBackLink] = useState<boolean>(false)
    const { query } = useRouter()
    const url = typeof path === 'string' ? path : path(String(get(query, 'id')))

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsBackLink(window.history.length > 2)
        }
    }, [])

    return (
        <LinkWithIcon
            icon={<ArrowLeftOutlined style={{ color: colors.white }}/>}
            path={url}
            isBackLink={isBackLink}
        >
            {BackMessage}
        </LinkWithIcon>
    )
}

export const TitleHeaderAction: React.FC<ITitleHeaderActionProps> = (props) => {
    const { descriptor } = props
    const intl = useIntl()
    const TitleMessage = intl.formatMessage(descriptor)
    return (
        <Space>
            <Typography.Text style={{ fontSize: '12px' }}>
                {TitleMessage}
            </Typography.Text>
        </Space>
    )
}

export const ButtonHeaderAction: React.FC<IRightButtonHeaderActionProps> = (props) => {
    const { descriptor, path } = props
    const intl = useIntl()
    const ButtonMessage = intl.formatMessage(descriptor)
    const { isMobile } = useContext(AuthLayoutContext)

    return (
        <Button
            key='submit'
            onClick={() => Router.push(path)}
            type='sberPrimary'
            secondary={true}
            size={isMobile ? 'middle' : 'large'}
            block
        >
            {ButtonMessage}
        </Button>
    )
}
