const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: isProduction ? 'production' : 'development',
	context: __dirname,
	optimization: {
		splitChunks: false,
	},
	entry: {
		'barcode-reader': './src/index.ts',
	},
	output: {
		filename: '[name].js',
		library: 'BarcodeReader',
	},
	resolve: {
		plugins: [
			/**
			 * Use this to load modules whose location is specified in the paths section
			 * of tsconfig.json when using webpack. This package provides the functionality
			 * of the tsconfig-paths package but as a webpack plug-in.
			 *
			 * Using this plugin means that you should no longer need to add alias entries
			 * in your webpack.config.js which correspond to the paths entries in your tsconfig.json.
			 * This plugin creates those alias entries for you, so you don't have to!
			 */
			new TsconfigPathsPlugin(),
		],
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				exclude: [/node_modules/],
			},
			{
				test: /\.(node|txt)$/i,
				loader: 'file-loader',
				options: {
					emitFile: false,
				},
			},
		],
	},
};
