import React from 'react';
import { Card, Button,Form,Input,Icon } from 'antd';
import createAction from '../actions';
import { connect } from 'react-redux'
import { getPageRank,getCommunityDetect } from '../settings/settings.js'
const ControlPanel = ({ addPageRank,addCommunityDetect }) => {
    const handleAddPagerRank = () => {
        fetch(getPageRank, {
            method: "POST",
            mode: "cors",
            // headers: { 'Accept': 'application/json,text/plain,*/*' }   ,
        }).then(r => {
            return r.json();
        })
            .then(response => {
                console.log("get data finished!");
                // console.log(response);
                addPageRank(response);
            });
    }
    const handleShortestPath = () => {
        
    }
    const handleCommunityDetect= () => {
        fetch(getCommunityDetect, {
            method: "POST",
            mode: "cors",
            // headers: { 'Accept': 'application/json,text/plain,*/*' }   ,
        }).then(r => {
            return r.json();
        })
            .then(response => {
                console.log("get data finished!");
                addCommunityDetect(response);
                // console.log(response);
                // addPageRank(response);
            });
    }

    return (
        <div>
            <Card title="Control Panel" bordered={true}size={"small"} type="inner" >
                <Button.Group>
                    <Button style={{ marginBlockStart: 8 }} onClick={handleCommunityDetect}>社团检测</Button><br/>
                    <Button style={{marginBlockStart:8}} onClick={handleAddPagerRank}>节点排序</Button><br />
                    <Button style={{marginBlockStart:8}}>最短路径</Button><br/>
                </Button.Group>
                <Form layout="inline" onSubmit={handleShortestPath} style={{marginBlockStart:8}} >
                    <Form.Item size="small">
                        <Input placeholder="From" style={{width:70}} />
                    </Form.Item>
                    
                    <Form.Item >
                        <Input placeholder="To" style={{width:70}}/>
                        </Form.Item>
                    <Form.Item>
                        <Button type="primary">submit</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        addPageRank:pageRank => {
            dispatch(createAction("addPageRank",pageRank));
        },
        addCommunityDetect:community=> {
            dispatch(createAction("addCommunityDetect",community));
        },
    }
} 
const Content=connect( () => ({}),mapDispatchToProps)(ControlPanel)
export default Content;