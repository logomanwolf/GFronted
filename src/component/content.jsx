import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ControlPanel from './controlPanel'
import AutoComplete from "./autoComplete";
import PageRank from './pageRank';
import Canvas from './canvas';
import {card_background,canvas_background} from '../settings/settings'
class Content extends Component {
  state = {}
  render() {
    return (
      <Col span={24} >
        <Row style={{borderWidth:1,borderStyle:"solid",width:"1920px",height:"1080px",backgroundColor:canvas_background}}>
          <Col span={6} style={{backgroundColor:canvas_background}}>
            <Row className="left-side-row" align="middle"  ><ControlPanel /></Row>        
            <Row className="left-side-row"align="middle" ><AutoComplete/></Row>
            <Row className="left-side-row" align="middle" ><PageRank/></Row>
          </Col>
          <Col span={18}>
            <Canvas />
          </Col>
        </Row>
      </Col>


    );
  }
}
 
export default Content;