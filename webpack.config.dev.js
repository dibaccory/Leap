import path from 'path';
import webpack from 'webpack';
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
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
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      },
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js?$/,
      use: 'babel-loader',
      include: [path.resolve(__dirname, 'src')]
    },
    {
      test: /\.css$/,
      use: ['style-loader','css-loader']
    }]
  },
  mode: 'development'
};
