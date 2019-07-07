import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ControlPanel from './controlPanel'
import AutoComplete from "./autoComplete";
import PageRank from './pageRank';
import Canvas from './canvas';
class Content extends Component {
  state = {}
  render() {
    return (
      <div>
        <Row>
          <Col span={4} >
            <Row className="left-side-row"><ControlPanel /></Row>        
            <Row className="left-side-row"><AutoComplete/></Row>
            <Row className="left-side-row"><PageRank/></Row>
          </Col>
          <Col span={18}>
            <Canvas />
          </Col>
        </Row>
      </div>


    );
  }
}
 
export default Content;