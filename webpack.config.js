const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const mode = 'production';

module.exports = {
	mode: mode,
	entry: {
		"bundle": "./client/src/webrtc.js",
		"bundle.min": "./client/src/webrtc.js"
	},
	output: {
		path: path.resolve(__dirname, 'client/dist'),
	    filename: "[name].js"
	},
	node: {
		fs: 'empty'
	},
	devServer: {
		contentBase: "./client",
	    historyApiFallback: {
	      index: 'index.html'
		},
		port: 8085,
		hot: true,
	    proxy: {
			'/session': {
				target: 'http://localhost:8080',
				secure: false
			}
	    }
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
			}, 
			{
				test: /\.css$/,
				loader:[ 'style-loader', 'css-loader' ]
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
		      'NODE_ENV': JSON.stringify(mode),
		    },
		})
	]
}