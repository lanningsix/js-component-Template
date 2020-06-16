const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
	entry: './src/index.ts',
	context: __dirname,
	output: {
		filename: 'index.js',
		path: __dirname + '/dist/',
	},
	devServer: {
		port: 8100,
		host: '0.0.0.0'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'awesome-typescript-loader',
			},
			{
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	]
};
