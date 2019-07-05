import React from 'react';
import { Input } from 'antd';

const { Search } = Input; 
const searchBar = (value) => {
   
    return (<div>
        <Search
            placeholder="input search text"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
        /></div>)
}
export default searchBar;

