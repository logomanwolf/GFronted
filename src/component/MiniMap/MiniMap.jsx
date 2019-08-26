import React, { Component } from 'react';
import * as d3 from 'd3';
import * as contour from 'd3-contour';
import { connect } from "react-redux";
import "./MiniMap.css";

class MiniMap extends Component{
	constructor(props){
		super(props);
		this.graph = {};
		// this.stamp = new Date();
		this.nodes = [];
		this.svgWidth = 0;
		this.svgHeight = 0;
		this.canvasWidth = 1380;
		this.canvasHeight = 1000;
		this.state = {
			svgStyle: { width: '100%', height: '100%' },
			timeStamp: new Date()
		}
	}

	zoomed = () => {
		// contourG.select('rect').attr('transform', d3.event.transform);
		let svgStyle = { ...this.state.svgStyle };
		this.setState({ svgStyle, timeStamp: new Date() });
		// contourG.selectAll('path.contour')
	}
    drawContour() {
		console.log("drawContour")
		let contourFunc = contour.contourDensity()
			.x(function (d) {
				return d.x
			})
			.y(function (d) {
				return d.y
			})
			.size([this.svgWidth,this.svgHeight])

		let contourMapData = contourFunc(this.nodes)
		
		// console.log(contourMapData)

		function ticks(start, end, count) {
			let result = [],
				increment = (end - start) / count;
			for (let i = 0; i <= count; i++) {
				result.push(start + i * increment);
			}
			return result;
		}
		const x = d3.scaleLinear().domain([0, d3.max(this.nodes, (d) => d.x)]).range([0,this.canvasWidth ]).nice();
		const y = d3.scaleLinear().domain([0, d3.max(this.nodes, (d) => d.y)]).range([this.canvasHeight, 0]).nice();
		const drawPoint=(scaleX, scaleY, point, k) =>{
			// context.beginPath();
			// context.fillStyle = pointColor;
			// const px = scaleX(point[0]);
			// const py = scaleY(point[1]);
			// context.arc(px, py, 1.2 * k, 0, 2 * Math.PI, true);
			// context.fill();
			
			
		}
		const drawCanvas = (transform) => {
			const scaleX = transform.rescaleX(x);
			const scaleY = transform.rescaleY(y);
			// gxAxis.call(xAxis.scale(scaleX));
    		// gyAxis.call(yAxis.scale(scaleY));
   	 		// context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			// this.nodes().forEach(point => {
			// 	this.graph.getElementById('') = scaleX(point.x);
			// 	point.y = scaleY(point.y);
			// 	return point;
			// });
		}

		let colorBlue = d3.scalePow().domain(ticks(0, d3.max(contourMapData.map(d => d.value)), 4)).range(["#ffffff", "#b3cddd", "#7ab2d2", "#5288ab"])

		var data = contourMapData.map(d => {
			return {
				path: d3.geoPath()(d),
				color: colorBlue(d.value)
			}
		})
		let zoom = d3.zoom().on('zoom', this.zoomed);
		
		// console.log(data)
		let contourG = d3.select("#minimap-wrapper").select("svg")
			.call(zoom)
		
		let contourMap = contourG.selectAll("path.contour")
			.data(data, (d, i) => i);
		contourG.on('drag', (d) => {
			d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
			console.log(d3.event.x);
		});

		// let zoom = d3.zoom().scaleExtent([0.5, 10]).on('zoom', this.zoomed);
		contourMap.enter()
		.append("path")
		.classed('contour', true)
		

		contourMap.exit().remove()

		contourG.selectAll("path.contour")
			.attr("d", d => d.path)
			.attr("fill", d => d.color)
			// .on('drag', (d) => {
			// 	d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
			// 	console.log(d3.event.x);
			// });

		console.log(contourMap)
		
		contourG.select("rect").remove()
		
		
		contourG.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', this.svgWidth)
			.attr('height', this.svgHeight)
			.attr('stroke', '#999')
			.attr('stroke-width', 2)
			.attr('fill-opacity', 0)
			
    }
	
	calContour(){
		let xCoor = [], yCoor = [], transform = { k: 1, x: 0, y: 0 };
		for(let i=0;i<this.nodes.length;i++){
			xCoor[i]=this.nodes[i].attrs['x']
			yCoor[i]=this.nodes[i].attrs['y']
		}
		// console.log(xCoor)
		var xMax=Math.max.apply(null,xCoor)
		var yMax=Math.max.apply(null,yCoor)
		console.log(xMax, yMax)
		if (d3.event !== undefined && d3.event!==null)
		{
			transform = d3.event.transform;
			console.log(transform);
		}
		this.graph.transform = transform;
		for(let i=0;i<this.nodes.length;i++){
			this.nodes[i].attrs.x= this.nodes[i].attrs.x * transform.k+ transform.x;
			this.nodes[i].attrs.y  = this.nodes[i].attrs.y * transform.k  + transform.y;
		}
		// for(let i=0;i<this.nodes.length;i++){
		// 	this.nodes[i].x = (this.nodes[i].attrs.x*transform.k * this.svgWidth / xMax ) + transform.x;
		// 	this.nodes[i].y = (this.nodes[i].attrs.y* transform.k * this.svgHeight / yMax)  + transform.y;
		// 	this.nodes[i].id = this.nodes[i].id;
		// }
		
		for(let i=0;i<this.nodes.length;i++){
			this.nodes[i].x = this.nodes[i].attrs.x* this.svgWidth / xMax *0.8
			this.nodes[i].y = this.nodes[i].attrs.y* this.svgHeight / yMax *0.8 
		}
		this.graph.draw();
	}
	updateNodes(g) {
		this.graph = g;
		this.nodes = this.graph.nodes().toArray();
	}
	shouldComponentUpdate(nextProps,nextState ) {
		if ((nextProps.graph !== undefined && this.graph !== nextProps.graph) ) {
			this.updateNodes(nextProps.graph)
			console.log("minimap should update", nextProps, this)
            return true
		}
		else if (nextState.timeStamp !== this.state.timeStamp) {
			return true;
		}
		else {
            console.log("minimap shouldn't update", nextProps, this)
            return false
        }
	}
	
	componentDidUpdate() {
		// debugger;
		console.log("minimap did update")
		// console.log(document.getElementById("svg").width.baseVal.value
		// ,document.getElementById("svg").height.baseVal.value)
		this.svgWidth = document.getElementById("contour-svg").width.baseVal.value
		this.svgHeight = document.getElementById("contour-svg").height.baseVal.value
		// this.svgHeight = 250
		this.calContour()
		this.drawContour()
    }

	render(){
		return(
			<div className="minimap-wrapper" id="minimap-wrapper" style={{height:280}}>
				<svg id="contour-svg"></svg>
			</div>
		)	
	}
}

const mapStateToProps = state => ({
	graph: state.addG.g,
})
const mapDispatchToProps = () => {} 
export default connect(mapStateToProps,mapDispatchToProps)(MiniMap)

