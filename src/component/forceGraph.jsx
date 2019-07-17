import React, { Component } from 'react';
import data from '../data/data';
import * as d3 from 'd3'
import createAction from '../actions';
import { connect } from 'react-redux'
import colorMap from '../settings/colorMap';
import { getShortestPath } from '../settings/settings'
import URLSearchParams from 'url-search-params';
import drawRect from "./Renderer/drawRect"
import BatchDrawer from "./Renderer/BatchDraw"
class ForceGraph extends Component {
    state = {};
    g = {};
    force = {};
    lastId = undefined;
    startId = undefined;
    endId = undefined;
    canvas = undefined;
    // G=require('../utils/G.js')
    constructor(){
        super();
        this.canvas = React.createRef();
        this.state={}
    }
    componentDidMount() {
        // const {d3Force,G}=require('../utils/G')
        const canvas = this.canvas.current;
        const { addG } = this.props;
        var gl = canvas.getContext('webgl2');
         // eslint-disable-next-line
        this.g = new G({
            container: canvas,
            data: data
        });
        
         // eslint-disable-next-line
        this.force = new d3Force({
            width: canvas.width,
            height: canvas.height
        });   
        this.force.data(this.g.data());
        this.force.start()
        this.force.onTick(() => {
            this.g.draw()
        });
        this.force.onEnd(() => {
            console.log("draw finish");
            this.g.initSearchIndice();
            this.g.initInteraction();
            addG({ g: this.g, stamp: new Date() });
            // var content = JSON.stringify(this.g.nodes().toArray());
            // var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            // eslint-disable-next-line
            // saveAs(blob, "save.json");
        });
    }
    timeBatchDraw = (canvas, lines, dots) => {
        let params = {
            maxLines: lines.length,
            maxDots: dots.length,
            clearColor: {
                r: 1,
                g: 1,
                b: 1,
                a: 1
            },
            coordinateSystem: "pixels"
        }
        let batchDrawer = new BatchDrawer(canvas, params)
        if (batchDrawer.error != null) {
            console.log(batchDrawer.error)
            return
        }
        batchDrawer.updateCanvasSize(canvas.clientWidth, canvas.clientHeight)
        // console.time("BatchDraw");
        for (let i = 0; i < lines.length; i++) {
            batchDrawer.addLine(
                lines[i].fromX,
                lines[i].fromY,
                lines[i].toX,
                lines[i].toY,
                1,
                0,
                0,
                0.5,
                0.1
            )
        }

        for (let i = 0; i < dots.length; i++) {
            batchDrawer.addDot(dots[i].posX, dots[i].posY, 5, 0, 0, 0.5, 0.5)
        }

        // console.timeEnd("BatchDraw");

        function render() {
            requestAnimationFrame(render)
            batchDrawer.draw(true)
        }

        d3.select(canvas).call(d3.zoom().on("zoom", zoomed.bind(this)))

        function zoomed() {
            this.transform = {...d3.event.transform};
            batchDrawer.setScale(d3.event.transform)
            drawRect(d3.event.transform)
            // console.log("canvas",canvas.width,canvas.height)
        }

        this.scriptEndTime = new Date()

        // this.props.setTimer("script", this.scriptEndTime - this.scriptStartTime)

        // var renderStartTime = new Date()
        render()

        // this.props.setTimer("render", new Date() - renderStartTime)
    }
    renderWithBatchDraw = (container, graph) => {
        // container.innerHTML = ""
        console.log(graph)
        // console.log('#nodes: ', graph !== undefined ? graph.nodes.length : nodes.length, ', #edges: ', graph !== undefined ? graph.links.length : edges.length);
        this.scriptStartTime = new Date()
        var { nodes, links } = graph
        let w = container.clientWidth
        let h = container.clientHeight  
        if (nodes.length != 0) {
            var positions = []
            var min_x = Infinity,
                min_y = Infinity,
                max_x = -Infinity,
                max_y = -Infinity

            for (var i = 0; i < nodes.length; ++i) {
                min_x = Math.min(nodes[i].x, min_x)
                max_x = Math.max(nodes[i].x, max_x)
                min_y = Math.min(nodes[i].y, min_y)
                max_y = Math.max(nodes[i].y, max_y)
            }
            
            var id2node = new Map()
            var positionMap = {}
            var dots = []
            var diameter = Math.min(w, h) - 10
            for (var i = 0; i < nodes.length; ++i) {
                let node = nodes[i]
                id2node.set(node.id, node)
                node.x = (nodes[i].x - min_x) / (max_x - min_x) * diameter + w / 2 - diameter / 2
                node.y = (nodes[i].y - min_y) / (max_y - min_y) * diameter + h / 2 - diameter / 2
                dots[i] = {
                    posX: node.x,
                    posY: node.y
                }
            }
            this.dots = dots.slice();
            
            var lines = []
            for (var i = 0; i < links.length; ++i) {
                lines.push({
                    fromX: id2node.get(links[i].source).x,
                    fromY: id2node.get(links[i].source).y,
                    toX: id2node.get(links[i].target).x,
                    toY: id2node.get(links[i].target).y,
                })
            }

            this.timeBatchDraw(this.canvas, lines, dots)
        }
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
    componentWillReceiveProps(newProps) {
        const { id, community,addColorMap,addG,shortestPath } = newProps;
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
                    const oldStyle=this.g.getNodeById(key).style()
                    this.g.getNodeById(key).style({ ...oldStyle,fill: colorMap[community[key]] });
                    color[community[key]] = colorMap[community[key]];
            }
            addColorMap(color)
            addG(this.g.data());
        }
        //先打开最短路径开关，然后再点击起点和终点，显示轨迹
        if (shortestPath === true ) {
            this.g.on('click', el => {
                if (this.startId === undefined)
                    this.startId = el.id;
                else if (this.endId === undefined) {
                    this.endId = el.id;
                    const searchParams = new URLSearchParams();
                    searchParams.set("start", this.startId);
                    searchParams.set("end", this.endId);
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
                        response.forEach(item => {
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
                        this.g.refresh();
                        // this.initNodes()
                    });
                }
                else {
                    this.initNodes()
                    this.startId = el.id;
                    this.endId = undefined;
                }
                const oldStyle = this.g.getNodeById(el.id).style();
                this.g.getNodeById(el.id).style({...oldStyle, fill: 'red' });
                this.g.refresh();
            });
        }
        else if (shortestPath === false) {
            this.startId = undefined;
            this.endId = undefined;
            this.g.on('click', el => { });
        }
        this.g.refresh();
    }
    componentDidUpdate() {
        // debugger;
        let graph = {
            nodes: this.g.nodes().toArray().map(item => { return { id: item.id, x: item.attrs.x, y: item.attrs.y } }),
            links: this.g.edges().toArray().map(item => { return { source: item.source, target: item.target } })
        };
        this.renderWithBatchDraw(
                document.getElementById("renderer-wrapper"),
                graph
        )
    }
    render() { 
        return (
            <div id="renderer-wrapper">
                <canvas ref={this.canvas} width="1380px" height="1000px" />
            </div>
        );
    }   
}
const mapStateToProps = (state, ownProps) => {
    const { id } = state.alterData;
    const { community } = state.addCommunityDetect;
    const { shortestPath } = state.shortestPath;
    // const {rollback}=state.rollback
    console.log(id);
    return {
       id,community,shortestPath
    }
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        addG:g => {
            dispatch(createAction("addG",g));
        },
        addColorMap: colorMap => {
            dispatch(createAction("addColorMap",colorMap))
        }
    }
} 
const Content=connect(mapStateToProps,mapDispatchToProps)(ForceGraph)
export default Content;
 