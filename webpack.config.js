const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
	entry: {
		"bundle": "./client/src/webrtc.js",
		"bundle.min": "./client/src/webrtc.js"
	},
	output: {
	    filename: "client/dist/[name].js"
	},
	node: {
		fs: 'empty'
	},
	module: {
	  rules: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['env','react'],
	          cacheDirectory: true
	        }
	      }
	    }
	  ]
	},
	plugins: [
		new Dotenv(),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
		}),
		new webpack.DefinePlugin({
		    'process.env': {
		      'NODE_ENV': JSON.stringify('development'),
		    },
		})
	]
}