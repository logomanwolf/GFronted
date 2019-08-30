import React, { Component } from 'react';
import { Card, Button,Radio ,Divider,Icon,Row,Col,Typography,Switch,Menu, Dropdown,Select  } from 'antd';
import createAction from '../actions';
import { connect } from 'react-redux'
import { getPageRank, getCommunityDetect, card_background ,important_font,plain_text,inner_card_background,dividar_color} from '../settings/settings.js'
class ControlPanel extends Component {
    state = {
        value: 1,
        filestatus:{}
    };
    render() { 
        const { addPageRank, addCommunityDetect,getFile,updateLayout,chooseCluster,chooseLinks } = this.props;
        const handleAddPagerRank = () => {
            fetch(getPageRank, {
                method: "POST",
                mode: "cors",
                // headers: { 'Accept': 'application/json,text/plain,*/*' }   ,
            }).then(r => {
                return r.json();
            })
            .then(response => {
                console.log("get data finished!");
                // console.log(response);
                addPageRank(response);
                // updateListPanelContent({ 2: 2 });
            });
        }
        
        const handleCommunityDetect = (checked) => {
            if (checked) {
                fetch(getCommunityDetect
                    // ,{
                    // method: "POST",
                    // mode: "cors",
                    // // headers: { 'Accept': 'application/json,text/plain,*/*' }   ,
                    // }
                ).then(r => {
                    return r.json();
                })
                    .then(response => {
                        console.log("get data finished!");
                        addCommunityDetect(response);
                        console.log(response);
                        // addPageRank(response);
                    });
            }
            else {
                addCommunityDetect(undefined);
                
            }
            chooseCluster(undefined);
            chooseLinks(undefined);
        }
        const handleMenuClick=({key})=> {
            getFile(menuContent[parseInt(key)]);
            this.setState({...this.state,filestatus:{filename:menuContent[parseInt(key)],nodesNum:menuContentMap[menuContent[parseInt(key)]].nodesNum,edgesBum:menuContentMap[menuContent[parseInt(key)]].edgesBum}})
        }
        const layoutMap = {
            0: "node_link",
            1: "hierarchy",
            2: 'square',
            3: 'circle'
        }
        const handleLayoutChange = (value) => {
            console.log('radio checked', );
            this.setState({ value: value });
            updateLayout(layoutMap[ value]);
        };
        const selectContent = (
            <Select defaultValue="0" style={{ width: 140,cursor:"pointer" }} onChange={handleLayoutChange} >
                <Select.Option value="0">原始布局</Select.Option>
                <Select.Option value="1">层次布局</Select.Option>
                <Select.Option value="2">方形布局</Select.Option>
                <Select.Option value="3">圆形布局</Select.Option>
            </Select>
        );
        const menuContent = ["nodes_70", "nodes_4000"];
        const menuContentMap={nodes_70:{nodesNum:77,edgesBum:254},nodes_4000:{nodesNum:4720,edgesBum:13722}}
        const filemenu = (
            <Menu onClick={handleMenuClick}>
                {menuContent.map((item,i)=><Menu.Item key={i}>{item}</Menu.Item>)}
            </Menu>
        )

        return ( 
        <div>
            <Card title="" bordered={false}  size={"small"} type="inner" headStyle={{color:important_font,backgroundColor:card_background}} style={{backgroundColor:card_background}} >
                <Row>
                    <Card style={{overflow:"auto",backgroundColor:card_background}} bordered={false} size="small" headStyle={{color:important_font}} 
                >
                        <Row>
                            <Card.Meta title="分析" size="small"  style={{ marginBottom: "10px"}} bordered={"false"}></Card.Meta></Row>
                        <Row>
                            <Row>
                                <Col span={6}><Dropdown.Button placement="bottomLeft" overlay={filemenu} icon={<Icon type="down" />}>打开</Dropdown.Button><br /></Col>
                                <Col span={18}><div style={{ height: "32px", display: "table-cell", verticalAlign: "middle", fontSize: "110%", paddingLeft: "30px",color:plain_text }} > {this.state.filestatus.filename}</div>
                                    <Divider style={{ margin: "0px 0px 0px 10px", width: "90%",minWidth:"50%",backgroundColor:dividar_color }} /></Col>
                            </Row>
                            <Row className="defaultText">
                                    <Col span={9} ><Typography.Text strong >节点数:&nbsp;&nbsp;&nbsp;</Typography.Text><Typography.Text>{this.state.filestatus.nodesNum}</Typography.Text></Col>
                                <Col span={9}><Typography.Text strong >边数:&nbsp;&nbsp;&nbsp;</Typography.Text><Typography.Text>{this.state.filestatus.edgesBum}</Typography.Text></Col>
                            </Row>    
                            <Row className="defaultText">
                                <Col span={18}><Typography.Text  strong >社团检测</Typography.Text></Col>
                                <Col><Switch  onChange={(checked)=>handleCommunityDetect(checked)}  /></Col>
                            </Row>
                            <Row className="defaultText">
                                <Col span={18}><Typography.Text strong >Pagerank</Typography.Text></Col>
                                <Col><Switch  onChange={handleAddPagerRank} /></Col>
                            </Row>
                            {/* <Button onClick={handleCommunityDetect} className="defaultButton">Community Detect</Button>
                            <Button onClick={handleAddPagerRank} className="defaultButton">Page Rank</Button>
                            <Button className="defaultButton"  >Shortest Path</Button> */}
                        </Row>
                        {/* <Row>
                            <Form layout="inline" onSubmit={handleShortestPath} style={{ marginBlockStart: 4 }} >
                                <Form.Item size="small">
                                    <Input placeholder="From" style={{ width: 70 }} />
                                </Form.Item>
                                <Form.Item >
                                    <Input placeholder="To" style={{ width: 70 }} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary">submit</Button>
                                </Form.Item>
                            </Form>
                        </Row> */}
                    </Card>
                </Row>
                <Row>
                    <Card style={{overflow:"auto",backgroundColor:card_background}} bordered={false} size="small" bodyStyle={{color:important_font}} >
                            <Row><Card.Meta title="编码"/></Row>
                        <Row className="defaultText">
                            <Col span={12} ><Typography.Text strong style={{ height: "32px", display: "table-cell", verticalAlign: "middle" }}>颜色</Typography.Text></Col>
                            <Col span={10}>{selectContent}</Col>
                        </Row>
                        <Row className="defaultText">
                            <Col span={12} ><Typography.Text strong style={{ height: "32px", display: "table-cell", verticalAlign: "middle" }}>大小</Typography.Text></Col>
                            <Col span={10}>{selectContent}</Col>
                        </Row>
                        <Row className="defaultText">
                            <Col span={12} ><Typography.Text strong style={{ height: "32px", display: "table-cell", verticalAlign: "middle" }}>布局</Typography.Text></Col>
                            {/* <Col span={19}>
                                <Radio.Group  onChange={e=>{handleLayoutChange(e)}} value={this.state.value} >
                                    <Radio value={1} style={{height:"32px",lineHeight:2}}>原始布局</Radio>
                                    <Radio value={2} style={{ height: "32px", lineHeight: 2 }}>层次布局</Radio>
                                    <Radio value={3} style={{ height: "32px", lineHeight: 2 }}>层次布局</Radio>
                                </Radio.Group>
                            </Col> */}
                            <Col span={10}>{selectContent}</Col>
                            </Row>
                            
                    </Card>
                </Row>
            </Card>
        </div>
         );
    }
}


const mapDispatchToProps = (dispatch,ownProps) => {
    return{
        addPageRank:pageRank => {
            dispatch(createAction("addPageRank",pageRank));
        },
        addCommunityDetect:community=> {
            dispatch(createAction("addCommunityDetect",community));
        },
        getFile: filename => {
            dispatch(createAction("getFile", filename));
        },
        updateLayout:layout=> {
            dispatch(createAction("updateLayout", layout));
        },
        chooseCluster: cluster => {
            dispatch(createAction("chooseCluster", cluster));
        },
        chooseLinks:links=> {
            dispatch(createAction("chooseLinks", links));
        }
        ,
        updateListPanelContent:listPanelContent => {
            dispatch(createAction("updateListPanelContent", listPanelContent));
        },
    }
} 
const Content=connect( () => ({}),mapDispatchToProps)(ControlPanel)
export default Content;