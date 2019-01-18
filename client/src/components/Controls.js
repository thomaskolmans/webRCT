import Peer from 'peerjs';
import React from 'react';
import request from 'superagent';


export default class Controls extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			controls: true
		};

		this.activity = this.activity.bind(this);
		this.screenResize = this.screenResize.bind(this);

		this.idleTime = 0;
		setInterval(() => {
			this.idleTime = this.idleTime + 1
			if(this.idleTime > 1) {
				let controlsClassList = document.getElementById('controls').classList;
				if(!controlsClassList.contains('hidden')){
					controlsClassList.add('hidden');
					document.body.style.cursor = "none";
				}
			}
		}, 2000);

	}
	toggleMute(){
		let me = this.state.streams[0];
		if (!this.state.muted){
			me.stream.getAudioTracks()[0].stop();
		} else {
			me.stream.getAudioTracks()[0].start();
		}
		me.stream.getAudioTracks()[0].enabled = this.state.muted;
		this.setState({
			muted: !this.state.muted
		});
	}

	toggleVideo(){
		let me = this.state.streams[0];
		if (this.state.video){
			me.stream.getVideoTracks()[0].stop();
		} else {
			me.stream.getVideoTracks()[0].start();
		}
		me.stream.getVideoTracks()[0].enabled = !this.state.video;
		this.setState({
			video: !this.state.video
		});
	}

	toggleFullscreen(){
		if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
		(!document.mozFullScreen && !document.webkitIsFullScreen)) {
		 if (document.documentElement.requestFullScreen) {  
		   document.documentElement.requestFullScreen();  
		 } else if (document.documentElement.mozRequestFullScreen) {  
		   document.documentElement.mozRequestFullScreen();  
		 } else if (document.documentElement.webkitRequestFullScreen) {  
		   document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
		 }  
	   } else {  
		 if (document.cancelFullScreen) {  
		   document.cancelFullScreen();  
		 } else if (document.mozCancelFullScreen) {  
		   document.mozCancelFullScreen();  
		 } else if (document.webkitCancelFullScreen) {  
		   document.webkitCancelFullScreen();  
		 }  
	   }
	}

	toggleShare(){
		this.setState({
			share_box: !this.state.share_box
		});
    }
    
    activity(e){
		this.idleTime = 0;
		let controlsClassList = document.getElementById('controls').classList;
		if(controlsClassList.contains('hidden')){
			controlsClassList.remove('hidden');
			document.body.style.cursor = "default";
		}
		if(e.type === "keypress"){
			switch(e.code){
				case "KeyM":
					this.toggleMute();
				break;
				case "KeyV":
					this.toggleVideo();
				break;
				case "KeyF":
					this.toggleFullscreen();
				break;
				case "KeyS":
					this.toggleShare();
				break;
			}
		}
    }
    
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