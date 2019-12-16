import * as types from "../constants/actionTypes.js";

const initialState = {
    key: null,
    isLoadingSession: false,
    sessionKey: '',
    session: null,
    users: [],
    streams: [],
    messages: []
};

export default function controls(state = initialState, action) {
    switch(action.type){
        case types.GET_USERS_SUCCESS:
        case types.GET_ACTIVE_USERS_SUCCESS:
            return {
                ...state,
                users: action.users.filter(user => user.key != state.key )
            };
        break;

        case types.GET_SESSION_START:
        case types.CREATE_SESSION_START:
        case types.JOIN_SESSION_START:
            return {
                ...state,
                isLoadingSession: true
            };
        break;

        case types.GET_SESSION_SUCCESS:
        case types.JOIN_SESSION_SUCCESS: 
        case types.CREATE_SESSION_SUCCESS:
            return {
                ...state,
                isLoadingSession: false,
                session: action.session
            }
        break;
        case types.SET_USER_KEY:
            return {
                ...state,
                key: action.key
            }
        break;

        case types.ADD_STREAM: 
            return {
                ...state,
                streams: [...state.streams, action.stream]
            }
        break;
        case types.UPDATE_STREAM:
            let streams2 = [...state.streams];
            let stream2 = action.stream;
            let originalStreamIndex2 = streams2.findIndex(f => f.key == stream2.key);
            if (originalStreamIndex2 >= 0){
                streams2[originalStreamIndex2] = stream2;
            } else {
                streams2 = [...streams2, stream2];
            }

            return {
                ...state,
                streams: streams2
            }
        break;
        case types.UPDATE_STREAM_ELEMENT:
            let streams1 = [...state.streams];
            let originalStreamIndex1 = streams1.findIndex(f => f.key == action.key);
            if (originalStreamIndex1 >= 0){
                let stream1 = {
                    ...streams1[originalStreamIndex1],
                    ...action.element
                };
                streams1[originalStreamIndex1] = stream1;
            }
            return {
                ...state,
                streams: streams1
            }
        break;
        case types.REMOVE_STREAM:
            return {
                ...state,
                streams: [...state.streams].filter (s => s.key != action.key)
            }
        break;
        case types.TOGGLE_MUTE:
            let streams3 = [...state.streams];
            let originalStreamIndex3 = streams3.findIndex(f => f.key == state.key);
            if (originalStreamIndex3 >= 0){
                let stream3 = {...streams3[originalStreamIndex3]}
                if (stream3.stream) {
                    stream3.stream.getAudioTracks()[0].enabled = state.muted;
                }

                stream3.muted = !state.muted;
                streams3[originalStreamIndex3] = stream3;
            }

            return {
                ...state,
                streams: streams3
            }
        break;
        case types.TOGGLE_VIDEO:
            let streams = [...state.streams];
            let originalStreamIndex = streams.findIndex(f => f.key == state.key);
            if (originalStreamIndex >= 0){
                let stream = {...streams[originalStreamIndex]};
                if (stream.stream) {
                    stream.stream.getVideoTracks()[0].enabled = !stream.videoEnabled;
                }
                if (stream.videoEnabled){
                    if (stream.stream) {
                        stream.stream.getVideoTracks()[0].stop();
                    }
                    stream.videoEnabled = false;
                } else {
                    stream.stream = action.stream;
                    stream.loading = true;
                    stream.videoEnabled = true;
                }
                streams[originalStreamIndex] = stream;
            }

            return {
                ...state,
                streams: streams
            }
        break;
        case types.TOGGLE_FACING:
            let streams4 = [...state.streams];
            let originalStreamIndex4 = streams4.findIndex(f => f.key == state.key);
            if (originalStreamIndex4 >= 0){
                let stream4 = {...streams4[originalStreamIndex4]};
                if (stream4.stream) {
                    stream4.stream = action.stream;
                    stream4.loading = true;
                    stream4.videoEnabled = true;
                }
                streams4[originalStreamIndex4] = stream4;
            }

            return {
                ...state,
                streams: streams4
            }
        break;
    }
    return state;
}