import request from 'superagent';

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

export function createSession(key){
    return new Promise((resolve, reject) => {
        request.post('/session/create')
        .send({ key: key })
        .end(function(error, response){
            if (error || !response.ok) {
                reject(response.error);
            }else{
                resolve(response);
            }
        });
    });
}

export function endSession(id){
    return new Promise((resolve, reject) => {
        request.post('/session/end')
        .send({ key: id })
        .end(function(error, response){
            if (error || !response.ok) {
                reject(response.error);
            } else {
                resolve(response);
            }
        });
    });	
}

export function joinSession(id, key) {
    return new Promise((resolve, reject) => {
        request.post('/session/join')
        .send({ session_id: id, key: key })
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

export function leaveSession(id, key){
    return new Promise((resolve, reject) => {
        request.post('/session/leave')
        .send({ session_id: id, key: key })
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

export function activeUsers(id){
    return new Promise((resolve, reject) => {
        request.get('/session/' + id + '/active/users')
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });	
}

export function users(id){
    return new Promise((resolve, reject) => {
        request.get('/session/' + id + '/users')
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });	
}
