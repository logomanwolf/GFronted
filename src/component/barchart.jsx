import React, { Component } from 'react';
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
import DataSet from "@antv/data-set";
import Brush from "@antv/g2-brush";
class SliderChart extends React.Component {
    render() {
        const { data } = this.props;
      return (
        <div>
          <Chart
            data={dv}
            scale={scale}
            forceFit
          >
            <Tooltip />
            <Axis />
            <Geom type="interval" position="release*count" color="#e50000" />
          </Chart>
        </div>
      );
    }
  }
  const mapStateToProps = (state, ownProps) => {  

    const { community } = state.addCommunityDetect;
    
    return {
        community
}



