const webpack = require('webpack');
const path = require('path');

const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

module.exports = {
  context: __dirname,
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: 'hypract.js',
    library: 'hypract',
    libraryTarget: 'umd',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts-loader']
      }
    ]
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};