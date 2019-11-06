import * as types from "../constants/actionTypes.js";

const initialState = {
    muted: false,
    video: true,
    facing_front: true,
    fullscreen: false,
    share_box: false,
    controls: true
};

export default function controls(state = initialState, action) {
    switch(action.type){
        // case types.TOGGLE_MUTE:
        //     return {
        //         ...state,
        //         muted: !state.muted
        //     };
        // break;
        // case types.TOGGLE_VIDEO:
        //     return {
        //         ...state,
        //         video: !state.video
        //     };
        // break;
    }
    return state;
}