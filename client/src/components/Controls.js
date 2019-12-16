import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import { isMobile } from "react-device-detect";

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

	toggleFrontFacing() {
		this.props.toggleFacing();
		navigator.getUserMedia({
			audio: !this.props.muted,
			video: {
				facingMode: (this.props.frontFacing ? "user" : "environment")
			}
		}, stream => {
			let newStream = stream;
			window.localStream = newStream;

			window.calls.forEach((call) => {
				call.connection.peerConnection.getSenders().forEach((sender) => {
					sender.replaceTrack(newStream.getVideoTracks()[0]);
				})
			});

			this.props.updateStreamElement(
				this.props.streamKey, 
				{ stream: newStream, loading: true, videoEnabled: this.props.video }
			);
		}, (e) => {
			toast.error('Failed to access the webcam and/or microphone', {
				position: toast.POSITION.TOP_LEFT
			});
		});
	}

	toggleMute(){
		this.props.toggleMute()
		this.props.sendMessage(JSON.stringify({
			type: "STREAM_UPDATE",
			key: this.props.streamKey,
			value: { muted: !this.props.muted }
		}))
	}

	toggleVideo(){
		if (!this.props.video) {
			navigator.getUserMedia({
				audio: !this.props.muted,
				video: {
					facingMode: (this.props.frontFacing ? "user" : "environment")
				}
			}, mediaStream => {
				window.localStream.getVideoTracks()[0].stop();
				window.localStream = mediaStream;

				window.calls.forEach((call) => {
					call.connection.peerConnection.getSenders().forEach((sender) => {
						sender.replaceTrack(mediaStream.getVideoTracks()[0]);
					})
				});

				this.props.toggleVideo(mediaStream, this.props.muted, this.props.frontFacing);
				this.props.sendMessage(JSON.stringify({
					type: "STREAM_UPDATE",
					key: this.props.streamKey,
					value: { videoEnabled: true }
				}));
			}, e => {
				toast.error('Failed to access the webcam and/or microphone', {
					position: toast.POSITION.TOP_LEFT
				});
			});
		} else {
			this.props.toggleVideo(window.localStream, this.props.muted, this.props.frontFacing);
			this.props.sendMessage(JSON.stringify({
				type: "STREAM_UPDATE",
				key: this.props.streamKey,
				value: { videoEnabled: false }
			}));
		}

	}

	toggleScreenShare() {
		if (!this.props.screenSharing) {
			let mediaStream = navigator.mediaDevices.getDisplayMedia({
				video: true
			}).then((stream) => {
				this.props.toggleScreenSharing();

				let newStream = stream;
				if (window.localStream){
					window.localStream.getAudioTracks().forEach((track) => {
						newStream.addTrack(track);
					});
				}

				window.calls.forEach((call) => {
					call.connection.peerConnection.getSenders().forEach((sender) => {
						sender.replaceTrack(stream.getVideoTracks()[0]);
					})
				})

				newStream.getVideoTracks().forEach((track) => {
					track.onended = () => {
						if (this.props.video) {
							navigator.getUserMedia({
								audio: !this.props.muted,
								video: {
									facingMode: (this.props.frontFacing ? "user" : "environment")
								}
							}, mediaStream => {
								window.localStream.getVideoTracks()[0].stop();
								window.localStream = mediaStream; 
	
								window.calls.forEach((call) => {
									call.connection.peerConnection.getSenders().forEach((sender) => {
										sender.replaceTrack(mediaStream.getVideoTracks()[0]);
									})
								});
								this.props.toggleScreenSharing();
								this.props.updateStreamElement(
									this.props.streamKey, 
									{ stream: mediaStream, loading: true, videoEnabled: this.props.video }
								);	
							}, e => {
								toast.error('Failed to access the webcam and/or microphone', {
									position: toast.POSITION.TOP_LEFT
								});
							});
						} else {
							this.props.toggleScreenSharing();
							this.props.updateStreamElement(
								this.props.streamKey, 
								{ stream: null, loading: false, videoEnabled: this.props.video }
							);	
						}
					};
				});

				this.props.updateStreamElement(
					this.props.streamKey, 
					{ stream: newStream, loading: true, videoEnabled: true }
				);
			}).catch((e) => {
				toast.error('Unable to acquire screen capture', {
					position: toast.POSITION.TOP_LEFT
				});
			});
		} else {
			let previousStreams = [...this.props.streams
				.filter((stream) => stream.key == this.props.streamKey)]
			
			if (this.props.video) {

				navigator.getUserMedia({
					audio: !this.props.muted,
					video: {
						facingMode: (this.props.frontFacing ? "user" : "environment")
					}
				}, stream => {
					window.localStream.getVideoTracks()[0].stop();
					window.localStream = stream;

					window.calls.forEach((call) => {
						call.connection.peerConnection.getSenders().forEach((sender) => {
							if (stream){
								sender.replaceTrack(stream.getVideoTracks()[0]);
							}
						})
					});
		
					this.props.toggleScreenSharing();
					this.props.updateStreamElement(
						this.props.streamKey, 
						{ stream: stream, loading: true, videoEnabled: this.props.video }
					);
		
					previousStreams.forEach((stream) => {
						stream.stream.getVideoTracks().forEach((track) => track.stop());
					});
				}, e => {
					toast.error('Failed to access the webcam and/or microphone', {
						position: toast.POSITION.TOP_LEFT
					});
				});
			} else {
				this.props.toggleScreenSharing();
				this.props.updateStreamElement(
					this.props.streamKey, 
					{ stream: null, loading: false, videoEnabled: this.props.video }
				);	
			}
		}
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
				{ isMobile && <div className={"button facing " + (this.props.frontFacing ? 'active' : '')} data-tip={(this.props.frontFacing ? 'Front camera' : 'Selfie camera')} onClick={(e) => this.toggleFrontFacing(e)}></div> }
				<div className={"button mute " + (this.props.muted ? '' : 'active')} data-tip={(this.props.muted ? 'Unmute' : 'Mute')} onClick={(e) => this.toggleMute(e)}></div>
				<div className={"button video " + (this.props.video ? 'active' : '')} data-tip={(this.props.video ? 'Hide video' : 'Show video')} onClick={(e) => this.toggleVideo(e)}></div>
				<div className={"button screenSharing " + (this.props.screenSharing ? 'active' : '')} data-tip={(this.props.screenSharing ? 'Stop sharing screen' : 'Share screen')} onClick={(e) => this.toggleScreenShare(e)}></div>
				<div className={"button share " + (this.state.share_box ? 'active' : '')} data-tip="Share" onClick={(e) => this.toggleShare(e)}></div>
				<div className={"button full " + (this.state.fullscreen ? 'active' : '')} data-tip={(this.state.fullscreen ? 'Exit full screen' : 'Full screen')}onClick={(e) => this.toggleFullscreen(e)}></div>
				<ReactTooltip place="top" type="dark" effect="solid"  html={true}  multiline={false} />
			</div>
		);
	}
}