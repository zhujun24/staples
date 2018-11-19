var path = require('path')
var baseConfig = require('./base')

module.exports = Object.assign({
  mode: 'development',
  entry: {
    index: ['./public/index.js', 'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true'],
    admin: ['./public/admin.js', 'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/assets/',
    filename: '[name].js'
  }
}, baseConfig.development)
