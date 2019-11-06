import Peer from 'peerjs';
import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ScaleLoader } from 'react-spinners';
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hark from 'hark';
import update, { extend } from 'immutability-helper';

import ControlsContainer from '../containers/ControlsContainer';
import Loader from './Loader';

import { BUSINESS_LOGO, BUSINESS_LOGO_PLACE, USER_LIST_STYLE } from "babel-dotenv";

export default class Video extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			loading: true,
			peer: new Peer({host: location.hostname, port: location.port, path: '/peerjs', proxied: true, debug: 3}),
			user_key: '',
			session: null,
			users: [],
			streams: [],
			activeStream: null,
			has_called_users: false,
		};

		let getUserMedia = navigator.getUserMedia || navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if (getUserMedia) {
			getUserMedia = getUserMedia.bind(navigator);
		} else {
			toast.error("User media not supported. Please use Chrome, Firefox or Safari.", {
				position: toast.POSITION.TOP_LEFT
			});	  
		}

		// Events
		this.onUnload = this.onUnload.bind(this);
		var _this = this;

		this.state.peer.on('call', function(call){
			call.answer(window.localStream);
			_this.answerCall(call, call.id);
			this.props.activeUsers(this.state.session.key).then(response => {
				this.setState({
					users: response.body.filter(el => { return el.key != this.props.key })
				});
			});
		});

		this.state.peer.on('error', function(err){
			toast.error(err.message, {
				position: toast.POSITION.TOP_LEFT
			});	  
		});
	}

	guid() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

	getMyStream(){
		var _this = this;
		navigator.getUserMedia({
				audio: true,  
				video: {
					facingMode: (this.state.facing_front? "user" : "environment"),
					width: {ideal: 1280, max: 1920 },
					height: {ideal: 720, max: 1080 }
			  	}
			}, function(stream){
				_this.setState({
					streams: [..._this.state.streams, {
						key: _this.props.key,
						loading: true,
						stream: stream
					}],
					loading: false
				});
			}, function(){ 
				_this.setState({
					loading: false,
					video: false
				});
				toast.error("Failed to access the webcam and/or microphone", {
					position: toast.POSITION.TOP_LEFT
				});	  
		});
	}

	joinSession(key, message = false){
		this.props.getSession(key).then(response => {
			var session = response.body;
			this.props.joinSession(response.body.id, this.props.key).then(response => {
				this.setState({ 
					session: session,
				});
				this.getMyStream();
				window.history.pushState( {} , session.key, '/' + session.key );
				if(message){
					toast.success("You've successfully joined a session!", {
						position: toast.POSITION.TOP_LEFT
					});
				}
				this.props.activeUsers(session.key).then(response => {
					this.setState({
						users: response.body.filter(el => { return el.key != this.props.key })
					});
					if(!this.state.loading){
						this.callUsers(response.body.filter(el => { return el.key != this.props.key }));
					}
				});
			});
		}).catch(error => {
			this.createSession();
		});	
	}

	createSession(){
		this.props.createSession(this.guid()).then(response => {
			this.joinSession(response.body.key);
			toast.success("You've created and joined a new session!", {
				position: toast.POSITION.TOP_LEFT
			});
		}).catch(error => {
			toast.error("Can't create a session", {
				position: toast.POSITION.TOP_LEFT
			});		
		});
	}

	callUsers(){
		this.state.users.map( user => {
			this.call(user.key);
		});
	}

	call(id){
		var connectionRequest = this.state.peer.call(id, window.localStream)
		this.answerCall(connectionRequest, id);
	}

	answerCall(call, id){
		this.state.
		call.on('data', data => {
			// data getting from connection
		});
		call.on('stream', stream => {
			let previousStreams = [...this.state.streams];
			let index = -1;
			var counter = 0;
			previousStreams.forEach(el => {
				if(el.key == id){
					index = counter;
				}
				counter ++;
			});
			if(index > -1){
				previousStreams[index] = {
					key: id,
					loading: true,
					stream: stream
				}
			} else {
				previousStreams.push({
					key: id,
					loading: true,
					stream: stream
				});
			}
			
			var speechEvents = hark(stream, {})
			speechEvents.on('speaking', function() {
				console.log(id + ' is speaking');
			});
			speechEvents.on('stopped_speaking', function() {
				console.log(id + ' stopped speaking');
			});

			this.setState({
				streams: previousStreams,
				loading: false
			});
		});
		call.on('close', _ => {
			let previousStreams = [...this.state.streams];
			let index = -1;
			var counter = 0;
			previousStreams.forEach(el => {
				if(el.key == id){
					index = counter;
				}
				counter ++;
			});

			previousStreams.splice(index, 1)
			this.setState({
				streams: previousStreams
			});

			this.props.activeUsers(this.state.session.key).then(response => {
				this.setState({
					users: response.body.filter(el => { return el.key != this.props.key })
				});
			});
		});
	}

	findStream(key){
		return this.state.streams.findIndex(el => {el.key === key});
	}

	componentDidUpdate(prevProps, prevState){
		if(this.state.streams.filter( el => !el.loading).length > 0 && !this.state.has_called_users){
			this.callUsers();
			this.setState({
				has_called_users: true
			});
		}

		ReactTooltip.rebuild();

		if(this.props.key != '' && this.state.session == null){
			if(this.props.match.params.key == undefined){
				this.createSession();
			} else {
				this.joinSession(this.props.match.params.key, true);
			}
		}

		if(prevState.streams == this.state.streams){
			this.state.streams.forEach(stream => {
				let previousStreams = this.state.streams;
				let video = document.getElementById(stream.key);
				let _this = this;
				try {
					video.srcObject = stream.stream;
				} catch (error) {
					video.src = URL.createObjectURL(stream.stream);
				}
				video.load();
				video.play();
				video.addEventListener('loadeddata', function(){
					video.play();
					let previousStreamState = null;
					let index = 0;
					var counter = 0;
					previousStreams.forEach( el => {
						if(el.key === stream.key){
							previousStreamState = el;
							index = counter;
						}
						counter += 1;
					})
					if(previousStreamState.loading){
						previousStreams[index] = {
							key: previousStreamState.key,
							loading: false,
							stream: previousStreamState.stream
						};
						_this.setState({
							streams: previousStreams
						});
					}
				}, false);
				window.localStream = stream.stream;
			});
		}
	}

	componentDidMount(){
		var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
		var eventName = iOS ? 'pagehide' : 'beforeunload';
		window.addEventListener(eventName, this.onUnload);

		this.state.peer.on('open', () => {
			this.props.setUserKey(this.state.peer.id);
		});
	}

	componentDidUnmount() {
		var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
		var eventName = iOS ? 'pagehide' : 'beforeunload';
		window.removeEventListener(eventName);
	}

	onUnload(e) { 
		this.props.leaveSession(this.state.session.id);

		this.props.users(this.state.session.key).then(response => {
			if(this.state.users.length < 1 && response.body.length > 1){
				this.endSessionRequest();
			}
		});
	}

	renderStreams() {
		 if (USER_LIST_STYLE == "WINDOWED") {

		} else if (USER_LIST_STYLE == "USER_LIST_STYLE") {

		} else {
			return (
				<div className="streams">
					{this.state.streams.map(stream => {
						return (
							<div className="video-content" key={stream.key}>
								<div className={"poster " + (stream.stream.getVideoTracks()[0].enabled ? 'hidden' : 'active')}>
									<img src="/images/placeholder.png" />
								</div>
								<div className="muted"></div>
								<Loader loading={stream.loading} />
								<video 
									muted={(stream.key == this.props.key)} c
									lassName={ (stream.key == this.props.key) ? 'me' : ''} 
									key={stream.key} 
									id={stream.key} />
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
					{this.renderStreams()}
					<ControlsContainer />
					<img className={"logo " + BUSINESS_LOGO_PLACE} src={BUSINESS_LOGO} />
				</div>
				<Loader loading={this.state.loading} />
				<ToastContainer autoClose={3000} />
			</div>
 		);
	}
}