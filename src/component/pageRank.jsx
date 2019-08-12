import React, { Component } from 'react';
import { Card, List ,Collapse,Avatar } from 'antd';
import { connect } from 'react-redux';
import pic from './img/barchart.PNG'
import createAction from '../actions';
import BarChart from './barchart'
import {card_background,canvas_background,important_font,plain_text} from '../settings/settings'                                                                                              
class PageRank extends Component {
    state = { key: 'tab1',detailPanelKey:1,listContent:[]}
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
    };
    componentWillReceiveProps(newProps) {
        const { listContent } = this.state;
        const { listPanelContent, g } = newProps;
        if (listPanelContent!==undefined && g!==undefined  && listContent.indexOf(g.getNodeById(listPanelContent)) === -1) {
            listContent.push(g.getNodeById(listPanelContent));
            const key = 'tab3';
            this.setState({ ...this.state, key });
        }
    }
    shouldComponentUpdate(newProps, newState) {
        if (newProps.pageRank !== this.props.pageRank || newProps.listPanelContent !== this.props.listPanelContent
            || newState !== this.state)
            return true;
        else
            return false;
    }
    // handleClickThenPanTo()
    render() { 
        const {listContent} = this.state;
        const alterData  = this.props.alterData;
        const listItem = this.props.pageRank;
        const handleClickPageRank = item => alterData(item);

        const contentList = {
            tab1:
                <Card
                // cover={<img alt="example" src={pic}/>}
                cover={<BarChart/>}
                    style={{ overflow: "auto",maxHeight:"340px" }}
                    size="small" >
            </Card>
            , tab2:
                <Card title="Page Rank" bordered={false} size={"small"} type="inner" >
                    <List dataSource={listItem} renderItem={(item, index) => (<List.Item                        
                    ><a onClick={()=>handleClickPageRank(item[0])}>{item[0]}</a></List.Item>)} size="small" style={{ overflow: "auto", height: "230px" }}>
                    </List>
                </Card>,
            tab3:               
                <Collapse>
                    {
                        listContent !== undefined ?
                        listContent.map((item,index) => {
                            return (
                                <Collapse.Panel header={item.id} key={index} >
                                    <List.Item onClick={() => handleClickPageRank(item.id)} style={{ cursor:  "pointer" }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={<a href="https://ant.design">{item.attrs.group}</a>}
                                        description={item.attrs.x+','+item.attrs.y}
                                    />
                                    </List.Item>
                                </Collapse.Panel>)
                        })
                     : null
                    }
                    
                </Collapse>
           
          };
        return ( 
            <div>
                <Card style={{ width: '100%' ,height:"418px",backgroundColor:card_background}} size="small" tabList={[
                    {
                        key: 'tab1',
                        tab: 'Statistic Panel',
                    }, {
                        key: 'tab2',
                        tab: 'List Panel',
                    }, {
                        key: 'tab3',
                        tab: 'Detail Panel',
                    },]}
                    activeTabKey={this.state.key}
                    onTabChange={key => {
                        this.onTabChange(key, 'key');
                    }}
                    headStyle={{ lineHeight: "10px", fontSize: "4px" }}
                >
                {contentList[this.state.key]}
                </Card>
            </div>
        
         );
    }
}
 
const mapStateToProps = (state, ownProps) => {
    const pageRank = state.addPageRank.pageRank;
    const listPanelContent = state.updateListPanelContent.listPanelContent;
    const g = state.addG.g;
    // const pageRank = [1]
    // console.log(pageRank);
    return {
        pageRank,listPanelContent,g
    }
} 
const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        alterData:id => {
            dispatch(createAction("alterData",id));
        },
    }
} 
const C = connect(
    mapStateToProps,mapDispatchToProps
)(PageRank)
 
export default C;