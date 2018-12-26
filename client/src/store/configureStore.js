import * as prodSettings from './configureStore.prod';
import * as devSettings from './configureStore.dev';

if (process.env.NODE_ENV === 'production') {
  module.exports = prodSettings;
} else {
  module.exports = devSettings;
}