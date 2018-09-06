var path = require('path')
var baseConfig = require('./base')

module.exports = Object.assign({
  mode: 'production',
  entry: {
    index: './views/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  }
}, baseConfig.production)
