import React, { Component } from 'react';
import data from '../data/data';
import createAction from '../actions';
import { connect } from 'react-redux'
class ForceGraph extends Component {
    state = {}
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
        const g = new G({
            container: canvas,
            data: data
        });
         // eslint-disable-next-line
        const force = new d3Force({
            width: canvas.width,
            height: canvas.height
        });
        addG(g.data());   
        force.data(g.data());
        force.start()
        force.onTick(() => {
            g.draw()
        })
        
    }
    render() { 
        return (
            <canvas ref={this.canvas} width="1200" height="700" >
                您的浏览器不支持canvas，请更换浏览器.
            </canvas>
        );
    }
    
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        addG:g => {
            dispatch(createAction("addG",g));
        },
    }
} 
const Content=connect( () => ({}),mapDispatchToProps)(ForceGraph)
export default Content;
 