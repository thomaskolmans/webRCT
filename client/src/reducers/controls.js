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

    return state;
}