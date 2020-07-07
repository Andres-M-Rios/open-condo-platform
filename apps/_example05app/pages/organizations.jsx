import { Avatar, Button, Form, Input, Menu, Modal, notification, Popconfirm, Radio, Tag } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { useAuth } from '@core/next/auth'
import { useIntl } from '@core/next/intl'
import { useMutation, useQuery } from '@core/next/apollo'
import { useOrganization } from '@core/next/organization'

import { getQueryParams } from '../utils/url.utils'
import BaseLayout from '../containers/BaseLayout'
import { AuthRequired } from '../containers/AuthRequired'
import FormList, { CreateFormListItemButton, ExtraDropdownActionsMenu } from '../containers/FormList'
import { runMutation } from '../utils/mutations.utils'

const DEFAULT_ORGANIZATION_AVATAR_URL = 'https://www.pngitem.com/pimgs/m/226-2261747_company-name-icon-png-transparent-png.png'

function buildListQueries (gqlListSchemaName, fields = ['id', '_label_']) {
    // TODO(pahaz): remove it! useless and large!
    const fieldsToStr = (fields) => '{ ' + fields.map((f) => Array.isArray(f) ? fieldsToStr(f) : f).join(' ') + ' }'
    const gqlFields = fieldsToStr(fields)

    const _itemQueryName = gqlListSchemaName
    const _listQueryName = gqlListSchemaName + 's'
    const gqlNames = {
        itemQueryName: _itemQueryName,
        listQueryName: `all${_listQueryName}`,
        listQueryMetaName: `_all${_listQueryName}Meta`,
        listMetaName: `_${_listQueryName}Meta`,
        listSortName: `Sort${_listQueryName}By`,
        deleteMutationName: `delete${_itemQueryName}`,
        updateMutationName: `update${_itemQueryName}`,
        createMutationName: `create${_itemQueryName}`,
        deleteManyMutationName: `delete${_listQueryName}`,
        updateManyMutationName: `update${_listQueryName}`,
        createManyMutationName: `create${_listQueryName}`,
        whereInputName: `${_itemQueryName}WhereInput`,
        whereUniqueInputName: `${_itemQueryName}WhereUniqueInput`,
        updateInputName: `${_itemQueryName}UpdateInput`,
        createInputName: `${_itemQueryName}CreateInput`,
        updateManyInputName: `${_listQueryName}UpdateInput`,
        createManyInputName: `${_listQueryName}CreateInput`,
        relateToManyInputName: `${_itemQueryName}RelateToManyInput`,
        relateToOneInputName: `${_itemQueryName}RelateToOneInput`,
    }

    return {
        create: gql`
            mutation create($data: ${gqlNames.createInputName}!) {
            obj: ${gqlNames.createMutationName}(data: $data) ${gqlFields}
            }
        `,
        list: gql`
            query list($where: ${gqlNames.whereInputName}){
            meta: ${gqlNames.listQueryMetaName} { count }
            list: ${gqlNames.listQueryName} (where: $where) ${gqlFields}
            }
        `,
        gqlNames,
        gqlFields,
    }
}

const gqlOrganization = buildListQueries('Organization', ['id', 'name', 'description', 'avatar', ['publicUrl']])
gqlOrganization.registerNew = gql`
    mutation registerNew($data: ${gqlOrganization.gqlNames.itemQueryName}RegisterNewInput!) {
    obj: registerNew${gqlOrganization.gqlNames.itemQueryName}(data: $data) ${gqlOrganization.gqlFields}
    }
`

const gqlOrganizationLink = buildListQueries('OrganizationToUserLink', ['id', 'organization', ['id', 'name', 'description', 'avatar', ['publicUrl']], 'user', ['id', 'name'], 'role', 'isRejected', 'isAccepted'])

const ACCEPT_REJECT_ORGANIZATION = gql`
    mutation acceptOrReject($id: ID!, $data: OrganizationToUserLinkAcceptOrRejectInput!){
        status: acceptOrRejectOrganizationToUserLink(id: $id, data: $data)
    }
`

