var path = require('path');
var webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/client/index.js',
  ],
  output: {
    path: path.resolve(__dirname, './static/dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      },
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader',
      include: [path.resolve(__dirname, 'src')]
    },
    {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader'
      }]
    }]
  },
  mode: 'production'
};
/* {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env']
},*/
