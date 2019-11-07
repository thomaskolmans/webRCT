import request from 'superagent';

export function getSession(id){
    return new Promise((resolve, reject) => {
        request.get('/session/' + id)
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error.body);
            } else {
                resolve(response.body);
            }
        });
    });
}

export function createSession(key){
    console.log("CREATE KEY: " + key);

    return new Promise((resolve, reject) => {
        request.post('/session/create')
        .send({ key: key })
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error.body);
            } else {
                resolve(response.body);
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
                reject(error.body);
            } else {
                resolve(response.body);
            }
        });
    });	
}

export function joinSession(id, key) {
    console.log("JOIN ID: " + id + " KEY: " + key);
    return new Promise((resolve, reject) => {
        request.post('/session/join')
        .send({ session_id: id, key: key })
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error.body);
            } else {
                resolve(response.body);
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
                reject(error.body);
            } else {
                resolve(response.body);
            }
        });
    });
}

export function activeUsers(id){
    return new Promise((resolve, reject) => {
        request.get('/session/' + id + '/active/users')
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error.body);
            } else {
                resolve(response.body);
            }
        });
    });	
}

export function users(id){
    return new Promise((resolve, reject) => {
        request.get('/session/' + id + '/users')
        .end(function(error, response){
            if (error || !response.ok) {
                reject(error.body);
            } else {
                resolve(response.body);
            }
        });
    });	
}
