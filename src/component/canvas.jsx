import React from 'react';
import { Card, Row, Col, Icon,Popover,Button,Tag } from 'antd';
import pic1 from './img/minimap.PNG'
import pic2 from './img/colorMap.jpeg'
import { connect } from 'react-redux';
// import  data from "../data/data";
import ForceGraph from './forceGraph'
import MiniMap from './MiniMap/MiniMap';
const Canvas = ({ colorMap }) => {
    return (
        <div>               
            <Card bordered={true}
                style={{ margin:"20px 20px 20px 0px " }}
                size={"small"}   >
                {/* {data.nodes[0].id} */}
                               
                <Col span={1}>                    
                    <ForceGraph />                                        
                </Col>
                
                <Col span={4}>
                {colorMap!==undefined ? <Card id="wedget" cover={
                    <div>community: {Object.values(colorMap).map(item => <Tag color={item} style={{height:"16px",background:{item}, borderRadius:"0px"}}></Tag> ) } </div>
                } bodyStyle={{ padding: 0 }} size="small" bordered={false}>
                </Card> : null  }
                </Col>
                <Col span={14}></Col>
                <Col span={5} style={{height:"250px"}}>
                    <MiniMap className="heatmap"></MiniMap>
                </Col>
                
            </Card>
        </div>
    );
}
const mapStateToProps = (state, ownProps) => {
    const { colorMap } = state.addColorMap
    // const {rollback}=state.rollback
    console.log(colorMap);
    return {
        colorMap
    }
} 
const C = connect(
    mapStateToProps
)(Canvas)
export default C;