import React from 'react';
import { Card,Button } from 'antd';
const ControlPanel = () => {
    return (
        <div>
            <Card title="Control Panel" bordered={true} style={{ width: 250 }} size={"small"} >
                <Button.Group size="small">
                    <Button style={{marginBlockStart: 5}}>社团检测</Button><br/>
                    <Button style={{marginBlockStart:5}}>节点排序</Button><br />
                    <Button style={{marginBlockStart:5}}>最短路径</Button><br/>
                </Button.Group>
            </Card></div>
    );
}
 
export default ControlPanel;