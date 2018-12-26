import Peer from 'peerjs';
import React from 'react';
import request from 'superagent';


export default class Controls extends React.Component {

    render(){
        return (
            <div className={"controls"} id="controls">
                <div className={"share-box " + (this.state.share_box ? 'active' : 'hidden')}>
                    <h2>Share this link</h2>
                    <input type="text" value={window.location} readOnly></input>
                    <CopyToClipboard text={window.location} 
                        onCopy={() => {
                            this.setState({share_box: false});
                            toast.success("Succesfully copied URL!", {
                                position: toast.POSITION.TOP_LEFT
                            });		
                        }} >
                        <button>Copy</button>
                    </CopyToClipboard>
                </div>
                <div className={"button mute " + (this.state.muted ? 'active' : '')} data-tip={(this.state.muted ? 'Unmute' : 'Mute')} onClick={(e) => this.toggleMute(e)}></div>
                <div className={"button video " + (this.state.video ? '' : 'active')} data-tip={(this.state.video ? 'Hide video' : 'Show video')} onClick={(e) => this.toggleVideo(e)}></div>
                <div className={"button share " + (this.state.share_box ? 'active' : '')} data-tip="Share" onClick={(e) => this.toggleShare(e)}></div>
                <div className={"button full " + (this.state.fullscreen ? 'active' : '')} data-tip={(this.state.fullscreen ? 'Exit full screen' : 'Full screen')}onClick={(e) => this.toggleFullscreen(e)}></div>
                <ReactTooltip place="top" type="dark" effect="solid"  html={true}  multiline={false} />
            </div>
        );
    }
}