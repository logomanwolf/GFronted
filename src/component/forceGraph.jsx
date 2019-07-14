import React, { Component } from 'react';
import data from '../data/data';
import createAction from '../actions';
import { connect } from 'react-redux'
import colorMap from '../settings/colorMap';
class ForceGraph extends Component {
    state = {}
    g = {}
    force = {}
    lastId=undefined
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
        const { id, community } = newProps;
        if (id !== undefined && id !== null) {
            console.log(id)
            if(this.lastId!==undefined)
            this.g.getNodeById(this.lastId).style({fill: '#000000' });
            this.g.getNodeById(id).style({ fill: '#FFC125' });
            this.lastId = id;
            this.force.data(this.g.data());
            this.g.draw();
        }
        if (community !== undefined) {
            for(var key in community){
                this.g.getNodeById(key).attrs["group"]=community[key]   ;
                this.g.getNodeById(key).style({ fill: colorMap[community[key]] });
            }
            this.g.draw();
        }
    }
    render() { 
        return (
            <canvas ref={this.canvas} width="1380px" height="1000px"  />
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const { id } = state.alterData
    const {community}=state.addCommunityDetect
    console.log(id);
    return {
       id,community
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
 