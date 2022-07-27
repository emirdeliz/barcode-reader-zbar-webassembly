const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'production',
	optimization: {
		minimize: true,
		splitChunks: false,
	},
	target: 'node',
	entry: './src/index.ts',
	entry: {
		'barcode-reader': './src/index.ts',
		'barcode-reader.min': './src/index.ts',
	},
	output: {
		filename: 'barcode-reader.js',
		path: path.resolve(__dirname, 'dist'),
		pathinfo: true,
		clean: true,
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
			/**
			 * All files inside webpack's output.path directory will be removed once, but the
			 * directory itself will not be. If using webpack 4+'s default configuration,
			 * everything under <PROJECT_DIR>/dist/ will be removed.
			 * Use cleanOnceBeforeBuildPatterns to override this behavior.
			 *
			 * During rebuilds, all webpack assets that are not used anymore
			 * will be removed automatically.
			 *
			 * See `Options and Defaults` for information
			 */
			new CleanWebpackPlugin({
				protectWebpackAssets: false,
				cleanAfterEveryBuildPatterns: [
					path.join(__dirname, 'dist/**/*.LICENSE.txt'),
				],
			}),
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
