import React, { Component } from 'react';
// import nodes_4000  from '../data/data';
// import nodes_70 from '../data/data1';
// import nodes_4000_nodelink from '../data/data4000_nodelink'
// import nodes_70_nodelink from '../data/lesmis_linknode'
import createAction from '../actions';
import { connect } from 'react-redux';
import colorMap from '../settings/colorMap';
import {
    getShortestPath, node_color, edge_color, canvas_background,
    highlightEdge, source_node_clicked, red,
    node_4000_hierarchy, node_4000_node_link, node_70_hierarchy, node_70_node_link, node_25_node_link,node_4000_node_link_circle,node_4000_node_link_square
} from '../settings/settings'
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
    fadeColor = color => {
        let oldcolor = {...color};
        let backgroundColor = d3.color('#000000');
        oldcolor.a = 0.2;
        let newR = oldcolor.r * oldcolor.a + backgroundColor.r * (1 - oldcolor.a);
        let newG = oldcolor.g * oldcolor.a + backgroundColor.g * (1 - oldcolor.a);
        let newB = oldcolor.b * oldcolor.a + backgroundColor.b * (1 - oldcolor.a);
        let newColor = {};
        newColor.r = newR;
        newColor.g = newG;
        newColor.b = newB;
        newColor.a = 255;
        return newColor;
    }
    //将所有的的nodes和edges淡去
    fadeNodesAndEdges = () => {
        let nodes = this.g.nodes().toArray();
        nodes.forEach(node => {
            let oldNodeStyle = node.oldStyle;
            // node.oldStyle = oldNodeStyle;
            node.style({ r:oldNodeStyle.r,  fill: this.fadeColor(oldNodeStyle.fill) });
        })
        let edges = this.g.edges().toArray();
            edges.forEach(edge => {
            let oldEdgeStyle = edge.oldStyle;
            // edge.oldStyle = oldEdgeStyle;
            edge.style({ lineWidth:oldEdgeStyle.lineWidth, fill: this.fadeColor(oldEdgeStyle.fill) });
        })
    }
    fadeNodeAndEdgesBack = () => {
        let nodes = this.g.nodes().toArray();
        nodes.forEach(node => {
            let oldNodeStyle = node.oldStyle;
            node.style({ r: oldNodeStyle.r, fill: { ...oldNodeStyle.fill }});
        })
        let edges = this.g.edges().toArray();
        edges.forEach(edge => {
            let oldEdgeStyle = edge.oldStyle;
            edge.style({ lineWidth:oldEdgeStyle.lineWidth,fill: {...oldEdgeStyle.fill}});
        })
    }
    enlargeEffect = (node,increseR1,increseR2) => {
        const oldStyle = node.oldStyle;
        const oldR = oldStyle.r;
        const mediaR = oldR*increseR1;
        const newR = oldR*increseR2 ;
        const motionInternal = 1;
        // node.style({r:13.4})
        this.nodeSizeMotion(node, mediaR,motionInternal*5).then((result)=>this.nodeSizeMotion(result, newR,motionInternal*3));
    }
    nodeSizeMotion = (node, newR, motionInternal)=>{
        let count = 5;
        // let montionInterval = 2;
        const oldStyle = node.nodeStyle;
        node.motionUnitR = (newR - node.style().r) / count;
        // console.log(node.motionUnitR);
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
            const { source } = this.props;
            if (el.attrs.hovered === undefined) {
                const neighbourEdges = this.g.getEdgesByAttribute("source", el.id).toArray().concat(this.g.getEdgesByAttribute("target", el.id).toArray());
                let neighbourNodes = [];
                el.attrs.hovered = true;
                // let oldStyle = el.style();
                let oldStyle = el.oldStyle;
                this.fadeNodesAndEdges();
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
                    item.style({  lineWidth: item.style().lineWidth+9 });
                })
                this.enlargeEffect(el, 2.2, 1.8);
                neighbourNodes.forEach(item => {
                    this.enlargeEffect(item, 0.8, 1);
                })
                if (source !== undefined) {
                    source.style({ fill: source_node_clicked ,r:20});
                    this.g.draw();
                    return;
                }
                this.g.draw();
            }   
        }
        const handleNodeOut = (el, e) => {
            if (el.attrs.hovered === true) {
                const { cluster, links,source } = this.props;
                                    
                if (cluster !== undefined )
                {
                    cluster.forEach((com,i) => {
                        if (com !== undefined)
                        {
                            com.forEach(item => {
                                item.style(item.oldStyle)
                            })
                        }
                    })      
                    links.forEach((com,i) => {
                        if (com !== undefined)
                        {
                            com.forEach(item => {
                                item.style(item.oldStyle
                                )
                            })
                        }
                    })    
                }
                else
                    this.fadeNodeAndEdgesBack();
                el.attrs.hovered = undefined;
                // fadeNodeAndEdgesBack();
                if (source !== undefined) {
                    source.style({ fill: source_node_clicked });
                    this.g.refresh();
                    return;
                }
                this.g.draw();
            }
        }
        
        //将所有的nodes和edges变回来
        

        var gl = canvas.getContext('webgl2');
        this.dataload((data)=>{
            //initG
             // eslint-disable-next-line
            this.g = new G({
                container: canvas,
                data: data,
                background: {
                    r: 0.07,
                    g: 0.07,
                    b: 0.07,
                    a: 1
                },
                mode: 'texture'
            });
            this.initNodes();
            // this.g.nodes().forEach(
            //     (item) => {
            //         item.style({r:item.attrs.radius ,fill: node_color });
            //         }
            // )
            // this.g.edges().forEach(
            //     item => {
            //         item.style({fill:edge_color,lineWidth:1})
            //     }
            // )
            this.g.loadTexture('./electric.png').then(() => {
                this.g.draw();
                this.g.initSearchIndice();
                this.g.initInteraction();
                this.bindZoom();
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
            })

        }, this.dataMap['nodes_4000_node_link']);
        // this.g.edges().forEach(edge => {
        //     edge.style({
        //         fill: {
        //             r: 224,
        //             g: 224,
        //             b: 224,
        //             a: 225
        //         },
        //         lineWidth: 1
        //     });
        // });

        // this.g.nodes().forEach(node => {
        //     node.style({
        //         fill: {
        //             r: 44,
        //             g: 146,
        //             b: 255,
        //             a: 255
        //         },
        //         // "#00ffff95"
        //         r: 10
        //     });
        // });
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
        //initG
    }
    initNodes() {
        this.g.nodes().forEach(
            (item) => {
                item.style({r:10 ,fill: {...node_color} });
                }
        )
        this.g.edges().forEach(
            item => {
                item.style({fill:{...edge_color},lineWidth:1})
            }
        )
    }
    bindZoom() {
        this.g.onZoom(() => {
            const transform = this.g._private.renderer.getTransform()
            if (transform.k < 0.25 && this.g.nodes().toArray().length>25) {
                d3.json(this.dataMap['nodes_25']).then((data) => {
                    this.g.data(data)
                    this.g.nodes().forEach(
                        (item) => {
                            item.style({ r: item.attrs.radius, fill: {...node_color} });
                    })
                    this.g.edges().forEach(
                        item => {
                            item.style({
                                lineWidth:item.attrs.width,fill:{...edge_color}
                            })
                        }
                    )
                    this.initOldStyle()
                    this.g.draw();
                    this.g.initSearchIndice();
                    this.g.initInteraction();
                    this.bindZoom();
                })
            }
            else if (transform.k > 0.25 && this.g.nodes().toArray().length === 25) {
                d3.json(this.dataMap['nodes_4000_node_link']).then((data) => {
                    this.g.data(data);
                    this.insertOldStyle();
                    this.g.draw();
                    this.g.initSearchIndice();
                    this.g.initInteraction();
                    this.bindZoom();
                })
            }
        });
    }

    dataMap = {
        "nodes_4000_hierarchy": node_4000_hierarchy,
        "nodes_70_hierarchy":node_70_hierarchy,
        'nodes_4000_node_link': node_4000_node_link,
        'nodes_70_node_link': node_70_node_link,
        'nodes_25': node_25_node_link,
        'nodes_4000_circle': node_4000_node_link_circle,
        'nodes_4000_square': node_4000_node_link_square
    }


    dataload = (func,filename) => {
        // d3.json('./data/member-edges-subgraph-addXY.json').then(func)
        d3.json(filename).then(func)
    }
    //highlight the shortestPath
    highlightPath(data) {
        this.fadeNodesAndEdges();
        data.forEach(item => {
            item.forEach((n, i) => {
                if (i === 0)
                    this.g.getNodeById(n).style({ fill: source_node_clicked, r: 20 });
                else if (i === item.length - 1)
                    this.g.getNodeById(n).style({ fill: { r: 255, g: 204, b: 199, a: 255 }, r: 20 });
                else
                    this.g.getNodeById(n).style({ fill:red });
            });
            for (let i = 0; i < item.length - 1; i++) {
                // console.log(item[i] + '->' + item[i + 1]);
                const data = this.g.getEdgesByAttribute('source', item[i]).getEdgesByAttribute('target', item[i + 1]).toArray()
                    .concat(this.g.getEdgesByAttribute('source', item[i+1]).getEdgesByAttribute('target', item[i]).toArray())
                // data[0].style({ fill: "#ccc" });
                data[0].style({ fill: edge_color });
            }
        });
        // this.props.updateSource(undefined);
    }
    motion = (collection1, collection2) => {
        let nodes = _.cloneDeep(collection1.nodes);
        let nodes2 = _.cloneDeep(collection2.nodes);
        let links = collection1.links.slice();
        let count = 5;
        let montionInterval = 0.1;
        const oldNodes = this.g.nodes();
        nodes.forEach((item,i) => {
            item.motionUnitX = (nodes2[i].x - item.x) / count;
            item.motionUnitY = (nodes2[i].y - item.y) / count;
            //这里的group在使用data函数后会变成attr.group
            item.group = oldNodes.getNodeById(item.id).attrs.group;
            item.oldStyle = _.cloneDeep(oldNodes.getNodeById(item.id).oldStyle);
            // item.oldStyle = oldNodes.getNodeById(item.id).oldStyle;
        })
        let intervalId=setInterval((g) => {
            nodes.forEach((item, i) => {
                item.x += item.motionUnitX;
                item.y += item.motionUnitY;
            })
            g.data({ nodes, links });
            
            g.nodes().forEach(item => {
                item.oldStyle = { fill: { ...item.attrs.oldStyle.fill }, r: item.attrs.oldStyle.r };
                // item.group = item.attrs.group;
                item.style({ fill: { ...item.oldStyle.fill }, r: item.oldStyle.r });
            })
            g.edges().forEach(item => {
                item.oldStyle = { fill: {...edge_color}, lineWidth: 1 };
                item.style({ fill: {...edge_color}, lineWidth: 1 })
            })
            
            g.draw();
            count--;
            if (count < 1) {
                g.initSearchIndice();
                g.initInteraction();
                clearInterval(intervalId);
            }
        }, montionInterval, this.g);
    }
    changeObjectToRgb(obj) {
        return 'rgb(' + obj.r+','+obj.g+','+obj.g+')';
    }
    componentWillReceiveProps(newProps) {
        const { id, community, addColorMap, addG, filename,source,target,layout,updateShortestPath } = newProps;
        // this.initNodes();        
        //点击查找会找到指定的id，并在主视区中显示
        if (id !== this.props.id) {
            // if (this.lastId !== undefined) {
            //     const lastOldStyle = this.g.getNodeById(this.lastId).style();
            //     this.g.getNodeById(this.lastId).style({ ...lastOldStyle, fill: node_color });
            // }
            this.fadeNodesAndEdges();
            this.g.panToNode(id);
            let node = this.g.getNodeById(id);
            node.style({ fill: red });
            this.enlargeEffect(node, 2.8, 2.2);
            // this.lastId = id;
            this.g.draw();
            // this.force.data(this.g.data());
        }
        //点击社团检测开关，可以在主视图中看到用不同的颜色编码社团
        if (community !== undefined) {            
            
            // addG(this.g);
        }
        
        if (community !== this.props.community) {
            let nodes = this.g.nodes();
            if(community===undefined)
            {
                nodes.forEach(
                item => {
                        item.oldStyle = { ...item.style(), fill: {...node_color} };
                        // item.style({...item.oldStyle})
                    })
                this.initNodes();
                this.g.refresh();
            }
            else {
                let color = {};
                for (var key in community) {
                    this.g.getNodeById(key).attrs["group"] = community[key];
                    const oldStyle = this.g.getNodeById(key).style();
                    if (community[key] < colorMap.length) {
                        this.g.getNodeById(key).style({ ...oldStyle, fill: colorMap[community[key]] });
                        color[community[key]] = colorMap[community[key]];
                    }
                    else {
                        const dealColor = d3.color(d3interpolate.interpolateRgb(this.changeObjectToRgb(colorMap[community[key] % colorMap.length]), this.changeObjectToRgb(colorMap[(community[key] + 1) % colorMap.length]))(0.5));;
                        color[community[key]] = {r:dealColor.r,g:dealColor.g,b:dealColor.b,a:Math.round(dealColor.opacity*255) };
                        this.g.getNodeById(key).style({ ...oldStyle, fill: color[community[key]] })
                    }
                }
                addColorMap(color);
                nodes.forEach(
                    item => {
                        item.oldStyle = { ...item.style()};
                    })
                this.g.refresh();
            }
        }
        if (layout !== this.props.layout) {
            //toDo:定义一个动画函数
            const changeLayout = (filename1, filename2) => {
                    this.dataload((data1) => { 
                        this.dataload((data2) => {
                            this.motion(data1, data2);
                        }, filename2);
                    },filename1)
                };
            const oldLayout = this.props.layout===undefined? 'node_link':this.props.layout;
            //------------------------old_if--------------------------
            // if (layout === "node-link") {
            // // eslint-disable-next-line    
            //     if (filename === undefined || filename === 'nodes_4000_nodelink') {
            //         // // 这里是测试数据部分
            //         changeLayout('nodes_4000', 'nodes_4000_nodelink');
            //         setTimeout(() => { this.bindZoom() }, 1000);
            //     }   
            //     else if (filename === 'nodes_70_nodelink')
            //         changeLayout("nodes_70","nodes_70_nodelink");
            // }
            // else {
            //     if (filename === undefined || filename === 'nodes_4000_nodelink'){
            //         changeLayout("nodes_4000_nodelink", "nodes_4000")
            //     }
            //     else if (filename === 'nodes_70_nodelink')
            //     changeLayout("nodes_70_nodelink", "nodes_70"); 
            //     // eslint-disable-next-line
            //     const dotAnimation = new DotAnimation(this.g);
            //     dotAnimation._options.speed = 2;
            //     dotAnimation.startAnimationFromSource('1');
            // }
            //------------------------old_if----------------------------
            const Filename = (filename === undefined ? 'nodes_4000' : filename);
            changeLayout(this.dataMap[Filename + '_' + oldLayout], this.dataMap[Filename + '_' + layout]);
            this.g.draw();
            this.g.initInteraction();
            this.g.initSearchIndice();
            if (Filename === "nodes_4000" && layout === 'node_link')
                setTimeout(() => { this.bindZoom() }, 1000);
        }
        if (target !== this.props.target && target!==undefined  ) {
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
                // console.log(response);  
                this.highlightPath(response);
                updateShortestPath(response);
                this.g.draw();
                return response;
                // this.initNodes()
            }).then(response => {
                console.log('alterResponse!!')
                // console.log(this.alterResponse(response, this.g));
                 // eslint-disable-next-line
                const dotAnimation = new DotAnimation(this.g);
                dotAnimation._options.speed = 2;
                dotAnimation.startAnimation(this.alterResponse(response, this.g));
            });
        }
        if (filename !== this.props.filename) {
            this.dataload((data)=>{
                this.g.data(data);
                this.insertOldStyle();
                // addG(this.g);
                this.g.draw();
                this.g.initSearchIndice();
                this.g.initInteraction();
                if (filename==='nodes_4000')
                    this.bindZoom();
            }, this.dataMap[filename + '_node_link']);
        }
        // this.g.draw();
    }
    insertOldStyle() {
        this.g.nodes().forEach(item => {
            item.oldStyle = {r:10,fill:{...node_color}};
            item.style(item.oldStyle);
        });
        this.g.edges().forEach(item => {
            item.oldStyle ={lineWidth:1, fill:{...edge_color} };
            item.style(item.oldStyle);
        })
    }
    initOldStyle() {
        this.g.nodes().forEach(
            (item) => {
                item.oldStyle = {r:item.style().r,fill:{...node_color}};
            }
        )
        this.g.edges().forEach(
            item => {
                item.oldStyle = {lineWidth:item.style().lineWidth,fill:{...edge_color}};
            }
        )
    }
    alterResponse(response,g) {
        let newData = _.unzip(response);
        let uniqData = _.uniq(_.flatten(newData));
        let dictData = _.zipObject(uniqData, Array(uniqData.length).fill(false));
        let result = [];
        newData.forEach(item => {
            let inner = [];
            item.forEach(it => {
                if (!dictData[it]) {
                    inner.push(it);
                    dictData[it] = true;
                }
            })
            result.push(inner)
        })
        let realism = [];
        for (let i = 0; i < result.length - 1; i++) {
            let hierarchy = [];
            let firstArray = result[i];
            let nextArray = result[i + 1];
            // eslint-disable-next-line no-loop-func
            firstArray.forEach(first => {
                nextArray.forEach(next => {
                    if (g.getEdgeByNodes({ source: first, target: next }) !== undefined) {
                        let inv = true;
                        if (g.getEdgeByNodes({ source: first, target: next }).source === first)
                        inv = false;
                        hierarchy.push({ id: g.getEdgeByNodes({ source: first, target: next }).id ,inv});
                    }
                    // else if (g.getEdgeByNodes({ source: next, target: first }) !== undefined)
                    //     hierarchy.push(g.getEdgeByNodes({ source: next, target: first }).id);
                })
            })
            realism.push(hierarchy);
        }
        return realism;
    }
    render() { 
        return (
            <div>
            <canvas ref={this.canvas} width="1380px" height="1000px" style={{ backgroundColor: canvas_background }} />
            {/* <canvas
                id="text"
                width="1380px"
                height="1000px"
                style={{position: "absolute", left: 0, top: 0, zIndex: 10, pointerEvents: "none",color:"#FFFFFF"}}
                >
            </canvas> */}
                </div>
        );
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
    const { links } = state.chooseLinks;
    // const {rollback}=state.rollback
    // console.log(id);
    return {
        id, community,  filename,source,target,layout,cluster,links
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
 