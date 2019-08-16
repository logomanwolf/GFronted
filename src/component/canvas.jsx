import React, { Component } from 'react';
import { Card, Row, Col, Icon,Popover,Button,Tag,List  } from 'antd';
import pic1 from './img/minimap.PNG'
import pic2 from './img/colorMap.jpeg'
import * as d3 from 'd3';
import { connect } from 'react-redux';
// import  data from "../data/data";
import ForceGraph from './forceGraph'
import MiniMap from './MiniMap/MiniMap';
import $ from 'jquery'
import createAction from '../actions';
import { canvas_background, important_font, plain_text, card_background } from '../settings/settings'
class Canvas extends Component {
    state = { tagChecked:false }
    render() { 
        const { colorMap, updateListPanelContent, curClickNode, source, updateSource, target, updateTarget, g } = this.props;
        const displayed = () => {
            document.getElementById("clickRightMenu").style.display = "none";
        }
        const handleSeeDetails = () => {
            let el = $("#clickRightMenu").attr('el');
            updateListPanelContent(el);
            displayed();
        }
        const handleAddSource = () => {
            displayed();
            if(source !== curClickNode)
            updateSource(curClickNode);
        }
        const handleAddTarget = () => {
            displayed();
            if (source !== undefined && target !== curClickNode)
            updateTarget(curClickNode);
        }
        const handleTagClick = (e, tag) => {
            fadeNodeAndEdgesBack(g);
            const domEl = document.getElementsByClassName('tag');
            for (let i = 0; i < domEl.length; i++){
                let item = domEl[i];
                item.style.borderWidth = 0;
            }
            e.target.style.borderWidth = "2px";
            e.target.style.borderColor = "#1826FF";
            fadeNodesAndEdges(g)
            highLightCommunity(g, [tag]);
            g.draw();
        }
        const highLightCommunity = (g,groupArray) => {
            groupArray.forEach(group => {
                let edges = g.edges().toArray();
                edges.forEach(edge => {
                    let source = g.getNodeById(edge.source);
                    let target = g.getNodeById(edge.target);
                    if (source.attrs.group === group && target.attrs.group === group) {
                        source.style({ ...source.oldStyle });
                        target.style({ ...target.oldStyle });
                        edge.style({ ...edge.oldStyle });
                    }
                })
            })
        }
        const fadeColor = color => {
            let oldcolor = d3.color(color);
            let backgroundColor = d3.color('#000000');
            oldcolor.opacity = 0.2;
            let newR = oldcolor.r * oldcolor.opacity + backgroundColor.r * (1 - oldcolor.opacity);
            let newG = oldcolor.g * oldcolor.opacity + backgroundColor.g * (1 - oldcolor.opacity);
            let newB = oldcolor.b * oldcolor.opacity + backgroundColor.b * (1 - oldcolor.opacity);
            let newColor = oldcolor;
            newColor.r = newR;
            newColor.g = newG;
            newColor.b = newB;
            return newColor.hex();
        }
        //将所有的的nodes和edges淡去
        const fadeNodesAndEdges = (g) => {
            let nodes = g.nodes().toArray();
            nodes.forEach(node => {
                // if(node.oldStyle===undefined)
                //     node.oldStyle =node.style();
                node.style({ ...node.oldStyle, fill: fadeColor(node.oldStyle.fill) });
            })
            let edges = g.edges().toArray();
                edges.forEach(edge => {
                    // if (edge.oldStyle === undefined)
                    //     edge.oldStyle = edge.style();
                edge.style({ ...edge.oldStyle, fill: fadeColor(edge.oldStyle.fill) });
            })
        }
        //将所有的nodes和edges变回来
        const fadeNodeAndEdgesBack = (g) => {
            let nodes = g.nodes().toArray();
            // if (nodes[0].oldStyle === undefined)
            //     return;
            nodes.forEach(node => {
                let oldNodeStyle = node.oldStyle;
                node.style({ ...oldNodeStyle });
            })
            let edges = g.edges().toArray();
            edges.forEach(edge => {
                let oldEdgeStyle = edge.oldStyle;
                edge.style({ ...oldEdgeStyle});
            })
        }
        return (
            <div>               
                <Card bordered={false}
                    style={{ margin:"20px 20px 20px 0px ",backgroundColor:canvas_background }}
                    size={"small"}   >
                    {/* {data.nodes[0].id} */}
                                   
                    <Col span={1}>
                    <ul className="clickRightMenu" id="clickRightMenu">
                            
                            <li className="li1" onClick={ handleSeeDetails } >See details
                                {/* <ul className="nav2">
                                    <li className="li2">1</li>
                                </ul> */}
                            </li>
                            <li className="li1" onClick={handleAddSource}>Add As A Source </li>
                            <li className="li1" onClick={handleAddTarget}>Add As A Target </li>
                    </ul>
                    <ForceGraph />                                        
                    </Col>
                    
                    <Col span={4}>
                    {colorMap!==undefined && Object.values(colorMap).length>0? <Card id="wedget" cover={
                            <div style={{ padding: "0px 0px 10px 10px" }}><div style={{ margin: "5px 0px 0px 0px", color: important_font }}>Community:</div> {
                                Object.values(colorMap).map((item, i) =>
                                <Tag key={i} className="tag" color={item} style={{backgroundColor:item}} onClick={(e) => {
                                        handleTagClick(e,i)
                                }}>{i}</Tag>)} </div>
                    } bodyStyle={{ padding:0}} size="small" bordered={false}>
                    </Card> : null  }
                    </Col>
                    <Col span={15}></Col>
                    <Col span={4}>
                        {/* <Card className="heatmap"
                        // cover={<MiniMap></MiniMap>}
                        bodyStyle={{ padding: 0,height:250 }} size="small"
                        // extra={<a href="#"><Icon type="close" /></a>}
                    >
                        <MiniMap/>
                    </Card> */}
                    </Col>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { colorMap } = state.addColorMap;
    const { curClickNode } = state.updateCurClickNode;
    const { source } = state.updateSource;
    const { target } = state.updateTarget;
    const { g } = state.addG;
    // const {rollback}=state.rollback
    console.log(colorMap);
    return {
        colorMap,curClickNode,source,target,g
    }
} 
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateListPanelContent: listPanelContent => {
            dispatch(createAction("updateListPanelContent", listPanelContent));
        },
        updateSource: source => {
            dispatch(createAction("updateSource", source));
        },
        updateTarget:target => {
            dispatch(createAction("updateTarget", target));
        }
    }
}    
const C = connect(
    mapStateToProps,mapDispatchToProps
)(Canvas)
export default C;