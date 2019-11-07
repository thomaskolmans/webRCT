import React, { Component } from 'react';
import { connect } from 'react-redux';
import Video from '../components/Video';
import * as sessionActions from '../actions/sessionActions';

class VideoContainer extends Component {

  constructor(props){
    super(props);

  }

  render() {
    const {
      getSession,
      createSession,
      endSession,
      joinSession,
      leaveSession,
      activeUsers,
      getUsers,
      setUserKey,
      addStream,
      updateStream,
      updateStreamElement,
      removeStream,
      ...props
    } = this.props;
  
    
    return (
        <Video
          {...props}
          getSession={(id) => getSession(id)}
          createSession={(id) => createSession(id)}
          endSession={(id) => endSession(id)}
          joinSession={(id, key) => joinSession(id, key)}
          leaveSession={(id, key) => leaveSession(id, key)}
          activeUsers={(id) => activeUsers(id)}
          getUsers={(id) => getUsers(id)}
          setUserKey={(key) => setUserKey(key)}
          addStream={(stream) => addStream(stream)}
          updateStream={(stream) => updateStream(stream)}
          updateStreamElement={(key, element) => updateStreamElement(key, element)}
          removeStream={(stream) => removeStream(stream)}
        />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    video: state.controls.video,
    muted: state.controls.muted,
    streamKey: state.video.key,
    isLoadingSession: state.video.isLoadingSession,
    session: state.video.session,
    users: state.video.users,
    streams: state.video.streams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSession: (id) => dispatch(sessionActions.getSession(id)),
    createSession: (id) => dispatch(sessionActions.createSession(id)),
    endSession: (id) => dispatch(sessionActions.endSession(id)),
    joinSession: (id, key) => dispatch(sessionActions.joinSession(id, key)),
    leaveSession: (id, key) => dispatch(sessionActions.leaveSession(id, key)),
    activeUsers: (id) => dispatch(sessionActions.activeUsers(id)),
    getUsers: (id) => dispatch(sessionActions.users(id)),
    setUserKey: (key) => dispatch(sessionActions.setUserKey(key)),
    addStream: (stream) => dispatch(sessionActions.addStream(stream)),
    updateStream: (stream) => dispatch(sessionActions.updateStream(stream)),
    updateStreamElement: (key, element) => dispatch(sessionActions.updateStreamElement(key, element)),
    removeStream: (stream) => dispatch(sessionActions.removeStream(stream))

  };
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(VideoContainer);