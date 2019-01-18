import request from 'superagent';
import Promise from 'promise';

export function getSession(id){
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

export function createSession(){
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

export function endSession(){
    return new Promise((resolve, reject) => {
        request.post('/session/end')
        .send({ key: this.state.session.key })
        .end(function(error, response){
            if (error || !response.ok) {
                reject(response.error);
            } else {
                resolve(response);
            }
        });
    });	
}

export function joinSession(id) {
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

export function leaveSession(id){
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

export function activeUsers(key){
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

export function users(key){
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