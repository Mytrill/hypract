const webpack = require('webpack');
const path = require('path');

const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');


module.exports = {
  entry: {
    'hypract': './src/index.ts',
    'hypract.min': './src/index.ts'
  },
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/,
    })
  ],
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/,
      query: {
        declaration: false,
      }
    }]
  }
}


const ignored = {
  context: __dirname,
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: isProduction ? 'hypract.min.js' : 'hypract.js',
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