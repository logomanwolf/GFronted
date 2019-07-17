import React, { Component } from "react"
import { connect } from "react-redux"
import BatchDrawer from "./BatchDraw"
import SvgLayer from "./SvgLayer/SvgLayer"
import * as d3 from "d3"
import sigma from "sigma"
import "./Renderer.css"
import { SIGMA_JS, BATCH_DRAW } from "./config"
import deepCompare from "../lib/DeepCompare"
import drawRect from "./drawRect"

class Renderer extends Component {
    constructor(props) {
        super(props)
        this.canvas = undefined
        this.scriptStartTime = undefined
        this.scriptEndTime = undefined
        this.graph = {}
        this.renderer = BATCH_DRAW
        this.state = {}
        this.dots = []
        this.transform = {k:1,x:0,y:0}
    }

    renderWithSigma = (container, graph) => {
        this.scriptStartTime = new Date()
        var { nodes, edges } = graph
        container.innerHTML = ""
        // var canvas = this.canvas;
        let w = container.clientWidth
        let h = container.clientHeight
        // Let's first initialize sigma:
        var s = new sigma({
            renderers: [
                {
                    container: container,
                    type: "webgl"
                }
            ]
        })

        var positions = []
        var min_x = Infinity,
            min_y = Infinity,
            max_x = -Infinity,
            max_y = -Infinity

        for (var i = 0; i < nodes.length; ++i) {
            min_x = Math.min(nodes[i][1], min_x)
            max_x = Math.max(nodes[i][1], max_x)
            min_y = Math.min(nodes[i][2], min_y)
            max_y = Math.max(nodes[i][2], max_y)
        }
        var dots = []
        var diameter = Math.min(w, h) - 10
        for (var i = 0; i < nodes.length; ++i) {
            positions[2 * i] =
                (nodes[i][1] - min_x) / (max_x - min_x) * diameter +
                w / 2 -
                diameter / 2
            positions[2 * i + 1] =
                (nodes[i][2] - min_y) / (max_y - min_y) * diameter +
                h / 2 -
                diameter / 2
            dots[i] = {
                id: i,
                x: positions[2 * i],
                y: positions[2 * i + 1],
                size: 1,
                color: "#00007711"
            }
            s.graph.addNode(dots[i])
        }
        for (var i = 0; i < edges.length; ++i) {
            s.graph.addEdge({
                id: i,
                source: edges[i][0],
                target: edges[i][1]
            })
        }
        this.scriptEndTime = new Date()
        this.props.setTimer("script", this.scriptEndTime - this.scriptStartTime)

        var renderStartTime = new Date()

        s.refresh()

        this.props.setTimer("render", new Date() - renderStartTime)
    }

    renderWithBatchDraw = (container, graph) => {
        // container.innerHTML = ""
        var canvas = document.createElement("canvas")
        container.appendChild(canvas)
        let w = container.clientWidth
        let h = container.clientHeight
        canvas.width = w
        canvas.height = h
        console.log(graph)
        // console.log('#nodes: ', graph !== undefined ? graph.nodes.length : nodes.length, ', #edges: ', graph !== undefined ? graph.links.length : edges.length);
        this.scriptStartTime = new Date()
        var { nodes, links } = graph
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

            this.timeBatchDraw(canvas, lines, dots)
        }
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

        this.props.setTimer("script", this.scriptEndTime - this.scriptStartTime)

        var renderStartTime = new Date()
        render()

        this.props.setTimer("render", new Date() - renderStartTime)
    }
    
    shouldComponentUpdate(nextProps) {
        if (
            nextProps.graph != undefined &&
            nextProps.graph.stamp != undefined &&
            (this.graph.stamp != nextProps.graph.stamp ||
                nextProps.renderer != this.renderer) &&
            nextProps.graph.layouted
        ) {
            this.graph = nextProps.graph
            this.renderer = nextProps.renderer
            console.log("renderer should update", nextProps, this)
            return true
        } else {
            console.log("renderer shouldn't update", nextProps, this)
            return false
        }
    }

    componentDidUpdate() {
        // debugger;
        console.log("", this.renderer, SIGMA_JS, BATCH_DRAW)
        if (this.renderer == SIGMA_JS) {
            this.renderWithSigma(
                document.getElementById("renderer-wrapper"),
                this.graph
            )
        } else if (this.renderer == BATCH_DRAW) {
            this.renderWithBatchDraw(
                document.getElementById("renderer-wrapper"),
                this.graph
            )
        }
    }

    render() {
        console.log("Renderer render")
        return (
            <div className="renderer-wrapper" id="renderer-wrapper">
                <SvgLayer getDots={()=>(this.dots)} getTransform={()=>(this.transform)} />
                {/* <canvas id="main-canvas" ref={(canvas) => this.canvas = canvas}></canvas> */}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    renderer: state.rendererReducer.renderer,
    graph: state.graphReducer.graph
})

export default connect(mapStateToProps)(Renderer)
