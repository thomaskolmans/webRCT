import React, { Component } from 'react';
import { connect } from 'react-redux';
import Video from '../../components//Video';
import * as sessionActions from '../../actions/sessionActions';

class VideoContainer extends Component {

  render() {
    const {

      ...props
    } = this.props;
  
    return (
        <VideoPage
          {...props}
        />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(TeamsContainer);