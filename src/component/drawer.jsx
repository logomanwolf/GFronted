import React, { Component } from 'react';
import { Drawer,Timeline } from 'antd';
import { connect } from 'react-redux'
class NewDrawer extends Component {
    state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
    };
    componentWillReceiveProps(nextProps) {
        const { shortestPath } = nextProps;
        if (shortestPath !== this.props.shortestPath)
            this.showDrawer();
    }
    shouldComponentUpdate(nextProps,nextState) {
        const { shortestPath } = nextProps;
        if (shortestPath !== this.props.shortestPath)
            return true;
        return false;
    }
    render() {
        const { shortestPath } = this.props;
    return (
      <div>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
            >
                {shortestPath === undefined ? null : shortestPath.map(item => <Timeline>
                </Timeline>)}
          
        </Drawer>
      </div>
    );
  }
}
 
const mapStateToProps = (state, ownProps) => {  
    const { shortestPath } = state.updateShortestPath;
    // const {rollback}=state.rollback
    return {
        shortestPath
    }
}
const mapDispatchToProps = () => {} 
const Content=connect(mapStateToProps,mapDispatchToProps)(NewDrawer)
export default Content;