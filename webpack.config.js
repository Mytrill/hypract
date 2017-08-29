'use strict';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const path = require('path');

const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

module.exports = env => {
  
  const entry = env === 'profile' ? { 'hypract.min': './src/index.ts' } : { 'hypract': './src/index.ts' , 'hypract.min': './src/index.ts' }
  const plugins = [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/,
    })
  ]
  if(env === 'profile') {
    plugins.push(new BundleAnalyzerPlugin())
  }

  return {
    entry,
    output: {
      path: path.resolve(__dirname, outPath),
      filename: '[name].js',
      libraryTarget: 'umd',
      library: 'hypract',
      umdNamedDefine: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
      }
    },
    devtool: 'source-map',
    plugins,
    module: {
      loaders: [{
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        query: {
          declaration: false,
        }
      }]
    }
  };
}
