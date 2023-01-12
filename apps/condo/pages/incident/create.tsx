// todo(DOMA-2567) add translates
import React from 'react'
import Head from 'next/head'

import { Typography } from '@open-condo/ui'

import { OrganizationRequired } from '@condo/domains/organization/components/OrganizationRequired'
import { PageHeader, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { TablePageContent } from '@condo/domains/common/components/containers/BaseLayout/BaseLayout'


interface ICreateIncidentPage extends React.FC {
    headerAction?: JSX.Element
    requiredAccess?: React.FC
}

const CreateIncidentPageContent: React.FC = () => {
    const PageTitle = 'Новая запись'

    return (
        <>
            <Head>
                <title>{PageTitle}</title>
            </Head>
            <PageWrapper>
                <PageHeader title={<Typography.Title>{PageTitle}</Typography.Title>} />
                <TablePageContent>
                    Test
                </TablePageContent>
            </PageWrapper>
        </>
    )
}

const CreateIncidentPage: ICreateIncidentPage = () => {
    return <CreateIncidentPageContent />
}

CreateIncidentPage.requiredAccess = OrganizationRequired

export default CreateIncidentPage
