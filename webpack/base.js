var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var cssLoaders = [
  { loader: 'style-loader' },
  { loader: 'css-loader' },
  {
    loader: 'postcss-loader',
    options: {
      plugins: function () {
        return [
          require('autoprefixer'),
          require('cssnano')({ zindex: false, reduceIdents: false })
        ]
      }
    }
  },
  { loader: 'less-loader' }
]

var generateConfig = function (dev) {
  let plugins = dev ? [new webpack.HotModuleReplacementPlugin()] : []
  return {
    plugins: plugins.concat([
      new ExtractTextPlugin({
        filename: '[name].[md5:contenthash:hex:8].css',
        allChunks: false,
        disable: false
      })
    ]),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            query: {
              presets: [['env']],
              plugins: ['syntax-dynamic-import', ['import', { libraryName: 'antd', style: true }]]
            }
          }
        },
        {
          test: /\.(less|css)$/,
          loader: dev ? cssLoaders : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoaders.slice(1)
          })
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: {
            loader: 'url-loader?limit=8192'
          }
        }, {
          test: /\.(mp4|ogg|eot|otf|svg|ttf|woff|woff2)$/,
          use: {
            loader: 'file-loader'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules'],
      alias: {
        actions: path.join(__dirname, '../public/actions'),
        components: path.join(__dirname, '../public/components'),
        constants: path.join(__dirname, '../public/constants'),
        containers: path.join(__dirname, '../public/containers'),
        reducers: path.join(__dirname, '../public/reducers'),
        services: path.join(__dirname, '../public/services'),
        utils: path.join(__dirname, '../public/utils')
      }
    },
    externals: {
      'core-js': 'core',
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-router-dom': 'ReactRouterDOM'
    }
  }
}

module.exports = {
  production: generateConfig(),
  development: generateConfig(true)
}
