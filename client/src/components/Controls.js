import Peer from 'peerjs';
import React from 'react';

export default class Controls extends React.Component{

	constructor(props){
		super(props);

	}
	componentDidUpdate(){

	}
	componentDidMount(){
		
	}

	render(){
		return (

				<div className="controls">
					<div className="mute"></div>
					<div className="video"></div>
				</div>
 		);
	}
}