const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
	entry: './src/index.ts',
	context: __dirname,
	output: {
		filename: 'index.js',
		path: __dirname + '/dist/',
	},
	devServer: {
		port: 8101,
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
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							limit: 8192
						}
					}
				]
			}
		],

	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	]
};
