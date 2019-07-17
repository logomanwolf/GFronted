import React, { Component } from 'react';
import lasso from'../../lib/d3-lasso.js';
import * as d3 from 'd3';
import "./SvgLayer.css";
import { setChosenNodes } from "../../action"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

class SvgLayer extends Component{
	constructor(props){
        super(props);
        this.newChosenNodes = [];
    }
    
    shouldComponentUpdate(nextProps){
        if(nextProps.graph != undefined &&
            nextProps.graph.stamp != undefined &&
            this.props.graph.stamp != nextProps.graph.stamp &&
            nextProps.graph.layouted){
                this.quadtree = undefined;//we need to rebuild quadtree when graph changes
                console.log("svglayer should update", nextProps, this)
                return true;
            }
        if(nextProps.canChoose!=this.props.canChoose){
            console.log("svglayer should update", nextProps, this)
            return true;
        }
        else{
            console.log("svglayer shouldn't update", nextProps, this)
            return false;
        }
    }

	componentDidUpdate() {
        console.log("svglayer did update");
        this.newChosenNodes = [];
        this.props.setChosenNodes(this.newChosenNodes);
        if(!this.props.canChoose){//not choosing mode,do nothing
            return;
        }
        //else:choosing mode,do works to support user choosing

        let container = document.getElementById("renderer-wrapper");
        let w = container.clientWidth;
        let h = container.clientHeight;

        let svg = d3.select("#svglayer-svg")
            .attr("width",w)
            .attr("height",h);

        let transform = this.props.getTransform();
        
        let data = this.props.getDots().map((dot,index)=>{
            return [dot.posX*transform.k+transform.x,dot.posY*transform.k+transform.y];
        });

        let circles = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx",d=>d[0])
            .attr("cy",d=>d[1])
            .attr("r",5)
            .classed("unchosen",true)
            .on("chosen",(d,i)=>{
                this.newChosenNodes.push(this.props.graph.nodes[i]);
                // this.props.setChosenNodes(this.newChosenNodes);
            });

        //quadtree
        if(this.quadtree==undefined){//build quadtree
            this.dots = this.props.getDots().map((dot,index)=>{
                return [dot.posX,dot.posY];
            });
            this.quadtree = d3.quadtree()
                .extent([[-1, -1], [w + 1, h + 1]])
                .addAll(this.dots);
        }
        svg.on('click',()=>{
            let transform = this.props.getTransform();
            let xx = (d3.event.clientX-transform.x)/transform.k;
            let yy = (d3.event.clientY-transform.y)/transform.k;
            this.newChosenNodes = [];
            circles.classed("unchosen",true)
                .classed("chosen",false)
                .classed("possible",false);
            this.dots.forEach(element => {
                element.selected = false;
            });
            this.quadtree.visit(function(node, x1, y1, x2, y2) {
                if (!node.length) {
                    do {
                        var d = node.data;
                        if((d[0]-xx)**2+(d[1]-yy)**2<50){
                            d.selected = true;
                            // alert(xx+" "+yy+" "+d[0]+" "+d[1]);
                        }
                    } while (node = node.next);
                }
                return xx<x1 || xx>x2 || yy<y1 || yy>y2;
            });
            
            this.dots.forEach((element,index) => {
                if(element.selected){
                    this.newChosenNodes.push(this.props.graph.nodes[index]);
                    circles.classed("chosen",(d,i)=>{return i==index})
                        .classed("unchosen",(d,i)=>{return i!=index});
                }
            });
            this.props.setChosenNodes(this.newChosenNodes);
        });

        //lasso
        var lasso_start = ()=>{
            ls.items()
                .classed("unchosen",true)
                .classed("chosen",false)
                .classed("possible",false);
            this.newChosenNodes = [];
        };
        var lasso_draw = ()=>{
            ls.possibleItems()
                .classed("unchosen",false)
                .classed("chosen",false)
                .classed("possible",true);
            ls.notPossibleItems()
                .classed("unchosen",true)
                .classed("chosen",false)
                .classed("possible",false);
        };
        var lasso_end = ()=>{
            ls.items()
                .classed("unchosen",true)
                .classed("chosen",false)
                .classed("possible",false);
            ls.selectedItems()
                .classed("unchosen",false)
                .classed("chosen",true)
                .classed("possible",false)
                .dispatch("chosen");
            this.props.setChosenNodes(this.newChosenNodes);
        };
        var ls = lasso()
            .closePathSelect(true)
            .closePathDistance(100)
            .items(circles)
            .targetArea(svg)
            .on("start",lasso_start)
            .on("draw",lasso_draw)
            .on("end",lasso_end);
        ls.closePathDistance(2000);
        svg.call(ls);
    }

	render(){
		return(
			<div className="svglayer-wrapper" id="svglayer-wrapper">
                {this.props.canChoose?(<svg id="svglayer-svg"></svg>):null}
			</div>
		)
	}
}

const mapStateToProps = state => ({
    graph: state.graphReducer.graph,
    canChoose: state.chosenNodesReducer.canChoose,
    chosenNodes: state.chosenNodesReducer.chosenNodes
})

const mapDispatchToProps = dispatch => ({
    setChosenNodes: bindActionCreators(setChosenNodes, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SvgLayer)
