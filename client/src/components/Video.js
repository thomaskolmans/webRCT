import Peer from 'peerjs';
import React from 'react';
import request from 'superagent';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ScaleLoader } from 'react-spinners';
import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';

import { BUSINESS_LOGO } from "babel-dotenv"

export default class Video extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			loading: true,
			peer: new Peer({ host: 'localhost', port: 9000, path: 'peer-server', debug: 3}),
			user_key: '',
			session: null,
			users: [],
			streams: [],
			has_called_users: false,
			muted: false,
			video: true,
			facing_front: true,
			fullscreen: false,
			share_box: false,
			error: {
				hasError: false,
				message: ""
			}
		}
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		this.onUnload = this.onUnload.bind(this);
		var _this = this;

		this.state.peer.on('call', function(call){
			call.answer(window.localStream);
			_this.answerCall(call, call.id);
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
				let previousStreams = _this.state.streams
				previousStreams.push({
					key: _this.state.user_key,
					loading: true,
					stream: stream
				})
				_this.setState({
					streams: previousStreams,
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

	getSessionRequest(id){
		return new Promise((resolve, reject) => {
			request.get('/session/' + id)
			.end(function(error, response){
				if (error || !response.ok) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});
	}

	createSessionRequest(){
		return new Promise((resolve, reject) => {
			request.post('/session/create')
			.send({ key: this.guid() })
			.end(function(error, response){
				if (error || !response.ok) {
					reject(response.error);
				}else{
					resolve(response);
				}
			});
		});
	}

	endSessionRequest(){
		return new Promise((resolve, reject) => {
			request.post('/session/end')
			.send({ key: this.state.session.key })
			.end(function(error, response){
				if (error || !response.ok) {
					reject(response.error);
				}else{
					resolve(response);
				}
			});
		});	
	}

	joinSessionRequest(id){
		return new Promise((resolve, reject) => {
			request.post('/session/join')
			.send({ session_id: id, key: this.state.user_key })
			.end(function(error, response){
				if (error || !response.ok) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});
	}

	leaveSessionRequest(id){
		return new Promise((resolve, reject) => {
			request.post('/session/leave')
			.send({ session_id: id, key: this.state.user_key })
			.end(function(error, response){
				if (error || !response.ok) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});
	}

	activeUsersRequest(key){
		return new Promise((resolve, reject) => {
			request.get('/session/' + key + '/active/users')
			.end(function(error, response){
				if (error || !response.ok) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});	
	}

	usersRequest(key){
		return new Promise((resolve, reject) => {
			request.get('/session/' + key + '/users')
			.end(function(error, response){
				if (error || !response.ok) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});	
	}

	joinSession(key){
		this.getSessionRequest(key).then(response => {
			var session = response.body;
			this.joinSessionRequest(response.body.id).then(response => {
				this.setState({ 
					session: session,
				});
				this.getMyStream();
				window.history.pushState( {} , session.key, '/' + session.key );
				this.activeUsersRequest(session.key).then(response => {
					this.setState({
						users: response.body.filter(el => { return el.key != this.state.user_key })
					});
					if(!this.state.loading){
						this.callUsers(response.body.filter(el => { return el.key != this.state.user_key }));
					}
				});
			});
		}).catch(error => {
			this.createSession();
		});	
	}

	createSession(){
		this.createSessionRequest().then(response => {
			this.joinSession(response.body.key);
		}).catch(error => {
			toast.error("Can't create a session", {
				position: toast.POSITION.TOP_LEFT
			});		
		});
	}

	callUsers(){
		this.state.users.map( user => {
			this.call(user.key);
		})
	}

	call(id){
		var peer = this.state.peer;
		var call = peer.call(id, window.localStream)
		this.answerCall(call, id);
	}

	answerCall(call, id){
		call.on('stream', stream => {
			let previousStreams = this.state.streams
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
				})
			}
			this.setState({
				streams: previousStreams,
				loading: false
			});
		});
		call.on('close', _ => {
			let previousStreams = this.state.streams
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
			})
		})
	}

	findStream(key){
		return this.state.streams.findIndex(el => {el.key === key});
	}

	toggleMute(){
		let me = this.state.streams[0]
		me.stream.getAudioTracks()[0].enabled = this.state.muted
		this.setState({
			muted: !this.state.muted
		});
	}

	toggleVideo(){
		//TODO: Don't send video
		let me = this.state.streams[0]
		me.stream.getVideoTracks()[0].enabled = !this.state.video
		this.setState({
			video: !this.state.video
		});
	}

	toggleFullscreen(){
		this.setState({
			fullscreen: !this.state.fullscreen
		})
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

	componentDidUpdate(prevProps, prevState){
		if(this.state.streams.filter( el => !el.loading).length > 0 && !this.state.has_called_users){
			this.callUsers();
			this.setState({
				has_called_users: true
			});
		}

		ReactTooltip.rebuild();
		if(this.state.user_key != '' && this.state.session == null){
			if(this.props.match.params.key == undefined){
				this.createSession();
			} else {
				this.joinSession(this.props.match.params.key);
			}
		}

		if(prevState.streams == this.state.streams){
			this.state.streams.forEach(stream => {
				let previousStreams = this.state.streams
				let video = document.getElementById(stream.key)
				let _this = this;
				try {
					video.srcObject = stream.stream;
				} catch (error) {
					video.src = URL.createObjectURL(stream.stream);
				}
				video.load();
				video.addEventListener('loadeddata', function(){
					video.play();
					let previousStreamState = null
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
						}
						_this.setState({
							streams: previousStreams
						})
					}
				 }, false);
				window.localStream = stream.stream;
			});
		}
	}

	componentDidMount(){
		window.addEventListener("beforeunload", this.onUnload)
        this.state.peer.on('open', () => {
            this.setState({user_key: this.state.peer.id});
        });
	}

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload)
	}
	
	onUnload(e) { 
		this.leaveSessionRequest(this.state.session.id);
		this.usersRequest(this.state.session.key).then(response => {
			if(this.state.users.length < 1 && response.body.length > 1){
				this.endSessionRequest();
			}
		})
	}
	
	render(){
		return (
			<div>
				<div className="video">
					<div className="streams">
						{this.state.streams.map(stream => {
							return (
								<div className="video-content" key={stream.key}>
									<div className="poster"><img src="/images/placeholder.png" /></div>
									<video muted={(stream.key == this.state.user_key)} className={ (stream.key == this.state.user_key) ? 'me' : ''} key={stream.key} id={stream.key} ></video>
								</div>
							);
						})}
					</div>
					<div className="controls">
						<div className={"share-box " + (this.state.share_box ? 'active' : 'hidden')}>
							<h2>Share this link</h2>
							<input type="text" value={window.location} readOnly></input>
							<CopyToClipboard text={window.location} >
								<button>Copy</button>
							</CopyToClipboard>
						</div>
						<div className={"button mute " + (this.state.muted ? 'active' : '')} data-tip={(this.state.muted ? 'Unmute' : 'Mute')} onClick={(e) => this.toggleMute(e)}></div>
						<div className={"button video " + (this.state.video ? '' : 'active')} data-tip={(this.state.video ? 'Hide video' : 'Show video')} onClick={(e) => this.toggleVideo(e)}></div>
						<div className={"button share " + (this.state.share_box ? 'active' : '')} data-tip="Share" onClick={(e) => this.toggleShare(e)}></div>
						<div className={"button full " + (this.state.fullscreen ? 'active' : '')} data-tip={(this.state.fullscreen ? 'Exit full screen' : 'Full screen')}onClick={(e) => this.toggleFullscreen(e)}></div>
						<ReactTooltip place="top" type="dark" effect="solid"  html={true}  multiline={false} />
					</div>
					<div className="logo"><img src={BUSINESS_LOGO} /></div>
				</div>
				<div className={"loading " + (this.state.loading ? 'active' : '')}>
					<ScaleLoader className="loader" sizeUnit={"px"} size={150} color={'white'}l oading={true} />
					<div className="logo"><img src={BUSINESS_LOGO} /></div>
				</div> 
				<ToastContainer />
			</div>
 		);
	}
}