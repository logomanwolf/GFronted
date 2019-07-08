import React, { Component } from 'react';
import { Input,AutoComplete,List, Avatar, Card} from 'antd';
const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
class autoComplete extends Component {
    state = { data: [] };
    onSearch = (value, event) => {
        const data = [{ title: 'Ant Design Title 1', }, { title: 'Ant Design Title 2', }, { title: 'Ant Design Title 3', }, { title: 'Ant Design Title 4', },];
        this.setState({data})
    }
    render() { 
        const { data } = this.state;
        return (<Card title="Search Bar" bordered={true} style={{ width: 250 }} size={"small"} >
            
        < AutoComplete style={
            { width: 220 }
        }
            dataSource={
                dataSource
            }
            placeholder="try to type `b`"
            filterOption={
                (inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            } >
                < Input.Search onSearch={this.onSearch}/></AutoComplete >
            {
                data.length !== 0 ?
                <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={<a href="https://ant.design">{item.title}</a>}
                            description="Ant Design, a design language "
                        />
                    </List.Item>
                    )} />
                : null
            }   
        </Card>  );
    }
}
 
export default autoComplete;