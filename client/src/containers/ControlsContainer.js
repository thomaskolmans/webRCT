import React, { Component } from 'react';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import * as controlActions from '../actions/sessionActions';

class ControlsContainer extends Component {

  render() {
    const {

      ...props
    } = this.props;
  
    return (
        <Controls
          {...props}
        />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    muted: state.controls.muted,
    video: state.controls.video
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(ControlsContainer);