const CreateOrganizationForm = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form] = Form.useForm()
    const [create] = useMutation(gqlOrganization.registerNew, {
        update: (cache, mutationResult) => {
            console.log('result', mutationResult)
        },
    })

    const intl = useIntl()
    const DoneMsg = intl.formatMessage({ id: 'Done' })
    const ServerErrorMsg = intl.formatMessage({ id: 'ServerError' })
    const CancelMsg = intl.formatMessage({ id: 'Cancel' })
    const SaveMsg = intl.formatMessage({ id: 'Save' })
    const NameMsg = intl.formatMessage({ id: 'Name' })
    const DescriptionMsg = intl.formatMessage({ id: 'Description' })
    const FieldIsRequiredMsg = intl.formatMessage({ id: 'FieldIsRequired' })
    const CreateOrganizationButtonLabelMsg = intl.formatMessage({ id: 'pages.organizations.CreateOrganizationButtonLabel' })
    const CreateOrganizationPopupLabelMsg = intl.formatMessage({ id: 'pages.organizations.CreateOrganizationPopupLabel' })
    const ErrorToFormFieldMsgMapping = {}

    function handleCancel () {
        setIsVisible(false)
    }

    function handleOpen () {
        setIsVisible(!isVisible)
    }

    function handleFinish (values) {
        setIsLoading(true)
        return runMutation({
            mutation: create,
            variables: { data: values },
            onCompleted: () => onFinish(),
            onFinally: () => {
                setIsLoading(false)
                handleCancel()
            },
            intl,
            form,
            ErrorToFormFieldMsgMapping,
        })
    }

    function handleSave () {
        form.submit()
    }

    return (<>
        <CreateFormListItemButton onClick={handleOpen} label={CreateOrganizationButtonLabelMsg}/>
        <Modal title={CreateOrganizationPopupLabelMsg} visible={isVisible} onCancel={handleCancel} footer={[
            <Button key="back" onClick={handleCancel}>{CancelMsg}</Button>,
            <Button key="submit" type="primary" onClick={handleSave} loading={isLoading}>{SaveMsg}</Button>,
        ]}
        >
            <Form form={form} layout="vertical" name="create-organization-form" onFinish={handleFinish}>
                <Form.Item
                    name="name"
                    label={NameMsg}
                    rules={[{ required: true, message: FieldIsRequiredMsg }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="description"
                    label={DescriptionMsg}
                    rules={[{ required: true, message: FieldIsRequiredMsg }]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    </>)
}

const OrganizationListForm = () => {
    const { user } = useAuth()
    const organization = useOrganization()
    const where = user ? { user: { id: user.id } } : {}
    const { loading, data, refetch } = useQuery(gqlOrganizationLink.list, {
        variables: { where },
        errorPolicy: 'all',
    })
    const [acceptOrReject] = useMutation(ACCEPT_REJECT_ORGANIZATION)

    const intl = useIntl()
    const DoneMsg = intl.formatMessage({ id: 'Done' })
    const ServerErrorMsg = intl.formatMessage({ id: 'ServerError' })
    const AcceptMsg = intl.formatMessage({ id: 'Accept' })
    const RejectMsg = intl.formatMessage({ id: 'Reject' })
    const LeaveMsg = intl.formatMessage({ id: 'Leave' })
    const SelectMsg = intl.formatMessage({ id: 'Select' })
    const OwnerMsg = intl.formatMessage({ id: 'Owner' })
    const AreYouSureMsg = intl.formatMessage({ id: 'AreYouSure' })

    function handleAcceptOrReject (item, action) {
        console.log(item, action)
        let data = {}
        if (action === 'accept') {
            data = { isAccepted: true, isRejected: false }
        } else if (action === 'reject') {
            data = { isAccepted: false, isRejected: true }
        } else if (action === 'leave') {
            data = { isRejected: true }
        }
        acceptOrReject({ variables: { id: item.id, data } })
            .then(
                () => {
                    notification.success({ message: DoneMsg })
                },
                (e) => {
                    console.error(e)
                    notification.error({
                        message: ServerErrorMsg,
                        description: e.message,
                    })
                })
            .finally(() => refetch())
    }

    function handleSelect (item) {
        organization.selectLink(item).then(() => {
            const query = getQueryParams()
            if (query.next) Router.push(query.next)
            else Router.push('/')
        })
    }

    return (<>
        <CreateOrganizationForm onFinish={refetch}/>
        <FormList
            loading={loading}
            // loadMore={loadMore}
            // TODO(pahaz): add this feature ^^
            dataSource={data && data.list || []}
            renderItem={item => {
                return {
                    itemMeta: { style: (item.isRejected) ? { display: 'none' } : undefined },
                    avatar: <Avatar src={item.avatar && item.avatar.publicUrl || DEFAULT_ORGANIZATION_AVATAR_URL}/>,
                    title: <>
                        {item.organization && item.organization.name}
                        {'  '}
                        {item.role === 'owner' ? <Tag color="error">{OwnerMsg}</Tag> : null}
                    </>,
                    description: item.organization && item.organization.description,
                    actions: [
                        (!item.isAccepted && !item.isRejected) ?
                            [<Radio.Group size="small" onChange={(e) => handleAcceptOrReject(item, e.target.value)}>
                                <Radio.Button value="accept">{AcceptMsg}</Radio.Button>
                                <Radio.Button value="reject">{RejectMsg}</Radio.Button>
                            </Radio.Group>]
                            : null,
                        (item.isAccepted) ?
                            [<Button size="small" type={'primary'}
                                     onClick={() => handleSelect(item)}>{SelectMsg}</Button>]
                            : null,
                        (item.isAccepted) ?
                            [<ExtraDropdownActionsMenu actions={[
                                {
                                    confirm: {
                                        title: AreYouSureMsg,
                                        icon: <QuestionCircleOutlined style={{ color: 'red' }}/>,
                                    },
                                    label: LeaveMsg,
                                    action: () => handleAcceptOrReject(item, 'leave'),
                                },
                            ]}/>]
                            : null,
                    ],
                }
            }}
        />
    </>)
}

const OrganizationsPage = () => {
    return (<AuthRequired>
        <OrganizationListForm/>
    </AuthRequired>)
}

function CustomContainer (props) {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'pages.organizations.PageTitle' })
    return <>
        <Head>
            <title>{PageTitleMsg}</title>
        </Head>
        <BaseLayout
            {...props}
            title={PageTitleMsg}
        />
    </>
}

OrganizationsPage.container = CustomContainer

export default OrganizationsPage
