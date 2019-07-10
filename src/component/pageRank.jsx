import React from 'react'
import { Card, List, } from 'antd';
import { connect } from 'react-redux';
const PageRank = () => {
    const listItem = ['aaa', 'bbb', 'ccc'];
    return ( 
        <div>
            <Card title="Page Rank" bordered={true} style={{ width: 250 }} size={"small"} >
                <List dataSource={listItem} renderItem={(item, index) => (<List.Item>{index},{item}</List.Item>)} size="small">
                </List>
            </Card></div>
     );
}
const mapStateToProps = (state, ownProps) => {
    const pageRank = state.addPagerRank.pageRank;
    console.log(pageRank);
    return {
        pageRank
    }
} 
const Connects = connect(
    mapStateToProps
)(PageRank)
 
export default Connects;