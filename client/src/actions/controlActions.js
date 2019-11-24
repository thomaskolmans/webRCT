import * as types from '../constants/actionTypes.js';

export const toggleMute = () => ({
    type: types.TOGGLE_MUTE
});

export const toggleVideo = () => ({
    type: types.TOGGLE_VIDEO
});

export const toggleFacing = () => ({
    type: types.TOGGLE_FACING
})

export const toggleScreenSharing = () => ({
    type: types.TOGGLE_SCREEN_SHARING
});
