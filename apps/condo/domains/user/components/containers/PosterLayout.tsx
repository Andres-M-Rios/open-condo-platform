import React from 'react'
import { Col, Row, Typography } from 'antd'
import { Poster } from '@condo/domains/common/components/Poster'
import { colors } from '@condo/domains/common/constants/style'
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@condo/domains/common/constants/requisites'
import { useLayoutContext } from '@condo/domains/common/components/LayoutContext'
import { ChildrenWrapper, Footer, Layout, PageContent, PosterWrapper } from './styles'
import { AuthHeader } from './AuthHeader'

interface IPosterLayoutProps {
    headerAction: React.ReactElement
    layoutBgColor?: string
    layoutBgImage?: { poster: string, placeholder: string }
}

const ROW_STYLE = { margin: '65px 0 65px', justifyContent: 'center' }

export const PosterLayout: React.FC<IPosterLayoutProps> = ({ children, headerAction, layoutBgColor, layoutBgImage }) => {
    const { isSmall } = useLayoutContext()
    const LAYOUT_STYLE = { backgroundColor: layoutBgColor }
    const BG_POSTER = layoutBgImage ? layoutBgImage.poster : '/authPoster.png'
    const BG_POSTER_PLACEHOLDER = layoutBgImage ? layoutBgImage.placeholder : '/authPosterPlaceholder.png'
    const SUPPORT_EMAIL_MSG = `${SUPPORT_EMAIL}, `

    return (
        <Layout style={LAYOUT_STYLE}>
            <Row align={'stretch'} justify={'center'}>
                <AuthHeader headerAction={headerAction}/>
                <Col lg={12} md={24} hidden={isSmall}>
                    <PosterWrapper>
                        <Poster
                            src={BG_POSTER}
                            placeholderSrc={BG_POSTER_PLACEHOLDER}
                            placeholderColor={colors.black}
                        />
                    </PosterWrapper>
                </Col>
                <Col lg={12} md={24}>
                    <PageContent isSmall={isSmall}>
                        <ChildrenWrapper isSmall={isSmall}>
                            <Row style={ROW_STYLE}>
                                <Col span={24}>
                                    {children}
                                </Col>
                            </Row>
                        </ChildrenWrapper>
                    </PageContent>
                </Col>
                <Col span={24}>
                    <Footer isSmall={isSmall}>
                        <Typography.Link
                            href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL_MSG}
                        </Typography.Link>
                        <Typography.Link
                            href={`tel:${SUPPORT_PHONE}`}>{SUPPORT_PHONE}
                        </Typography.Link>
                    </Footer>
                </Col>
            </Row>
        </Layout>
    )
}