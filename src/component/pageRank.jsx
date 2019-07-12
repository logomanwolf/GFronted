import React, { Component } from 'react';
import { Card, List ,Collapse,Avatar } from 'antd';
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
                <Card.Meta title="Europe Street beat" style={{ textAlign: "center", padding: 0,border:0 }} />
            </Card>
            , tab2: <Card title="Page Rank" bordered={true} size={"small"} type="inner">
                <List dataSource={listItem} renderItem={(item, index) => (<List.Item>{item[0]}</List.Item>)} size="small" style={{ overflow: "auto", height: "250px" }}>
                </List>
            </Card>,
            tab3:
                <Card bordered={true} size={"small"} type="inner">
                    <Collapse defaultActiveKey={['1']} onChange="">
                    <Collapse.Panel header="This is panel header 1" key="1">
                    <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<a href="https://ant.design">1</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    </Collapse.Panel>
                    <Collapse.Panel header="This is panel header 2" key="2">
                        <p></p>
                    </Collapse.Panel>
                    <Collapse.Panel header="This is panel header 3" key="3">
                        <p></p>
                    </Collapse.Panel>
                </Collapse>
            </Card>,
          };
        return ( 
            <div>
            
                <Card style={{ width: '100%' }} size="small" tabList={[
                    {
                        key: 'tab1',
                        tab: 'statistic panel',
                    }, {
                        key: 'tab2',
                        tab: 'list panel',
                    }, {
                        key: 'tab3',
                        tab: 'detail panel',
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