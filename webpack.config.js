const path = require('path');

module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts'],
		preferRelative: true,
		roots: ['src'],
	},
	output: {
		filename: 'barcode-reader.js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		minimize: true,
	},
	mode: 'production',
};