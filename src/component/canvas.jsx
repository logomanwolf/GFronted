import React from 'react';
import { Card ,Row,Col} from 'antd';
// import  data from "../data/data";
import ForceGraph from './forceGraph'
const Canvas = () => {
    
    return (
        <div>
            <Card bordered={true}
                style={{ marginTop: "20px",marginRight: "20px" }}
                size={"small"} >
                {/* {data.nodes[0].id} */}
                <Col span={20}><ForceGraph /></Col>
                <Col span={4}><img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" className="heatmap" /></Col>
            </Card>
        </div>
    );
}
 
export default Canvas;