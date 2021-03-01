import React, { useCallback, useMemo, useState } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'


const DEBOUNCE_TIMEOUT = 800

async function searchAddress (query) {
    // https://dadata.ru/api/suggest/address/
    // TODO(Dimitreee): move to local/prod/dev config
    const token = '257f4bd2c057e727f4e48438d121ffa7a665fce7'
    const loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'

    const response = await fetch(loadSuggestionsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ query }),
    })

    const { suggestions } = await response.json()

    return suggestions.map(suggestion => {
        const cleanedSuggestion = pickBy(suggestion, identity)

        return {
            text: suggestion.value,
            value: JSON.stringify({ ...cleanedSuggestion, address: suggestion.value }),
        }
    })
}

export const AddressSearchInput:React.FunctionComponent = (props) => {
    const [selected, setSelected] = useState('')
    const [fetching, setFetching] = useState(false)
    const [data, setData] = useState([])
    const options = useMemo(() => {
        return data.map(d => <Select.Option key={d.value} value={d.value} title={d.text}>{d.text}</Select.Option>)
    }, [data])

    const searchSuggestions = useCallback(async (value) => {
        setFetching(true)
        const data = await searchAddress((selected) ? selected + ' ' + value : value)

        setFetching(false)
        setData(data)
    }, [searchAddress])

    const debouncedSearch = useMemo(() => {
        return debounce(searchSuggestions, DEBOUNCE_TIMEOUT)
    }, [])

    const handleSelect = useCallback((value, option) => {
        setSelected(option.children)
    }, [])

    const handleClear = useCallback(() => {
        setSelected('')
    }, [])

    return (
        <Select
            showSearch
            autoClearSearchValue={false}
            allowClear={true}
            defaultActiveFirstOption={false}
            onSearch={debouncedSearch}
            onSelect={handleSelect}
            onClear={handleClear}
            loading={fetching}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            showArrow={false}
            filterOption={false}
            {...props}
        >
            {options}
        </Select>
    )
}
