import process from 'process'

const PRODUCTION = 'prod'
const ENV = process.env.NODE_ENV === PRODUCTION ? 'PROD' : 'DEV'

const HOST = 'www.domain.com'
const PORT = 3000
const PASSWORD = '123456'
const DATABASE = 'blog'
const ADMIN_PATH = 'admin'

const PUBLIC_CDN = {
  DEV: {
    css: [],
    js: [
      '//cdn.bootcss.com/core-js/2.5.7/core.js',
      // '//cdn.bootcss.com/babel-polyfill/6.26.0/polyfill.js',
      '//cdn.bootcss.com/react/16.4.0/umd/react.development.js',
      '//cdn.bootcss.com/react-dom/16.4.0/umd/react-dom.development.js',
      // '//cdn.bootcss.com/redux/4.0.0/redux.js',
      // '//cdn.bootcss.com/react-redux/5.0.7/react-redux.js',
      // '//cdn.bootcss.com/redux-thunk/2.3.0/redux-thunk.js',
      '//cdn.bootcss.com/react-router-dom/4.2.2/react-router-dom.js'
      // '//cdn.bootcss.com/react-router-redux/4.0.8/ReactRouterRedux.js',
      // '//cdn.bootcss.com/history/4.7.2/history.js'
      // '//cdn.bootcss.com/zepto/1.2.0/zepto.js'
    ]
  },
  PROD: {
    css: [],
    js: [
      '//cdn.bootcss.com/core-js/2.5.7/core.min.js',
      // '//cdn.bootcss.com/babel-polyfill/6.26.0/polyfill.min.js',
      '//cdn.bootcss.com/react/16.4.0/umd/react.production.min.js',
      '//cdn.bootcss.com/react-dom/16.4.0/umd/react-dom.production.min.js',
      // '//cdn.bootcss.com/redux/4.0.0/redux.min.js',
      // '//cdn.bootcss.com/react-redux/5.0.7/react-redux.min.js',
      // '//cdn.bootcss.com/redux-thunk/2.3.0/redux-thunk.min.js',
      '//cdn.bootcss.com/react-router-dom/4.2.2/react-router-dom.min.js'
      // '//cdn.bootcss.com/react-router-redux/4.0.8/ReactRouterRedux.min.js',
      // '//cdn.bootcss.com/history/4.7.2/history.min.js'
      // '//cdn.bootcss.com/zepto/1.2.0/zepto.min.js'
    ]
  }
}[ENV]

export {
  PUBLIC_CDN,
  HOST,
  PORT,
  PASSWORD,
  DATABASE,
  ADMIN_PATH,
  ENV
}
