import React from 'react';
import { Card, Button } from 'antd';
import createAction from '../actions';
import { connect } from 'react-redux'
import { getPageRank } from '../settings/settings.js'
const ControlPanel = ({ addPagerRank }) => {
    const handleAddPagerRank = () => {
        fetch(getPageRank,{
            method: "GET",
            mode: "cors",
            headers: {'Accept': 'application/json,text/plain,*/*','Content-Type': 'application/x-www-form-urlencoded',}   
        }).then(r => {
        console.log(r.body);
        return r.json();
      })
      .then(response => {
        console.log("get data finished!");
        console.log(response);
          addPagerRank(response);
      });
    }
    return (
        <div>
            <Card title="Control Panel" bordered={true} style={{ width: 250 }} size={"small"} >
                <Button.Group size="small">
                    <Button style={{marginBlockStart: 5}} >社团检测</Button><br/>
                    <Button style={{marginBlockStart:5}} onClick={handleAddPagerRank}>节点排序</Button><br />
                    <Button style={{marginBlockStart:5}}>最短路径</Button><br/>
                </Button.Group>
            </Card></div>
    );
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        addPagerRank:pageRank => {
            dispatch(createAction("addPagerRank",pageRank));
        },
    }
} 
const Content=connect( () => ({}),mapDispatchToProps)(ControlPanel)
export default Content;