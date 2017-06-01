module.exports = {
  devtool: 'inline-source-map',
  entry: ['./todo'],
  output: {
    path: __dirname + '/public',
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
    mdl: 'mdl',
    firebase: 'firebase'
  }
};