import React from 'react'
import { Card, List, } from 'antd';
import { connect } from 'react-redux';
const PageRank = ({pageRank}) => {
    const listItem = pageRank;
    return ( 
        <div>
            <Card title="Page Rank" bordered={true} size={"small"} >
                <List dataSource={listItem} renderItem={(item, index) => (<List.Item>{item[0]}</List.Item>)} size="small"style={{overflow:"auto",maxHeight:"400px"}}>
                </List>
            </Card></div>
     );
}
const mapStateToProps = (state, ownProps) => {
    const pageRank = state.addPageRank.pageRank;
    // const pageRank = [1]
    console.log(pageRank);
    return {
        pageRank
    }
} 
const C = connect(
    mapStateToProps
)(PageRank)
 
export default C;