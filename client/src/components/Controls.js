import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';

export default class Controls extends Component {

	constructor(props){
		super(props);

		this.state = {
			controls: true,
			fullscreen: false
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
		this.props.toggleMute()
	}

	toggleVideo(){
		this.props.toggleVideo();
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

	screenResize(e){
		if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
		(!document.mozFullScreen && !document.webkitIsFullScreen)) {
			this.setState({
				fullscreen: false
			});
		} else {
			this.setState({
				fullscreen: true
			});
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

	componentDidMount() {
		["mousemove", "touchmove", "keypress"].forEach(
			event => window.addEventListener(event,this.activity) 
		);
		["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach(
			event => document.addEventListener(event, this.screenResize)
		);
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
				<div className={"button mute " + (this.props.muted ? 'active' : '')} data-tip={(this.props.muted ? 'Unmute' : 'Mute')} onClick={(e) => this.toggleMute(e)}></div>
				<div className={"button video " + (this.props.video ? '' : 'active')} data-tip={(this.props.video ? 'Hide video' : 'Show video')} onClick={(e) => this.toggleVideo(e)}></div>
				<div className={"button share " + (this.state.share_box ? 'active' : '')} data-tip="Share" onClick={(e) => this.toggleShare(e)}></div>
				<div className={"button full " + (this.state.fullscreen ? 'active' : '')} data-tip={(this.state.fullscreen ? 'Exit full screen' : 'Full screen')}onClick={(e) => this.toggleFullscreen(e)}></div>
				<ReactTooltip place="top" type="dark" effect="solid"  html={true}  multiline={false} />
			</div>
		);
	}
}