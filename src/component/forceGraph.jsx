import React, { Component } from 'react';
// import {G,d3Force} from '../utils/GReact';
import data from '../data/data';
// import {G,d3Force} from '../g/index.ts'
// import {G,d3Force} from '../utils/GReact'
// import {} from 'd3';
class ForceGraph extends Component {
    state = {}
    // G=require('../utils/G.js')
    constructor(){
        super();
        this.canvas = React.createRef();
    }
    componentDidMount() {
        // const {d3Force,G}=require('../utils/G')
        const canvas = this.canvas.current;
        var gl = canvas.getContext('webgl2');
         // eslint-disable-next-line
        const g = new G({
            container: canvas,
            data: data
        });
         // eslint-disable-next-line
        const force = new d3Force({
            width: canvas.width,
            height: canvas.height
        });
        console.log(g.data());
        force.data(g.data());
        force.start()
        force.onTick(() => {
            g.draw()
        })
    }
    render() { 
        return (
            <canvas ref={this.canvas} width="780" height="1800">
                您的浏览器不支持canvas，请更换浏览器.
            </canvas>
        );
    }
}
 
export default ForceGraph;
 