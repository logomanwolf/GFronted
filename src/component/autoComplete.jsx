import React from 'react'
import { Icon, Input, AutoComplete } from 'antd';
const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
const autoComplete = () => {
    return (<AutoComplete
        style={{ width: 200 }}
        dataSource={dataSource}
        placeholder="try to type `b`"
        filterOption={(inputValue, option) =>
            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }><Input suffix={<Icon type="search" className="certain-category-icon" />} /></AutoComplete>
    );
}
 
export default autoComplete;