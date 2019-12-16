import React, { Component } from 'react';
import { connect } from 'react-redux';
import Controls from '../components/Controls';
import * as controlActions from '../actions/controlActions';
import * as sessionActions from '../actions/sessionActions';

class ControlsContainer extends Component {

  render() {
    const {
      toggleFacing,
      toggleMute,
      toggleVideo,
      toggleScreenSharing,
      updateStreamElement,
      ...props
    } = this.props;
  
    return (
        <Controls
          {...props}
          toggleFacing={toggleFacing}
          toggleMute={toggleMute}
          toggleVideo={(stream, muted, frontFacing) => toggleVideo(stream, muted, frontFacing)}
          toggleScreenSharing={toggleScreenSharing}
          updateStreamElement={(key, element) => updateStreamElement(key, element)}
        />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    streamKey: state.video.key,
    muted: state.controls.muted,
    video: state.controls.video,
    frontFacing: state.controls.frontFacing,
    screenSharing: state.controls.screenSharing,
    streams: state.video.streams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFacing: () => dispatch(controlActions.toggleFacing()),
    toggleMute: () => dispatch(controlActions.toggleMute()),
    toggleVideo: (stream, muted, frontFacing) => dispatch(controlActions.toggleVideo(stream, muted, frontFacing)),
    toggleScreenSharing: () => dispatch(controlActions.toggleScreenSharing()),
    sendMessage: (message) => dispatch(sessionActions.sendToAll(message)),
    updateStreamElement: (key, element) => dispatch(sessionActions.updateStreamElement(key, element)),
  };
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(ControlsContainer);