import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ControlPanel from './controlPanel'
import AutoComplete from "./autoComplete";
class Content extends Component {
  state = {}
  render() {
    return (
      <div>
        <Row>
          <Col span={6} >
            <Row className="left-side-row"><ControlPanel /></Row>        
            <Row className="left-side-row"><AutoComplete/></Row>
            <Row className="left-side-row"></Row>
          </Col>
          <Col span={18}>
            
          </Col>
        </Row>
      </div>


    );
  }
}
 
export default Content;