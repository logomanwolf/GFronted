import React, { Component } from 'react';
import { Card, List } from 'antd';
import { connect } from 'react-redux';
import pic from './img/barchart.PNG'
class PageRank extends Component {
    state = { key: 'tab2' }
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
      };
    render() { 
        const listItem = this.props.pageRank;
        const contentList = {
            tab1: <Card
                cover={<img alt="example" src={pic}/>}
                style={{overflow:"auto"}} 
            >
                <Card.Meta title="Europe Street beat" style={{ textAlign: "center", padding: 0 }} />
            </Card>
            , tab2: <Card title="Page Rank" bordered={true} size={"small"} type="inner">
                <List dataSource={listItem} renderItem={(item, index) => (<List.Item>{item[0]}</List.Item>)} size="small" style={{ overflow: "auto", height: "250px" }}>
                </List>
            </Card>,
            tab3: <p>content3</p>,
          };
        return ( 
            <div>
            
                <Card style={{ width: '100%' }} size="small" tabList={[
                    {
                        key: 'tab1',
                        tab: 'detail panel',
                    }, {
                        key: 'tab2',
                        tab: 'list panel',
                    }, {
                        key: 'tab3',
                        tab: 'statistic panel',
                    },]}
                    activeTabKey={this.state.key}
                    onTabChange={key => {
                        this.onTabChange(key, 'key');
                    }}
                >
                {contentList[this.state.key]}
                </Card>
            </div>
        
         );
    }
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