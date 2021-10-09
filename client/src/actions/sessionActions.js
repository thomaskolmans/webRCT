import * as types from '../constants/actionTypes.js';
import * as sessionApi from '../api/sessionApi.js';

export const getSessionStart = () => ({
    type: types.GET_SESSION_START
});

export const getSessionSuccess = (result) => ({
    type: types.GET_SESSION_SUCCESS,
    session: result
});

export const getSessionFailure = (error) => ({
    type: types.GET_SESSION_FAILURE,
    ...error
});

export const getSession = (id) => {
    return (dispatch) => {
        dispatch(getSessionStart());

        const promise = sessionApi.getSession(id);

        promise.then(result => {
            dispatch(getSessionSuccess(result))
        }).catch(error => {
            dispatch(getSessionFailure(error))
        })

        return promise
    }
} 

export const createSessionStart = () => ({
    type: types.CREATE_SESSION_START
});

export const createSessionSuccess = (result) => ({
    type: types.CREATE_SESSION_SUCCESS,
    session: result
});

export const createSessionFailure = (error) => ({
    type: types.CREATE_SESSION_FAILURE,
    ...error
});

export const createSession = (id) => {
    return (dispatch) => {
        dispatch(createSessionStart());

        const promise = sessionApi.createSession(id);

        promise.then(result => {
            dispatch(createSessionSuccess(result))
        }).catch(error => {
            dispatch(createSessionFailure(error))
        })

        return promise
    }
}

export const endSessionStart = () => ({
    type: types.END_SESSION_START
});

export const endSessionSuccess = (result) => ({
    type: types.END_SESSION_SUCCESS,
    ...result
});

export const endSessionFailure = (error) => ({
    type: types.END_SESSION_FAILURE,
    ...error
});
export const endSession = (id) => {
    return (dispatch) => {
        dispatch(endSessionStart());

        const promise = sessionApi.endSession(id);

        promise.then(result => {
            dispatch(endSessionSuccess(result))
        }).catch(error => {
            dispatch(endSessionFailure(error))
        })

        return promise
    }
}

export const joinSessionStart = () => ({
    type: types.JOIN_SESSION_START
});

export const joinSessionSuccess = (result) => ({
    type: types.JOIN_SESSION_SUCCESS,
    session: result
});

export const joinSessionFailure = (error) => ({
    type: types.JOIN_SESSION_FAILURE,
    ...error
});
export const joinSession = (id, key) => {
    return (dispatch) => {
        dispatch(joinSessionStart());

        const promise = sessionApi.joinSession(id, key);

        promise.then(result => {
            dispatch(joinSessionSuccess(result))
        }).catch(error => {
            dispatch(joinSessionFailure(error))
        })

        return promise
    }
}

export const leaveSessionStart = () => ({
    type: types.LEAVE_SESSION_START
});

export const leaveSessionSuccess = (result) => ({
    type: types.LEAVE_SESSION_SUCCESS,
    ...result
});

export const leaveSessionFailure = (error) => ({
    type: types.LEAVE_SESSION_FAILURE,
    ...error
});

export const leaveSession = (id, key) => {
    return (dispatch) => {
        dispatch(leaveSessionStart());

        const promise = sessionApi.leaveSession(id, key);

        promise.then(result => {
            dispatch(leaveSessionSuccess(result))
        }).catch(error => {
            dispatch(leaveSessionFailure(error))
        });

        return promise
    }
};

export const getActiveUsersStart = () => ({
    type: types.GET_ACTIVE_USERS_START
});

export const getActiveUsersSuccess = (result) => ({
    type: types.GET_ACTIVE_USERS_SUCCESS,
    users: result
});

export const getActiveUsersFailure = (error) => ({
    type: types.GET_ACTIVE_USERS_FAILURE,
    ...error
});
export const activeUsers = (id) => {
    return (dispatch) => {
        dispatch(getActiveUsersStart());

        const promise = sessionApi.activeUsers(id);

        promise.then(result => {
            dispatch(getActiveUsersSuccess(result))
        }).catch(error => {
            dispatch(getActiveUsersFailure(error))
        })

        return promise
    }
}

export const getUsersStart = () => ({
    type: types.GET_USERS_START
});

export const getUsersSuccess = (result) => ({
    type: types.GET_USERS_SUCCESS,
    users: result
});

export const getUsersFailure = (error) => ({
    type: types.GET_USERS_FAILURE,
    ...error
});

export const users = (id) => {
    return (dispatch) => {
        dispatch(getUsersStart());

        const promise = sessionApi.users(id);

        promise.then(result => {
            dispatch(getUsersSuccess(result))
        }).catch(error => {
            dispatch(getUsersFailure(error))
        })
        return promise
    }
};

export const setUserKey = (key) => ({
    type: types.SET_USER_KEY,
    key: key
});

export const addStream = (stream) => ({
    type: types.ADD_STREAM,
    stream: stream
});

export const updateStream = (stream) => ({
    type: types.UPDATE_STREAM,
    stream: stream
});

export const updateStreamElement = (key, element) => ({
    type: types.UPDATE_STREAM_ELEMENT,
    key: key, 
    element: element
});

export const removeStream = (key) => ({
    type: types.REMOVE_STREAM,
    key: key
});

export const sendToAll = (message) => {
    return (dispatch, getState) => {
        window.sockets.forEach((socket) => {
            socket.socket.send(message);
        });
    }
}