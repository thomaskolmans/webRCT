require('dotenv').config();

import Peer from 'peerjs';
import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ScaleLoader } from 'react-spinners';
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hark from 'hark';
import update, { extend } from 'immutability-helper';
import * as sessionApi from '../api/sessionApi.js';

import ControlsContainer from '../containers/ControlsContainer';
import Loader from './Loader';

import { BUSINESS_LOGO, BUSINESS_LOGO_PLACE, USER_LIST_STYLE } from "babel-dotenv";

export default class Video extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			hasInitiated: false,
			has_called_users: false
		};

		let getUserMedia = navigator.getUserMedia || navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if (getUserMedia) {
			getUserMedia = getUserMedia.bind(navigator);
		} else {
			this.error("User media not supported. Please use Chrome, Firefox or Safari.");
		}

		this.props.peer.on('open', () => {
			this.props.setUserKey(this.props.peer.id);
		});

		this.props.peer.on('call', call => {
			call.answer(window.localStream);

			this.answerCall(call, call.peer);
			this.props.activeUsers(this.props.session.key);
		});

		this.props.peer.on('connection', con => {
			con.on('data', data => {
				let json = JSON.parse(data);
				if (
					json.type == "STREAM_UPDATE" 
					&& this.props.streams.filter ((stream) => stream.key == json.key).length > 0
				){
					this.props.updateStreamElement(json.key, json.value);
				}
			});
		});

		this.props.peer.on('error', error => {
			this.error(error.message);
		});
	}

	guid() {
		var S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

	success(message){
		toast.success(message, {
			position: toast.POSITION.TOP_LEFT
		});
	}

	error(error) {
		toast.error(error, {
			position: toast.POSITION.TOP_LEFT
		});	  
	}

	openStream(){
		navigator.getUserMedia({
			audio: true,  
			video: {
				facingMode: (this.props.frontFacing? "user" : "environment")
			}
		}, stream => {
			window.localStream = stream;
			window.cameraStream = stream;
			this.props.addStream({
				key: this.props.peer.id,
				loading: true,
				muted: this.props.muted,
				videoEnabled: this.props.video,
				stream: stream
			});
		}, () => { 
			this.error("Failed to access the webcam and/or microphone")
		});
	}

	joinSession(key, message = false){
		this.props.getSession(key).then(response => {
			var session = response;
			this.props.joinSession(response.id, this.props.streamKey).then(response => {

				window.history.pushState( {} , session.key, '/' + session.key );
				if(message){
					this.success("You've successfully joined a session!");
				}

				this.openStream();

				this.props.activeUsers(session.key);
			});
		}).catch(error => {
			this.createSession();
		});
	}

	createSession(){
		if (!this.props.session) {
			this.props.createSession(this.guid()).then(response => {
				this.joinSession(response.key);
				this.success("You've created and joined a new session!");
			}).catch(error => {
				this.error("Can't create a session");
			});
		}
	}

	callUsers(users){
		users.forEach( user => {
			this.call(user.key);
		});
	}

	call(id){
		var connectionRequest = this.props.peer.call(id, window.localStream)
		this.answerCall(connectionRequest, id);
	}

	answerCall(connection, id){
		let socketConnection = this.props.peer.connect(id);
		window.sockets.push({ key: id, socket: socketConnection });
		window.calls.push({key: id, connection: connection });

		connection.on('stream', stream => {
			let streamObject = {
				key: id,
				loading: true,
				muted: false,
				videoEnabled: true,
				speaking: false,
				stream: stream
			};
			
			// Who is speaking
			// if (stream.getAudioTracks().length > 0){
			// 	var speechEvents = hark(stream, {})
			// 	speechEvents.on('speaking', () => {
			// 		this.props.updateStreamElement(id, { speaking: true });
			// 	});
			// 	speechEvents.on('stopped_speaking', () => {
			// 		this.props.updateStreamElement(id, { speaking: false });
			// 	});
			// }

			if (this.props.streams.filter (s => s.key == id).length > 0){
				this.props.updateStream(streamObject);
			} else {
				this.props.addStream(streamObject);
			}
		});
		connection.on('close', () => {
			window.sockets = window.sockets.filter ((s) => s.key != id)
			window.calls = window.calls.filter ((c) => c.key != id)
			this.props.removeStream(id);
			this.props.activeUsers(this.props.session.key);
		});
	}

	findStream(key){
		return this.props.streams.findIndex(el => el.key === key );
	}

	componentDidUpdate(prevProps, prevState){
		if(this.props.streams.length > 0 && !this.state.has_called_users){
			this.callUsers(this.props.users);
			this.setState({ has_called_users: true });
		}

		if(this.props.streamKey != null && !this.props.session && !this.props.isLoadingSession){
			if(this.props.match.params.key == undefined){
				this.createSession();
			} else {
				this.joinSession(this.props.match.params.key, true);
			}
		}

		//Load not rendered streams
		this.props.streams.forEach(stream => {
			if (stream.loading){
				let video = document.getElementById(stream.key);
				if (video){
					video.srcObject = stream.stream;
					video.load();
					video.play();
					video.addEventListener('loadeddata', () => {
						let newStream = {...stream};
						newStream.loading = false;
						video.play();
						this.props.updateStream(newStream);
					}, false);
				}
			}
		});
	}

	componentDidMount(){
		var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
		var eventName = iOS ? 'pagehide' : 'beforeunload';
		window.addEventListener(eventName, (e) => {
			e.preventDefault();
			sessionApi.leaveSession(this.props.session.id, this.props.streamKey);

			if(this.props.users.length < 1){
				sessionApi.endSession(this.props.session.key);
			}
			e.returnValue = '';
		});

	}

	_renderStreams() {
		 if (USER_LIST_STYLE == "WINDOWED") {

		} else if (USER_LIST_STYLE == "USER_LIST_STYLE") {

		} else {
			return (
				<div className="streams">
					{this.props.streams.map(stream => {
						return (
							<div 
								className={(this.props.streams.length > 1 && stream.key == this.props.streamKey) ? "video-content corner-small" : "video-content"} 
								key={stream.key}
							>
								<div className={"poster " + (stream.videoEnabled ? 'hidden' : 'active')}>
									<img src="/images/placeholder.png" />
								</div>
								<div className="muted"></div>
								<Loader loading={stream.loading} />
								<video 
									muted={(stream.key == this.props.streamKey || stream.muted)}
									key={stream.key} 
									id={stream.key} 
									/>
							</div>
						);
					})}
				</div>
			);
		}
	}
	
	render(){
		return (
			<div>
				<div className="video">
					{this._renderStreams()}
					<ControlsContainer />
					<img className={"logo " + BUSINESS_LOGO_PLACE} src={BUSINESS_LOGO} />
				</div>
				<Loader loading={this.props.streams.length < 1} />
				<ToastContainer autoClose={3000} />
			</div>
 		);
	}
}