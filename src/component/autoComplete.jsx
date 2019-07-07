import React from 'react'
import { Input,AutoComplete} from 'antd';
const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
const autoComplete = () => {
    return (
        < AutoComplete style={
            { width: 200 }
        }
            dataSource={
                dataSource
            }
            placeholder="try to type `b`"
            filterOption={
                (inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            } >
            < Input.Search /></AutoComplete >
    );
}

export default autoComplete;