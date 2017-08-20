const webpack = require('webpack');
const path = require('path');

const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './public');

module.exports = {
  // devtool: 'inline-source-map',
  context: __dirname,
  entry: {
    // main: './src/index.tsx',
    // vendor: [
    //   'preact',
    //   'react-dom',
    //   'react-redux',
    //   'preact-compat',
    //   'redux',
    // ],
    main: './src/hypract/index.ts',
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: 'hypract.js',
    library: 'hypract',
    libraryTarget: 'umd',
    // filename: 'bundle.js',
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
        // loaders: ['awesome-typescript-loader']
        loaders: ['ts-loader']
      },
      // {
      //   test: /\.jsx?$/,
      //   // exclude: /node_modules\/(?![@material|preact-material-components|material-components-web])/,
      //   exclude: /node_modules\/(?!(@material|preact-material-components|material-components-web)\/)/,
      //   // exclude: /node_modules/,
      //   loader: 'babel-loader',
      // },
    ]
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   filename: 'vendor.bundle.js',
    //   minChunks: Infinity
    // }),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};