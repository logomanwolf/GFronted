import React, { Component } from 'react';
import nodes_4000  from '../data/data';
import nodes_62 from '../data/data1';
import createAction from '../actions';
import { connect } from 'react-redux'
import colorMap from '../settings/colorMap';
import { getShortestPath } from '../settings/settings'
import URLSearchParams from 'url-search-params';
import * as d3color from 'd3-color';
import * as d3interpolate from 'd3-interpolate';
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
        const { addG, updateCurClickNode } = this.props;
        const handleNodeClick = el => {
            var clickRightHtml = document.getElementById("clickRightMenu");
            clickRightHtml.style.display = "inline";
            clickRightHtml.style.left = el.attrs.x + "px";
            clickRightHtml.style.top = el.attrs.y + "px";
            console.log("el.attrs.x:" + el.attrs.x + '  ' + 'el.attrs.y' + el.attrs.y + ' ');
            clickRightHtml.style.zIndex = 100;
            clickRightHtml.setAttribute('el', el.id);
            this.curClickNode = el;
            updateCurClickNode(el);
        }
        var gl = canvas.getContext('webgl2');
         // eslint-disable-next-line
        this.g = new G({
            container: canvas,
            data: nodes_4000
        });
        this.g.initSearchIndice();
        this.g.initInteraction();
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

        addG({ g: this.g, stamp: new Date() });
        this.g.draw();
        this.g.on('click', el => {
            handleNodeClick(el);
        })
    }
    initNodes() {
        this.g.nodes().toArray().forEach(
            (item) => {
                const oldStyle = this.g.getNodeById(item.id).style();
                this.g.getNodeById(item.id).style({...oldStyle,fill: '#000000' });
                }
        )
        this.g.edges().toArray().forEach(
            item => {
                this.g.getEdgeById(item.id).style({fill:'#E0E0E0',lineWidth:1})
            }
        )
    }

    dataMap = {
        "nodes_4000": nodes_4000,
        "nodes_62":nodes_62
    }
    highlightPath = data => {
        data.forEach(item => {
            item.forEach(n => {
                this.g.getNodeById(n).style({ fill: '#607D8B' });
            });
            for (let i = 0; i < item.length - 1; i++) {
                console.log(item[i] + '->' + item[i + 1]);
                const data = this.g.getEdgesByAttribute('source', item[i]).getEdgesByAttribute('target', item[i + 1]).toArray()
                    .concat(this.g.getEdgesByAttribute('source', item[i+1]).getEdgesByAttribute('target', item[i]).toArray())
                    data[0].style({  fill: "#ccc" });
            }
        });
    }
    componentWillReceiveProps(newProps) {
        const { id, community, addColorMap, addG, shortestPath, filename,source,target,layout } = newProps;

        this.initNodes();        
        //点击查找会找到指定的id，并在主视区中显示
        if (id !== undefined && id !== null) {
            console.log(id)
            if (this.lastId !== undefined) {
                const lastOldStyle = this.g.getNodeById(this.lastId).style();
                this.g.getNodeById(this.lastId).style({...lastOldStyle, fill: '#000000' });
            }
            const oldStyle = this.g.getNodeById(id).style();
            this.g.panToNode(id);
            this.g.getNodeById(id).style({ ...oldStyle,fill: '#FFC125' });
            this.lastId = id;
            // this.force.data(this.g.data());
        }
        //点击社团检测开关，可以在主视图中看到用不同的颜色编码社团
        if (community !== undefined) {
            let color = {};
                for (var key in community) {
                    this.g.getNodeById(key).attrs["group"] = community[key];
                    const oldStyle = this.g.getNodeById(key).style()
                    if (community[key] < colorMap.length) {
                        this.g.getNodeById(key).style({ ...oldStyle, fill: colorMap[community[key]] });
                        color[community[key]] = colorMap[community[key]];
                    }
                    else {
                        const dealColor = d3interpolate.interpolateRgb(colorMap[community[key] % colorMap.length], colorMap[(community[key] + 1) % colorMap.length])(0.5);
                        color[community[key]] = dealColor;
                        this.g.getNodeById(key).style({...oldStyle,fill: dealColor  })
                    }                    
            }
            addColorMap(color)
            
            addG({g:this.g,stamp:new Date()});
        }
        if (source !== this.props.source) {
            this.g.getNodeById(source.id).style({ fill: "#607D8B" })
        }
        if (layout !== this.props.layout) {
            if (layout === "node-link") {
            // eslint-disable-next-line    
            const force = new d3Force({
                width: this.canvas.current.width,
                height: this.canvas.current.height,
            }); 
            force.data(this.g.data());
            force.start();
            force.onEnd(() => {
                console.log("draw finish");
                this.g.draw()
                this.g.initSearchIndice();
                this.g.initInteraction();
            });
            
            }
            else {
                if (filename === undefined)
                    this.g.data(this.dataMap["nodes_4000"]);
                else
                    this.g.data(this.dataMap[filename]);
                this.g.draw()
            }
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
                this.g.refresh();
                // this.initNodes()
            });
        }
        if (filename !== this.props.filename) {
            this.g.data(this.dataMap[filename]);
            addG(this.g);
            // this.g.draw();
        }
        this.g.refresh();
    }
    render() { 
        return (
            <canvas ref={this.canvas} width="1380px" height="1000px"  />
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
    const { shortestPath } = state.shortestPath;
    const { filename } = state.getFile;
    const { source } = state.updateSource;
    const { target } = state.updateTarget;
    const {layout}= state.updateLayout;
    // const {rollback}=state.rollback
    console.log(id);
    return {
        id, community, shortestPath, filename,source,target,layout
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
        }
    }
} 
const Content=connect(mapStateToProps,mapDispatchToProps)(ForceGraph)
export default Content;
 