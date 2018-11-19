var path = require('path')
var baseConfig = require('./base')

module.exports = Object.assign({
  mode: 'production',
  entry: {
    index: './public/index.js',
    admin: './public/admin.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].[contenthash:8].js'
  }
}, baseConfig.production)
