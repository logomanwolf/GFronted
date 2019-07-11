import React, { Component } from 'react';
import data from '../data/data';
import createAction from '../actions';
import { connect } from 'react-redux'
class ForceGraph extends Component {
    state = {}
    g = {}
    force={}
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
        console.log(this.g)
         // eslint-disable-next-line
        this.force = new d3Force({
            width: canvas.width,
            height: canvas.height
        });
        addG(this.g.data());   
        this.force.data(this.g.data());
        this.force.start()
        this.force.onTick(() => {
            this.g.draw()
        });
        
    }
    componentWillReceiveProps(newProps) {
        const { id } = newProps;
        if (id !== undefined && id !== null) {
            console.log(id)
            this.g.getNodeById(id).style({ fill: '#FFC125' });
            this.force.data(this.g.data());
            this.g.draw();
            // this.force.start()
            // this.force.onTick(() => {
            //     this.g.draw()
            // });
        }
  }
    render() { 
        return (
            <canvas ref={this.canvas} width="1400px" height="920px"  />
                
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const {id} =state.alterData
    console.log(id);
    return {
       id
    }
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        addG:g => {
            dispatch(createAction("addG",g));
        },
    }
} 
const Content=connect(mapStateToProps,mapDispatchToProps)(ForceGraph)
export default Content;
 