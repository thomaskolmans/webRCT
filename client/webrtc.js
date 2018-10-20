import Peer from 'peerjs';
import React from 'react'
import ReactDOM from 'react-dom'

var peer = new Peer({ host: 'localhost', port: 9000, debug: 3});
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
