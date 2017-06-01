module.exports = {
  devtool: 'inline-source-map',
  entry: ['./src/client'],
  output: {
    path: __dirname + '/examples/public',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: ['ts-loader']
      }
    ]
  },
  externals: {
    mdl: 'mdl'
  }
};