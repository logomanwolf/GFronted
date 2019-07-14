import React from 'react';
import { Card, Row, Col, Icon,Popover,Button } from 'antd';
import pic from './img/minimap.PNG'
// import  data from "../data/data";
import ForceGraph from './forceGraph'
const Canvas = () => {
    
    return (
        <div>
           
                
            <Card bordered={true}
                style={{ margin:"20px 20px 20px 0px " }}
                size={"small"} >
                {/* {data.nodes[0].id} */}
                               
                <Col span={1}>                    
                    <ForceGraph />                                        
                </Col>
                <Col span={4}> <Card id="wedget" cover={
                            <p>dd</p>
                } bodyStyle={{ padding: 0 }} size="small" >
                </Card>
                </Col>
                <Col span={15}></Col>
                <Col span={4}><Card className="heatmap" cover={
                    <img alt="example" src={pic} />
                } bodyStyle={{ padding: 0 }} size="small" extra={<a href="#"><Icon type="close" /></a>}
                ></Card>
                </Col>
                
            </Card>
        </div>
    );
}
 
export default Canvas;