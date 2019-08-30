import React, { Component } from 'react';
import { Input, AutoComplete, List, Avatar, Card,Typography,Tag ,Row,Col } from 'antd';
import { connect } from 'react-redux' 
import createAction from '../actions';
import {card_background,canvas_background,important_font,plain_text} from '../settings/settings'
const dataSource = ["Anzelma", "Babet", "Bamatabois"];
const tagsFromServer = ['电影 ', '书籍 ', '音乐 '];

class autoComplete extends Component {
    state = { innerData: [], selectedTags: [], };    
    handleTagChange(tag, checked) {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        console.log('You are interested in: ', nextSelectedTags);
        this.setState({ selectedTags: nextSelectedTags });
    }
    fadeColor = color => {
        let oldcolor = {...color};
        let backgroundColor = { r: 0, g: 0, b: 0 };;
        oldcolor.a = 0.2;
        let newR = oldcolor.r * oldcolor.a + backgroundColor.r * (1 - oldcolor.a);
        let newG = oldcolor.g * oldcolor.a + backgroundColor.g * (1 - oldcolor.a);
        let newB = oldcolor.b * oldcolor.a + backgroundColor.b * (1 - oldcolor.a);
        let newColor = {};
        newColor.r = newR;
        newColor.g = newG;
        newColor.b = newB;
        newColor.a = 255;
        return newColor;
    }
    //将所有的的nodes和edges淡去
    fadeNodesAndEdges = (g) => {
        let nodes = g.nodes().toArray();
        nodes.forEach(node => {
            let oldNodeStyle = node.oldStyle;
            // node.oldStyle = oldNodeStyle;
            node.style({ r:oldNodeStyle.r,  fill: this.fadeColor(oldNodeStyle.fill) });
        })
        let edges = g.edges().toArray();
            edges.forEach(edge => {
            let oldEdgeStyle = edge.oldStyle;
            // edge.oldStyle = oldEdgeStyle;
            edge.style({ lineWidth:oldEdgeStyle.lineWidth, fill: this.fadeColor(oldEdgeStyle.fill) });
        })
    }
    render() { 
        const { innerData,selectedTags  } = this.state;
        const { g ,alterData} = this.props;
        const searchNode = (g, value) => {
            let tempData = [];
            if (g.getNodeById(value) !== null) 
            {
                const node = g.getNodeById(value);
                tempData.push({
                    title: node.id, attr: node.attr(), type:
                "node",keyWord:value,kfirst:true, restWord: ""});
                // console.log(node.attr(  ))
            }
            return tempData;
        }
        const onSearch = (value, event) => {
            // const data = [{ title: 'Ant Design Title 1', }, { title: 'Ant Design Title 2', }, { title: 'Ant Design Title 3', }, { title: 'Ant Design Title 4', },];
            //  
            const innerData=searchNode(g, value);
            this.setState({ innerData: innerData });           
        }
        const handleClickA = (value) => {
            let node = g.getNodeById(value);
            g.panTo({ x: node.attrs.x, y: node.attrs.y });
            this.fadeNodesAndEdges(g);
            node.style({ fill: { ...node.oldStyle.fill },r:20 });
            g.draw();
        }
        return (
            <Card title="搜索栏" bordered={false} size={"small"} headStyle={{ backgroundColor:card_background }} style={{height: "130px", overflow: "auto",backgroundColor:card_background}} type="inner" >
                <Row>
                    <Col span={12}>
                        < AutoComplete  dataSource={dataSource} placeholder="try to type `b`" filterOption={(inputValue, option) =>option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1} >
                            < Input.Search onSearch={onSearch} allowClear={true} />
                        </AutoComplete >
                    </Col>
                    <Col span={12}>
                        <h6 style={{ display: "inline" ,lineHeight:"32px" }}>关键词:</h6>{tagsFromServer.map(tag => (
                            <Tag.CheckableTag style={{display:"inline",margin:"0 0 0 6px", padding:"0px",cursor:"pointer"}} key={tag} checked={selectedTags.indexOf(tag) > -1} onChange={checked => this.handleTagChange(tag, checked)}>{tag}</Tag.CheckableTag>))}
                    </Col>
                </Row>
            {
                innerData.length !== 0 ?
                    <List
                        // bordered="true"
                        itemLayout="horizontal"
                        dataSource={innerData}
                        renderItem={item => (
                            <List.Item size="small">
                                <List.Item.Meta
                                    avatar={<Avatar icon={item.type === "node" ? "dot-chart" : "line-chart"} />}
                                    title={item.kfirst ? <a onClick={()=>{handleClickA(item.title)}} ><Typography.Text mark>{item.keyWord}</Typography.Text><Typography.Text strong>{item.restWord}</Typography.Text></a>
                                        : <a><Typography.Text strong>{item.restWord}</Typography.Text><Typography.Text mark>{item.keyWord}</Typography.Text></a>}
                                    description={
                                        item.type === "node" ? <div><Typography.Text strong>group:</Typography.Text> {item.attr.group}</div> : null}
                                // <p>group:{item.attr.group}</p><p>group:{item.attr.group}</p> 
                                />
                            </List.Item>
                        )}
                        style={{overflow:"auto",maxHeight:"400px"}}/>
                : null
            }   
        </Card>  );
    }
}
 // 3、定义mapStateToProps，第一个参数state 接收我们的Redux Store. 第二个参数ownProps 接收组件传递的Props。需要注意的是，该函数必须返回一个纯对象，这个对象将会与展示组件Props 合并!
const mapStateToProps = (state, ownProps) => {
    const {g} =state.addG
    console.log(g);
    return {
       g
    }
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        alterData:id => {
            dispatch(createAction("alterData",id));
        },
    }
} 

const Connects = connect(
    mapStateToProps,mapDispatchToProps
)(autoComplete)
 
export default Connects;