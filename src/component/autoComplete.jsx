import React, { Component } from 'react';
import { Input, AutoComplete, List, Avatar, Card,Typography } from 'antd';
import { connect } from 'react-redux' 
const dataSource = ["Anzelma", 'Downing Street', 'Wall Street'];
class autoComplete extends Component {
    state = { innerData: [] };    
    render() { 
        const { innerData } = this.state;
        const { g } = this.props;
        const onSearch = (value, event) => {
            // const data = [{ title: 'Ant Design Title 1', }, { title: 'Ant Design Title 2', }, { title: 'Ant Design Title 3', }, { title: 'Ant Design Title 4', },];
            //  
            let tempData = [];
            if (g.g.getNodeById(value) !== null || g.g.getEdgeById(value)!==null) 
            {
                const node = g.g.getNodeById(value);
                tempData.push({ title: node.id, attr: node.attr() });
                console.log(node.attr(  ))
            }
            if (g.g.getEdgesByAttribute("source", value) !== null || g.g.getEdgesByAttribute("target", value) !== null) {
                const modeset = g.g.getEdgesByAttribute("source", value) !== null ? g.g.getEdgesByAttribute("source", value) : g.g.getEdgesByAttribute("target", value);
                modeset.toArray()
            }
            this.setState({ innerData: tempData });
            
        }
        return (<Card title="Search Bar" bordered={true} style={{ width: 250 }} size={"small"} >
            
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
                < Input.Search onSearch={onSearch}/></AutoComplete >
            {
                innerData.length !== 0 ?
                    <List
                        // bordered="true"
                itemLayout="horizontal"
                dataSource={innerData}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar icon="dot-chart"/>}
                            title={<a href="https://ant.design">{item.title}</a>}
                            description={<p><Typography.Text type="secondary">group:</Typography.Text> {item.attr.group}</p>}
                            // <p>group:{item.attr.group}</p><p>group:{item.attr.group}</p> 
                        />
                    </List.Item>
                    )} />
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