import React from 'react'
import { Card,List } from 'antd';
const PageRank = () => {
    const listItem = ['aaa', 'bbb', 'ccc'];
    return ( 
        <div>
            <Card title="Page Rank" bordered={true} style={{ width: 200 }} size={"small"} >
                <List dataSource={listItem} renderItem={(item, index) => (<List.Item>{index},{item}</List.Item>)} size="small">
                </List>
            </Card></div>
     );
}
 
export default PageRank;