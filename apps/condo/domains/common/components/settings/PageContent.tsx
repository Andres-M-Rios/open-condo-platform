import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import { parseQuery } from '../../utils/tables.utils'
import { SettingsTab, SettingsTabs } from './Tabs'

export type SettingsTabType = {
    key: string,
    title: string,
    content?: React.ReactElement,
}

type PageContentProps = {
    settingsTabs: SettingsTabType[]
    availableTabs: string[]
}

export const PageContent: React.FC<PageContentProps> = ({ settingsTabs, availableTabs }) => {
    const router = useRouter()
    const { tab } = parseQuery(router.query)

    const defaultTab = availableTabs.includes(tab) ? tab : undefined

    const handleTabChange = (newKey) => {
        const newRoute = `${router.route}?tab=${newKey}`
        return router.push(newRoute)
    }

    return  settingsTabs.length === 1 ? (
        settingsTabs[0].content
    ) : (
        <SettingsTabs
            tabPosition={'right'}
            type={'card'}
            defaultActiveKey={defaultTab}
            activeKey={defaultTab}
            tabBarGutter={8}
            style={{ overflow: 'visible' }}
            onChange={handleTabChange}
        >
            {
                settingsTabs.map(tab => (
                    <Tabs.TabPane
                        key={tab.key}
                        tab={<SettingsTab title={tab.title} />}
                    >
                        {tab.content}
                    </Tabs.TabPane>
                ))
            }
        </SettingsTabs>
    )
}