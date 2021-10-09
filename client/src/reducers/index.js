import { combineReducers } from 'redux';

import controls from './controls.js';
import video from './video.js';

export default combineReducers({
  video,
  controls
});
