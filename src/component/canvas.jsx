import React from 'react';
import { Card, Row, Col, Icon,Popover,Button,Tag,List } from 'antd';
import pic1 from './img/minimap.PNG'
import pic2 from './img/colorMap.jpeg'
import { connect } from 'react-redux';
// import  data from "../data/data";
import ForceGraph from './forceGraph'
import MiniMap from './MiniMap/MiniMap';
import $ from 'jquery'
import createAction from '../actions';
import { NONAME } from 'dns';
const Canvas = ({ colorMap, updateListPanelContent }) => {
    const displayed = () => {
        document.getElementById("clickRightMenu").style.display = "none";
    }
    const handleSeeDetails = () => {
        let el = $("#clickRightMenu").attr('el');
        updateListPanelContent(el);
        displayed();
    }
    return (
        <div>               
            <Card bordered={true}
                style={{ margin:"20px 20px 20px 0px " }}
                size={"small"}   >
                {/* {data.nodes[0].id} */}
                               
                <Col span={1}>
                <ul className="clickRightMenu" id="clickRightMenu">
                        
                        <li className="li1" onClick={ handleSeeDetails } >See details
                            {/* <ul className="nav2">
                                <li className="li2">1</li>
                            </ul> */}
                        </li>
                        <li className="li1">Add As A Source </li>
                        <li className="li1">Add As A Target </li>
                </ul>
                <ForceGraph />                                        
                </Col>
                
                <Col span={4}>
                {colorMap!==undefined && Object.values(colorMap).length>0? <Card id="wedget" cover={
                    <div >community: {Object.values(colorMap).map(item => <Tag color={item} style={{height:"16px",background:{item}, borderRadius:"0px"}}></Tag> ) } </div>
                } bodyStyle={{ padding: 0 }} size="small" bordered={false}>
                </Card> : null  }
                </Col>
                <Col span={15}></Col>
                <Col span={4}><Card className="heatmap"
                    // cover={<MiniMap></MiniMap>}
                    bodyStyle={{ padding: 0 }} size="small" extra={<a href="#"><Icon type="close" /></a>}
                ></Card>
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
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateListPanelContent: listPanelContent => {
            dispatch(createAction("updateListPanelContent", listPanelContent));
        }
    }
}    
const C = connect(
    mapStateToProps,mapDispatchToProps
)(Canvas)
export default C;