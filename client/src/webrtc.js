import Peer from 'peerjs';
import React from 'react';
import ReactDOM from 'react-dom';
import MetaTags from 'react-meta-tags';
import {BrowserRouter, BrowserHistory, matchPath, Switch, Route, Link} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

import Video from './components/Video';

export default class WebRTC extends React.Component{

	constructor(props){
		super(props);
		
        this.state = {
            peer: new Peer({ host: 'localhost', port: 9000, path: 'peer-server', debug: 3}),
            user_key: ''
        } 
        
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	}
	componentDidUpdate(){
        console.log(this.state);
	}
	componentDidMount(){
        var self = this;
        var me = this.state.peer;
        me.on('open', function() {
            self.setState({user_key: me.id});
        });
	}

	render(){
		return (
			<BrowserRouter history={BrowserHistory}>
                <Route render={({ location }) => (
                    <div className="background">
                        <TransitionGroup>
                            <CSSTransition key={location.key} classNames="pagefade" timeout={300}>
                                <Switch location={location}>
								    <Route exact path="/" component={PageShell(Video)} />
								    <Route exact path="/:key" component={PageShell(Video)} />
                                </Switch>
                            </CSSTransition>
                        </TransitionGroup>
                    </div>
                )}/>
			</BrowserRouter>
 		);
	}
}
const PageShell = Page => { 
    return props =>
      <div className="page">
          <Page {...props} />
      </div>
};
ReactDOM.render(<WebRTC />,document.getElementById("webrtc"));