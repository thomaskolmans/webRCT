import * as types from '../constants/actionTypes.js';

export const toggleMute = () => ({
    type: types.TOGGLE_MUTE
});

export const toggleVideo = (stream, muted = false, frontFacing = false) => ({
    type: types.TOGGLE_VIDEO,
    stream,
    muted,
    frontFacing
});

export const toggleFacing = (stream, muted = false) => ({
    type: types.TOGGLE_FACING,
    stream,
    muted
});

export const toggleScreenSharing = () => ({
    type: types.TOGGLE_SCREEN_SHARING
});