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
                    ...element
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
                stream3.stream.getAudioTracks()[0].enabled = stream3.muted;
                stream3.muted = !stream3.muted;

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
                // if (stream.videoEnabled){
                //     stream.stream.getVideoTracks()[0].stop();
                // } else {
                //     stream.stream.getVideoTracks()[0].start();
                // }
                stream.stream.getVideoTracks()[0].enabled = !stream.videoEnabled;
                stream.videoEnabled = !stream.videoEnabled;
        
                streams[originalStreamIndex] = stream;
            }

            return {
                ...state,
                streams: streams
            }
        break;
    }
    return state;
}