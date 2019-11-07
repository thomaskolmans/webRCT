import React, { Component } from 'react';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import * as controlActions from '../actions/controlActions';

class ControlsContainer extends Component {

  render() {
    const {
      toggleMute,
      toggleVideo,
      ...props
    } = this.props;
  
    return (
        <Controls
          {...props}
          toggleMute={toggleMute}
          toggleVideo={toggleVideo}
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
    toggleMute: () => dispatch(controlActions.toggleMute()),
    toggleVideo: () => dispatch(controlActions.toggleVideo())
  };
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(ControlsContainer);