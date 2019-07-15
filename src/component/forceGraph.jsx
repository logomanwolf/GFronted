import React, { Component } from 'react';
import data from '../data/data';
import createAction from '../actions';
import { connect } from 'react-redux'
import colorMap from '../settings/colorMap';
import { getShortestPath } from '../settings/settings'
import URLSearchParams from 'url-search-params';
class ForceGraph extends Component {
    state = {};
    g = {};
    force = {};
    lastId = undefined;
    startId = undefined;
    endId = undefined;
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
                const newStyle={...oldStyle,r:12,fill:"blue"}
                el.style(newStyle);
                this.g.draw()
            })
            // var content = JSON.stringify(this.g.nodes().toArray());
            // var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            // eslint-disable-next-line
            // saveAs(blob, "save.json");
        });
        
    }
    getPaths() {
        
    }
    componentWillReceiveProps(newProps) {
        const { id, community,addColorMap,addG,shortestPath } = newProps;
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
            addG(this.g.data());
        }
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
                        // console.log(response);
                        response.forEach(item => { item.forEach(n => { this.g.getNodeById(n).style({ r: 10, fill: 'red' }); }) });
                        this.g.refresh();
                    });
                }
                else {
                    this.startId = el.id;
                    this.g.getNodeById(this.endId).style({ r: 10, fill: '#000000' });
                    this.endId = undefined;
                }
                this.g.getNodeById(el.id).style({ r: 10, fill: 'red' });
                this.g.refresh();
            });
        }
        else if (shortestPath === false) {
            this.startId = undefined;
            this.endId = undefined;
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
 