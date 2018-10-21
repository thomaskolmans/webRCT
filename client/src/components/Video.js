import Peer from 'peerjs';
import React from 'react';
import request from 'superagent';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ScaleLoader } from 'react-spinners';

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
			muted: false,
			video: true,
			facing_front: true,
			error: {
				hasError: false,
				message: ""
			}
		}
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		this.onUnload = this.onUnload.bind(this);
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
					loading: false
				});
				var me = document.getElementById("me");
				me.srcObject = stream;
				me.play();
				window.localStream = stream;
			}, function(){ 
				_this.setState({
					error: {
						hasError: true,
						message: "Failed to access the webcam and/or microphone"
					}
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
			//display error
		});
	}

	toggleMute(){
		//TODO: Don't send audio 
		this.setState({
			muted: !this.state.muted
		});
	}

	toggleVideo(){
		//TODO: Don't send video
		var me = document.getElementById("me");
		if(this.state.video){
			me.srcObject = null;
			me.currentTime = 0;
			me.play();
		} else {
			this.getMyStream();
		}
		this.setState({
			video: !this.state.video
		});
	}

	componentDidUpdate(){
		if(this.state.user_key != '' && this.state.session == null){
			if(this.props.match.params.key == undefined){
				this.createSession();
			} else {
				this.joinSession(this.props.match.params.key);
			}
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
		if(this.state.loading){
			return (
				<div className='sweet-loading'>
				<ScaleLoader
					className="loader"
					sizeUnit={"px"}
					size={150}
					color={'white'}
					loading={true}
				/>
				</div> 
			)
		}
		return (
			<div className="video">
				<div className="streams">
					<div className="video-content">
						<video className="me fullscreen" id="me" muted="muted" poster="/images/placeholder.png"></video>
					</div>
					{this.state.users.map(user => {
						return (
							<div className="video-content">
								<video className="them" key={user.key} id={user.key} poster="/images/placeholder.png"></video>
							</div>
						);
					})}
				</div>
				<div className="controls">
					<div className={"button mute " + (this.state.muted ? 'active' : '')} onClick={(e) => this.toggleMute(e)}></div>
					<div className={"button video " + (this.state.video ? '' : 'active')} onClick={(e) => this.toggleVideo(e)}></div>
				</div>
				<div className="logo"><img src={BUSINESS_LOGO} /></div>
			</div>
 		);
	}
}