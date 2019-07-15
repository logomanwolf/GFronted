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
        this.force.onEnd(() => {
            console.log("draw finish");
            this.g.initSearchIndice();
            this.g.initInteraction();
            this.g.on('mouseOver', el => {
                const oldStyle = el.style();
                // const oldR=oldStyle.r
                const newStyle={...oldStyle,r:12,fill:"red"}
                el.style(newStyle);
                this.g.draw()
            })
            // var content = JSON.stringify(this.g.nodes().toArray());
            // var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            // eslint-disable-next-line
            // saveAs(blob, "save.json");
        });
        
    }
    componentWillReceiveProps(newProps) {
        const { id, community,addColorMap } = newProps;
        this.g.nodes().toArray().forEach(
            (item) => {
                this.g.getNodeById(item.id).style({fill: '#000000' });
                }
        )
        if (id !== undefined && id !== null) {
            console.log(id)
            if(this.lastId!==undefined)
            this.g.getNodeById(this.lastId).style({fill: '#000000' });
            this.g.getNodeById(id).style({ fill: '#FFC125' });
            this.lastId = id;
            // this.force.data(this.g.data());
        }
        if (community !== undefined) {
            let color = {};
                for (var key in community) {
                    this.g.getNodeById(key).attrs["group"] = community[key];
                    this.g.getNodeById(key).style({ fill: colorMap[community[key]] });
                    color[community[key]] = colorMap[community[key]];
            }
            addColorMap(color)
        }
        this.g.refresh();
        
    }
    render() { 
        return (
            <canvas ref={this.canvas} width="1380px" height="1000px"  />
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const { id } = state.alterData
    const { community } = state.addCommunityDetect
    // const {rollback}=state.rollback
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
        addColorMap: colorMap => {
            dispatch(createAction("addColorMap",colorMap))
        }
    }
} 
const Content=connect(mapStateToProps,mapDispatchToProps)(ForceGraph)
export default Content;
 