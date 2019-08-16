import React, { Component } from 'react';
import { connect } from 'react-redux';
import createAction from '../actions';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

class SliderChart extends Component {
    group(data) {
        const result = {};
        const array = Object.values(data);
        const biggest = Math.max.apply(Object.values(data))
        array.forEach(i => {
            if (result[i] === undefined)
                result[i] = 1;
            else
                result[i] += 1;
        })
        const result2 = Object.values(result).map((item,i) => {
            return { x: i, y: item };
        })
        return result2;
    }
    render() {
        const { community } = this.props;
        if (community === undefined || community === {})
            return null;
        else
            return (
                
                <Chart
                    theme= "dark"
                        height={350}
                    data={this.group(community)}
                    forceFit
                    style={{ paddingLeft: "0px" }}
                    padding={["5%", "5%", "10%" ,"13%"]}
                >
                    <Tooltip />
                    <Axis />
                    <Geom type="interval" position="x*y" color="#1d8eff" />
                </Chart>
                
            );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { community } = state.addCommunityDetect;
    return {
        community
    }
}
const mapDispatchToProps = () => {} 
const Content=connect(mapStateToProps)(SliderChart)
export default Content;