import React, { Component } from 'react';
import { connect } from 'react-redux';
import Video from '../components/Video';
import * as sessionActions from '../actions/sessionActions';

class VideoContainer extends Component {

  render() {
    const {
      getSession,
      createSession,
      endSession,
      joinSession,
      leaveSession,
      activeUsers,
      users,
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
          users={(id) => users(id)}
          setUserKey={(key) => setUserKey(key)}
        />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    key: state.video.key
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
    users: (id) => dispatch(sessionActions.users(id)),
    setUserKey: (key) => dispatch(sessionActions.setUserKey(key))
  };
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(VideoContainer);