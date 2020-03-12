var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
//var CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/client/index.js',
  ],
  output: {
    path: path.resolve(__dirname, './static/dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      },
    }),
    //new MiniCssExtractPlugin({ filename: 'bundle.css'}),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
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
