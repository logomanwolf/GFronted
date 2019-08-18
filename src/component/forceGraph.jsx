import React, { Component } from 'react';
import nodes_4000  from '../data/data';
import nodes_62 from '../data/data1';
import nodes_4000_nodelink from '../data/data4000_nodelink'
import lesmis_nodelink from '../data/lesmis_linknode'
import createAction from '../actions';
import { connect } from 'react-redux';
import colorMap from '../settings/colorMap';
import { getShortestPath,node_color,edge_color,canvas_background } from '../settings/settings'
import URLSearchParams from 'url-search-params';
import * as d3color from 'd3-color';
import * as d3interpolate from 'd3-interpolate';
import * as d3 from 'd3';
import _ from 'lodash' 

// import * as d3Force from 'd3-force';
class ForceGraph extends Component {
    state = {};
    g = {};
    force = {};
    lastId = undefined;
    startId = undefined;
    endId = undefined;
    curClickNode=undefined
    // G=require('../utils/G.js')
    constructor(){
        super();
        this.canvas = React.createRef();
        this.state={}
    }
    
    componentDidMount() {
        // const {d3Force,G}=require('../utils/G')
        const canvas = this.canvas.current;
        const { addG, updateCurClickNode,cluster } = this.props;
        const handleNodeClick = (el,e) => {
            var clickRightHtml = document.getElementById("clickRightMenu");
            clickRightHtml.style.display = "inline";
            clickRightHtml.style.left = e.clientX - 500 + "px";
            clickRightHtml.style.top = e.clientY - 30 + "px";
            // console.log("el.attrs.x:" + el.attrs.x + '  ' + 'el.attrs.y:' + el.attrs.y + ' ');
            clickRightHtml.style.zIndex = 200;
            //this is for Detail Panel
            clickRightHtml.setAttribute('el', el.id);
            this.curClickNode = el;
            updateCurClickNode(el);
        }
        const handleNodeHover = (el, e) => {
            if (el.attrs.hovered === undefined) {
                const neighbourEdges = this.g.getEdgesByAttribute("source", el.id).toArray().concat(this.g.getEdgesByAttribute("target", el.id).toArray());
                let neighbourNodes = [];
                el.attrs.hovered = true;
                // let oldStyle = el.style();
                let oldStyle = el.oldStyle;
                fadeNodesAndEdges();
                el.style({ ...oldStyle });
                neighbourEdges.forEach(item => {
                    if (item.source !== el.id) {
                        let node = this.g.getNodeById(item.source);
                        node.style({ ...oldStyle });
                        neighbourNodes.push(node);
                    }
                    else if (item.target !== el.id) {
                        let node = this.g.getNodeById(item.target);
                        node.style({ ...oldStyle });
                        neighbourNodes.push(node);
                    }
                    item.style({ ...item.oldStyle, lineWidth: 2 });
                })
                enlargeEffect(el, 2.2, 1.8);
                neighbourNodes.forEach(item => {
                    enlargeEffect(item, 0.8, 1);
                })
                this.g.draw();
            }   
        }
        const handleNodeOut = (el, e) => {
            if (el.attrs.hovered === true) {
                if (cluster !== undefined)
                    cluster.forEach(com => {
                        
                    })
                el.attrs.hovered = undefined;
                // fadeNodeAndEdgesBack();
                
                this.g.draw();
            }
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
        const fadeNodesAndEdges = () => {
            let nodes = this.g.nodes().toArray();
            nodes.forEach(node => {
                let oldNodeStyle = node.oldStyle;
                // node.oldStyle = oldNodeStyle;
                node.style({ ...oldNodeStyle, fill: fadeColor(oldNodeStyle.fill) });
            })
            let edges = this.g.edges().toArray();
                edges.forEach(edge => {
                let oldEdgeStyle = edge.oldStyle;
                // edge.oldStyle = oldEdgeStyle;
                edge.style({ ...oldEdgeStyle, fill: fadeColor(oldEdgeStyle.fill) });
            })
        }
        //将所有的nodes和edges变回来
        const fadeNodeAndEdgesBack = () => {
            let nodes = this.g.nodes().toArray();
            nodes.forEach(node => {
                let oldNodeStyle = node.oldStyle;
                node.style({ ...oldNodeStyle });
            })
            let edges = this.g.edges().toArray();
            edges.forEach(edge => {
                let oldEdgeStyle = edge.oldStyle;
                edge.style({ ...oldEdgeStyle});
            })
        }
        const enlargeEffect = (node,increseR1,increseR2) => {
            const oldStyle = node.oldStyle;
            const oldR = oldStyle.r;
            const mediaR = oldR*increseR1;
            const newR = oldR*increseR2 ;
            const motionInternal = 1;
            // node.style({r:13.4})
            nodeSizeMotion(node, mediaR,motionInternal*5).then((result)=>nodeSizeMotion(result, newR,motionInternal*3));
        }
        const nodeSizeMotion = (node, newR, motionInternal)=>{
            let count = 5;
            // let montionInterval = 2;
            const oldStyle = node.nodeStyle;
            node.motionUnitR = (newR - node.style().r) / count;
            console.log(node.motionUnitR);
            return new Promise((resolve, reject) => {
                let intervalId=setInterval((g) => {
                    node.style({ ...oldStyle, r: node.style().r + node.motionUnitR });
                    g.refresh();                    
                    count--;
                    if (count < 1) {
                        clearInterval(intervalId);
                        resolve(node);
                    }
                }, motionInternal, this.g);
            })
        }
        var gl = canvas.getContext('webgl2');
         // eslint-disable-next-line
        this.g = new G({
            container: canvas,
            data: nodes_4000
        });

        var clickRightHtml = document.getElementById("clickRightMenu");
        clickRightHtml.style.display = "none";//每次右键都要把之前显示的菜单隐藏哦
        
        // canvas.oncontextmenu = function (event) {
        //     var event = event || window.event;
        //     clickRightHtml.style.display = "inline";
        //     clickRightHtml.style.left = event.clientX - 500 + "px";
        //     clickRightHtml.style.top = event.clientY - 30 + "px";
        //     console.log(event.clientX, event.clientY)
        //     return false;//屏蔽浏览器自带的右键菜单
        // };        
        this.g.draw();
        this.g.initSearchIndice();
        this.g.initInteraction();
        this.g.on('click', (el,e) => {
            handleNodeClick(el,e);
        })
        this.g.on('mouseOver', (el, e) => {
            handleNodeHover(el, e);
        })
        this.g.on('mouseOut', (el, e) => {
            handleNodeOut(el, e);
        })
        this.g.nodes().toArray().forEach(item => {
            item.oldStyle = { ...item.style() };
        })
        this.g.edges().forEach(
            item=>
            { item.oldStyle = { ...item.style() } }
        )
        addG(this.g);
    }
    initNodes() {
        this.g.nodes().toArray().forEach(
            (item) => {
                // const oldStyle = this.g.getNodeById(item.id).oldStyle;
                // this.g.getNodeById(item.id).style({...oldStyle,fill: node_color });
                const oldStyle = item.oldStyle;
                item.style({...oldStyle,fill: node_color });
                }
        )
        this.g.edges().toArray().forEach(
            item => {
                // this.g.getEdgeById(item.id).style({fill:edge_color,lineWidth:1})
                item.style({fill:edge_color,lineWidth:1})
            }
        )
    }

    dataMap = {
        "nodes_4000": nodes_4000,
        "nodes_62": nodes_62,
        'nodes_4000_nodelink': nodes_4000_nodelink,
        'lesmis_nodelink':lesmis_nodelink
    }
    //highlight the shortestPath
    highlightPath = data => {
        data.forEach(item => {
            item.forEach(n => {
                this.g.getNodeById(n).style({ fill: '#FF0000' });
            });
            for (let i = 0; i < item.length - 1; i++) {
                // console.log(item[i] + '->' + item[i + 1]);
                const data = this.g.getEdgesByAttribute('source', item[i]).getEdgesByAttribute('target', item[i + 1]).toArray()
                    .concat(this.g.getEdgesByAttribute('source', item[i+1]).getEdgesByAttribute('target', item[i]).toArray())
                // data[0].style({ fill: "#ccc" });
                data[0].style({ fill: "#e19d54" });
            }
        });
    }
    motion = (collection1, collection2) => {
        let nodes = _.cloneDeep(collection1.nodes);
        let nodes2 = _.cloneDeep(collection2.nodes);
        let links = collection1.links.slice();
        let count = 5;
        let montionInterval = 5;
        const oldNodes = this.g.nodes();
        nodes.forEach((item,i) => {
            item.motionUnitX = (nodes2[i].x - item.x) / count;
            item.motionUnitY = (nodes2[i].y - item.y) / count;
            item.group = oldNodes.getNodeById(item.id).attrs.group;
            item.oldStyle = _.cloneDeep(oldNodes.getNodeById(item.id).oldStyle);
        })
        let intervalId=setInterval((g) => {
            nodes.forEach((item, i) => {
                item.x += item.motionUnitX;
                item.y += item.motionUnitY;
            })
            g.data({nodes,links});
            g.draw()
            count--;
            if (count < 1) {
                g.nodes().forEach(item => {
                    item.oldStyle = item.attrs.oldStyle;
                    // item.group = item.attrs.group;
                    item.style({ ...item.oldStyle });
                })
                g.edges().forEach(item => {
                    item.oldStyle = item.style();
                })
                g.refresh();
                g.initSearchIndice();
                g.initInteraction();
                clearInterval(intervalId);
            }
        }, montionInterval, this.g);
    }
    componentWillReceiveProps(newProps) {
        const { id, community, addColorMap, addG, filename,source,target,layout,updateShortestPath } = newProps;
        this.initNodes();        
        //点击查找会找到指定的id，并在主视区中显示
        if (id !== undefined && id !== null) {
            console.log(id)
            if (this.lastId !== undefined) {
                const lastOldStyle = this.g.getNodeById(this.lastId).style();
                this.g.getNodeById(this.lastId).style({ ...lastOldStyle, fill: node_color });
            }
            const oldStyle = this.g.getNodeById(id).style();
            this.g.panToNode(id);
            this.g.getNodeById(id).style({ ...oldStyle,fill: '#FF0000' });
            this.lastId = id;
            // this.force.data(this.g.data());
        }
        //点击社团检测开关，可以在主视图中看到用不同的颜色编码社团
        if (community !== undefined) {            
            let color = {};
            for (var key in community) {
                this.g.getNodeById(key).attrs["group"] = community[key];
                const oldStyle = this.g.getNodeById(key).style();
                if (community[key] < colorMap.length) {
                    this.g.getNodeById(key).style({ ...oldStyle, fill: colorMap[community[key]] });
                    color[community[key]] = colorMap[community[key]];
                }
                else {
                    const dealColor = d3.color(d3interpolate.interpolateRgb(colorMap[community[key] % colorMap.length], colorMap[(community[key] + 1) % colorMap.length])(0.5)).hex();
                    color[community[key]] = dealColor;
                    this.g.getNodeById(key).style({...oldStyle,fill: dealColor  })
                }                    
            }
            addColorMap(color);
            // addG(this.g);
        }
        
        if (community !== this.props.community) {
            let nodes = this.g.nodes();
            if(community===undefined)
            nodes.forEach(
                item => {
                    item.oldStyle = { ...item.style(), fill: node_color };
                })
            else {
                nodes.forEach(
                    item => {
                        item.oldStyle = { ...item.style()};
                    })  
            }
        }
        if (source !== this.props.source) {
            this.g.getNodeById(source.id).style({ fill: "#607D8B" })
        }
        if (layout !== this.props.layout) {
            //toDo:定义一个动画函数
            if (layout === "node-link") {
            // eslint-disable-next-line    
                if (filename === undefined || filename === 'nodes_4000') {
                    this.motion(this.dataMap["nodes_4000"], this.dataMap['nodes_4000_nodelink']);
                    // this.g.data(this.dataMap['nodes_4000_nodelink'])
                }   
                else if (filename === 'nodes_62')
                    this.motion(this.dataMap["nodes_62"], this.dataMap['lesmis_nodelink']);
                    // this.g.data(this.dataMap['lesmis_nodelink'])
            }
            else {
                if (filename === undefined || filename === 'nodes_4000'){
                    this.motion(this.dataMap["nodes_4000_nodelink"], this.dataMap['nodes_4000']);
                    // this.g.data(this.dataMap["nodes_4000"]);
                }
                else if (filename === 'nodes_62')
                    this.motion(this.dataMap["lesmis_nodelink"], this.dataMap[filename]);
                    // this.g.data(this.dataMap[filename]);
            }
            this.g.draw();
        }
        if (target !== this.props.target) {
            const searchParams = new URLSearchParams();
            searchParams.set("start", source.id);
            searchParams.set("end", target.id);
            fetch(getShortestPath, {
                method: "POST",
                mode: "cors",
                body: searchParams
                // headers: { 'Accept': 'application/json,text/plain,*/*' }   ,
            }).then(r => {
                return r.json();
            }).then(response => {
                console.log("get shortest path!");
                console.log(response);  
                this.highlightPath(response);
                updateShortestPath(response);
                this.g.draw();
                // this.initNodes()
            });
        }
        if (filename !== this.props.filename) {
            this.g.data(this.dataMap[filename]);
            this.insertOldStyle();
            // addG(this.g);
            // this.g.draw();
        }
        this.g.draw();
        this.g.initSearchIndice();
        this.g.initInteraction();
    }
    insertOldStyle() {
        this.g.nodes().toArray().forEach(item => {
            item.oldStyle = item.style();
        });
        this.g.edges().toArray().forEach(item => {
            item.oldStyle = item.style();
        })
    }
    render() { 
        return (
            <canvas ref={this.canvas} width="1380px" height="1000px" style={{backgroundColor:canvas_background}} />
        );
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.filename !== this.props.filename) {
            this.g.draw();
        }
    }
}
const mapStateToProps = (state, ownProps) => {  
    const { id } = state.alterData;
    const { community } = state.addCommunityDetect;
    const { filename } = state.getFile;
    const { source } = state.updateSource;
    const { target } = state.updateTarget;
    const { layout } = state.updateLayout;
    const { cluster } = state.chooseCluster;
    // const {rollback}=state.rollback
    console.log(id);
    return {
        id, community,  filename,source,target,layout,cluster
    }
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        addG:g => {
            dispatch(createAction("addG",g));
        },
        addColorMap: colorMap => {
            dispatch(createAction("addColorMap",colorMap))
        },
        updateCurClickNode: curClickNode => {
            dispatch(createAction("updateCurClickNode",curClickNode))
        },
        updateShortestPath: shortestPath => {
            dispatch(createAction("updateShortestPath",shortestPath))
        }
    }
} 
const Content=connect(mapStateToProps,mapDispatchToProps)(ForceGraph)
export default Content;
 