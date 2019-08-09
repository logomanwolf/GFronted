import React, { Component } from 'react';
import { connect } from 'react-redux'
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
                        height={350}
                    data={this.group(community)}
                        forceFit
                >
                    <Tooltip />
                    <Axis />
                    <Geom type="interval" position="x*y" color="#e50000" />
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
const mapDispatchToProps = () => { };
const Content=connect(mapStateToProps,mapDispatchToProps)(SliderChart)
export default Content;