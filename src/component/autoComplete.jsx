import React, { Component } from 'react';
import { Input, AutoComplete, List, Avatar, Card,Typography } from 'antd';
import { connect } from 'react-redux' 
const dataSource = ["Anzelma", "Babet", "Bamatabois"];
class autoComplete extends Component {
    state = { innerData: [] };    
    render() { 
        const { innerData } = this.state;
        const { g } = this.props;
        const searchNode = (g, value) => {
            let tempData = [];
            if (g.g.getNodeById(value) !== null) 
            {
                const node = g.g.getNodeById(value);
                tempData.push({
                    title: node.id, attr: node.attr(), type:
                "node",keyWord:value,kfirst:true, restWord: ""});
                // console.log(node.attr(  ))
            }
            return tempData;
        }
        const searchEdge = (g,value) => {
            let tempData = [];
            if (g.g.getEdgesByAttribute("source", value) !== null || g.g.getEdgesByAttribute("target", value) !== null) {
                const a = g.g.getEdgesByAttribute("source", value).toArray();
                const b = g.g.getEdgesByAttribute("target", value).toArray();
                a.forEach(item => {
                    tempData.push({ restWord: "-"+item.target, type:"edge",keyWord:value,kfirst:true});
                })
                b.forEach(item => {
                    tempData.push({ restWord: item.source+"-", type:"edge",keyWord:value,kfirst:false});
                })
            }
            return tempData;
        }
        const onSearch = (value, event) => {
            // const data = [{ title: 'Ant Design Title 1', }, { title: 'Ant Design Title 2', }, { title: 'Ant Design Title 3', }, { title: 'Ant Design Title 4', },];
            //  
            let tempData = [];
            const innerData=tempData.concat(searchNode(g, value), searchEdge(g, value));
            this.setState({ innerData: innerData });           
        }
        return (<Card title="Search Bar" bordered={true} style={{ width: 260 }} size={"small"} >
            
        < AutoComplete style={
            { width: 230 }
        }
            dataSource={
                dataSource
            }
            placeholder="try to type `b`"
            filterOption={
                (inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            } >
                < Input.Search onSearch={onSearch} allowClear={true}
                    // onBlur={() => {
                    // this.setState({ innerData: [] })
                    // }}
                /></AutoComplete >
            {
                innerData.length !== 0 ?
                    <List
                        // bordered="true"
                        itemLayout="horizontal"
                        dataSource={innerData}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={item.type === "node" ? "dot-chart" : "line-chart"} />}
                                    title={item.kfirst ? <div><Typography.Text mark>{item.keyWord}</Typography.Text><Typography.Text strong>{item.restWord}</Typography.Text></div>
                                        : <div><Typography.Text strong>{item.restWord}</Typography.Text><Typography.Text mark>{item.keyWord}</Typography.Text></div>}
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
    const g =state.addG
    console.log(g);
    return {
       g
    }
   
}

const Connects = connect(
    mapStateToProps
)(autoComplete)
 
export default Connects;