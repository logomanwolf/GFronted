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
    state = {innerCluster:{},innerLinks:{}}
    findCommunity(g, group) {
        let community = [];
        let nodes = g.nodes().toArray();
        nodes.forEach(node => {
        if (node.attrs.group === group) {
            community.push(node);
        }
        })
        return community;
    }
    findLinks(g, group) {
        let links = [];
        let edges = g.edges();
        edges.forEach(edge => {
        if (g.getNodeById(edge.source).attrs.group === group && g.getNodeById(edge.target).attrs.group === group) {
            links.push(edge);
        }
        })
        return links;
    }
    
    componentDidMount() {
        // const { colorMap} = this.props;
        // const checkedArray =colorMap===undefined? undefined: Array(Object.keys(colorMap).length).fill(false);
        // const chosenCluster = {};
        // this.setState({chosenCluster});
    }
    componentWillReceiveProps(newProps){
        const { colorMap } = newProps;
        if (colorMap != this.props.colorMap && colorMap !== undefined) {
            const checkedArray =  Array(Object.keys(colorMap).length).fill(false);
            this.setState({ ...this.state,checkedArray});
        }
    }
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
            updateTarget(undefined);
            if(source !== curClickNode)
                updateSource(curClickNode);
        }
        const handleAddTarget = () => {
            displayed();
            if (source !== undefined && target !== curClickNode)
                updateTarget(curClickNode);
            // updateSource(undefined);
        }
        const allFalse = (array) => {
            let flag = true;
            array.forEach(item => {
                if (item === true)
                    flag= false;
            })
            return flag;
        }
        const handleTagClick = (e, tag) => {
            const { checkedArray, innerCluster,innerLinks } = this.state;
            const { g,chooseCluster,chooseLinks } = this.props;
            const checked = checkedArray[tag];
            if (checked === true) {
                checkedArray[tag] = false;
                innerCluster[tag] = undefined;
                innerLinks[tag] = undefined;
                // fadeNodesAndEdges(g);
            }
            else {
                checkedArray[tag] = true;
                innerCluster[tag] = this.findCommunity(g, tag);
                innerLinks[tag] = this.findLinks(g,tag);
                // fadeNodesAndEdges(g);
            }
            this.setState({ checkedArray, innerCluster, innerLinks });
            const communities = Object.values(innerCluster);
            const links = Object.values(innerLinks);

            if (allFalse(Object.values(checkedArray)))
            {
                fadeNodeAndEdgesBack(g);
                chooseCluster(undefined);
                chooseLinks(undefined)
            }
            else {
                fadeNodesAndEdges(g);
                highLightCommunityAndLink(g, communities, links);
                chooseCluster(communities);
                chooseLinks(links)
            }
            g.draw();
        }
        
        // const highLightCommunityAndLink = (g,groupArray) => {
        //     groupArray.forEach(group => {
        //         let edges = g.edges().toArray();
        //         edges.forEach(edge => {
        //             let source = g.getNodeById(edge.source);
        //             let target = g.getNodeById(edge.target);
        //             if (source.attrs.group === group && target.attrs.group === group) {
        //                 source.style({ ...source.oldStyle });
        //                 target.style({ ...target.oldStyle });
        //                 edge.style({ ...edge.oldStyle });
        //             }
        //         })
        //     })
        // }
        const highLightCommunityAndLink = (g, communities,links) => {
            // let edges = graph.edges().toArray();
            communities.forEach(group => {
                if (group === undefined)
                    return;
                group.forEach(node => {
                    node.style({r:node.oldStyle.r,fill: {...node.oldStyle.fill} });
                })
                // edges.forEach(item => {
                //     if (checkedArray[graph.getNodeById(item.source).attrs.group] === true && checkedArray[graph.getNodeById(item.target).attrs.group])
                //         item.style({ ...item.oldStyle, lineWidth: 2 });
                // })
            })
            links.forEach(group => {
                if (group === undefined)
                    return;
                    group.forEach(link=>{link.style({ ...link.oldStyle })});
            })
        }
        const fadeColor = color => {
            const oldcolor = {...color};
            const backgroundColor = d3.color('#000000');
            oldcolor.a = 0.2;
            const newR = oldcolor.r * oldcolor.a + backgroundColor.r * (1 - oldcolor.a);
            const newG = oldcolor.g * oldcolor.a + backgroundColor.g * (1 - oldcolor.a);
            const newB = oldcolor.b * oldcolor.a + backgroundColor.b * (1 - oldcolor.a);
            let newColor = {};
            newColor.r = Math.round(newR);
            newColor.g = Math.round(newG);
            newColor.b = Math.round(newB);
            newColor.a = 255;
            return newColor;
        }
        //将所有的的nodes和edges淡去
        const fadeNodesAndEdges = (g) => {
            let nodes = g.nodes().toArray();
            nodes.forEach(node => {
                // if(node.oldStyle===undefined)
                //     node.oldStyle =node.style();
                node.style({ r:node.oldStyle.r, fill: fadeColor(node.oldStyle.fill) });
            })
            let edges = g.edges().toArray();
                edges.forEach(edge => {
                    // if (edge.oldStyle === undefined)
                    //     edge.oldStyle = edge.style();
                edge.style({ lineWidth:edge.oldStyle.lineWidth, fill: fadeColor(edge.oldStyle.fill) });
            })
        }
        //将所有的nodes和edges变回来
        const fadeNodeAndEdgesBack = (g) => {
            let nodes = g.nodes().toArray();
            nodes.forEach(node => {
                let oldNodeStyle = node.oldStyle;
                node.style({ r: oldNodeStyle.r, fill: { ...oldNodeStyle.fill }});
            })
            let edges = g.edges().toArray();
            edges.forEach(edge => {
                let oldEdgeStyle = edge.oldStyle;
                edge.style({ lineWidth:oldEdgeStyle.lineWidth,fill: {...oldEdgeStyle.fill}});
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
                                {
                                    const tag_color = 'rgba(' + item.r + ',' + item.g + ',' + item.b + ',' + item.a + ')';
                                    return <Tag key={i} className="tag" color={tag_color} style={{ backgroundColor: tag_color, borderWidth: this.state.checkedArray[i] ? "2px" : "0px", borderColor: "#1826FF" }} onClick={(e) => {
                                        handleTagClick(e,i)
                                }}>{i}</Tag>})} </div>
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
    // console.log(colorMap);
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
        },
        chooseCluster:cluster => {
            dispatch(createAction("chooseCluster", cluster));
        },
        chooseLinks: links => {
            dispatch(createAction("chooseLinks", links));
        }
    }
}    
const C = connect(
    mapStateToProps,mapDispatchToProps
)(Canvas)
export default C;