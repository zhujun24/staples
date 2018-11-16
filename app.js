import path from 'path'
import _ from 'lodash'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaStatic from 'koa-static'
import cookie from 'koa-cookie'
import bodyParser from 'koa-bodyparser'
import json from 'koa-json'
import Pug from 'koa-pug'
import { ENV, PORT } from './config'
import timer from './middleware/timer'
import { BlogDB, dbInit } from './database/dbInit'
import { dashboardCtl, postCtl, aboutCtl, notfoundCtl, adminCtl } from './controllers/pages'
import { postApiCtl, loginCtl, logoutCtl, isLoginCtl } from './controllers/apis'
import health from './controllers/health'

const app = new Koa()
const router = new KoaRouter()

// eslint-disable-next-line
new Pug({
  viewPath: `${__dirname}/views`,
  helperPath: [
    { _ }
  ],
  noCache: true,
  app
})

app.use(timer)
app.use(bodyParser())
app.use(json())
app.use(cookie())

// 配置静态资源
app.use(KoaStatic(path.join(__dirname, './static')))

// config webpack-dev in develop env
if (ENV === 'DEV') {
  const webpack = require('webpack')
  const devMiddleware = require('koa-webpack-dev-middleware')
  const hotMiddleware = require('koa-webpack-hot-middleware')
  const webpackConfig = require('./webpack/webpack.dev')
  const webpacker = webpack(webpackConfig)
  app.use(devMiddleware(webpacker, {
    publicPath: '/assets',
    lazy: false,
    stats: {
      colors: true
    }
  }))
  app.use(hotMiddleware(webpacker, {
    log: console.log,
    path: '/__webpack_hmr'
  }))
}

router.get('/db', async (ctx) => {
  ctx.body = await BlogDB.find({
    collection: 'demo'
  })
})

router.get('/health', health)

// blog page
router.get('/', dashboardCtl)
router.get('/about', aboutCtl)
router.get('/post/:year/:month/:link', postCtl)

// admin page
router.get('/admin', adminCtl)
router.get('/admin/login', adminCtl)

// api
router.get('/api/post/:year/:month/:link', postApiCtl)
router.post('/api/post', postApiCtl)
router.put('/api/post', postApiCtl)
router.delete('/api/post', postApiCtl)

router.post('/api/login', loginCtl)
router.get('/api/logout', logoutCtl)
router.get('/api/islogin', isLoginCtl)

// 404 page
router.all('*', notfoundCtl)

;(async () => {
  await Promise.all([
    dbInit()
  ])

  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(PORT || 3000)
})()
