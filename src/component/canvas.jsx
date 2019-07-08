import React from 'react';
import { Card } from 'antd';
// import  data from "../data/data";
import ForceGraph from './forceGraph'
const Canvas = () => {
    
    return (
        <div>
            <Card bordered={true} style={{ background: '#ECECEC', margin: "25px 10px 10px 10px"  }} size={"small"} className="canvas" >
                {/* {data.nodes[0].id} */}
                <ForceGraph/>
            </Card>
        </div>
    );
}
 
export default Canvas;