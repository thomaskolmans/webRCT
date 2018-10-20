import Peer from 'peerjs';
import React from 'react';

export default class Video extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			users: [],
			theirs: [],
			mine: null,
			muted: false,
			video: false, 
			error: {
				hasError: false,
				message: ""
			}
		}
	}

	getStream(){
		navigator.getUserMedia({audio: true, video: true}, function(stream){
			this.setState({mine: URL.createObjectURL(stream)});
			window.localStream = stream;
		}, function(){ 
			this.setState({
				error: {
					hasError: true,
					message: "Failed to access the webcam and/or microphone"
				}
			})	  
		});
	}

	componentDidUpdate(){

	}

	componentDidMount(){
		this.getStream();
	}

	render(){
		return (
			<div className="video">
				<div className="streams">
					<video className="me fullscreen" id="mine"></video>
				</div>
				<div className="controls">
					<div className="mute"></div>
					<div className="video"></div>
				</div>
			</div>
 		);
	}
}