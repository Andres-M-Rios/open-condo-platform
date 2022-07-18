import { ContactRole as IContactRole } from '@app/condo/schema'
import { ContactRole } from '@condo/domains/contact/utils/clientSchema'
import { Select, SelectProps } from 'antd'
import React, { useMemo } from 'react'

interface IEmployeeRoleSelectProps extends SelectProps<string> {
    employeeRoles: Array<IContactRole>
}

export const ContactRoleSelect: React.FC<IEmployeeRoleSelectProps> = (props) => {
    const { employeeRoles, ...restProps } = props
    const options = useMemo(() => employeeRoles.map((role) => {
        const convertedOption = ContactRole.convertGQLItemToFormSelectState(role)

        if (convertedOption) {
            const { value, label } = convertedOption
            return (<Select.Option key={value} value={value} title={label}>{label}</Select.Option>)
        }
    }), [employeeRoles])

    return (
        <Select
            allowClear={true}
            defaultValue={null}
            {...restProps}
        >
            {options}
        </Select>
    )
}
