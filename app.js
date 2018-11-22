import path from 'path'
import _ from 'lodash'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaStatic from 'koa-static'
import cookie from 'koa-cookie'
import bodyParser from 'koa-bodyparser'
import json from 'koa-json'
import Pug from 'koa-pug'
import { ADMIN_PATH, ENV, PORT } from './config'
import timer from './middleware/timer'
import auth from './middleware/auth'
import { BlogDB, dbInit } from './database/dbInit'
import { dashboardCtl, postCtl, aboutCtl, notfoundCtl, adminCtl } from './controllers/pages'
import { tagCtl, typeCtl, postApiCtl, loginCtl, logoutCtl, isLoginCtl, uploadCtl } from './controllers/apis'
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
router.get('/archive', postCtl)
router.get('/tag/:tag', postCtl)
router.get('/type/:type', postCtl)
router.get('/post/:year/:month/:link', postCtl)

// blog api
router.get('/api/archive', postCtl)
router.get('/api/tag/:tag', postCtl)
router.get('/api/type/:tag', postCtl)

// admin page
router.get(`/${ADMIN_PATH}`, adminCtl)
router.get(`/${ADMIN_PATH}/login`, adminCtl)

// admin api
router.get(`/api/${ADMIN_PATH}/post`, auth, postApiCtl)
router.post(`/api/${ADMIN_PATH}/post`, auth, postApiCtl)
router.put(`/api/${ADMIN_PATH}/post`, auth, postApiCtl)
router.delete(`/api/${ADMIN_PATH}/post`, auth, postApiCtl)
router.get(`/api/${ADMIN_PATH}/types`, auth, typeCtl)
router.post(`/api/${ADMIN_PATH}/type`, auth, typeCtl)
router.get(`/api/${ADMIN_PATH}/tags`, auth, tagCtl)
router.post(`/api/${ADMIN_PATH}/tag`, auth, tagCtl)

router.post(`/api/${ADMIN_PATH}/login`, loginCtl)
router.get(`/api/${ADMIN_PATH}/logout`, logoutCtl)
router.get(`/api/${ADMIN_PATH}/islogin`, isLoginCtl)

router.options(`/api/${ADMIN_PATH}/upload`, auth, uploadCtl)
router.post(`/api/${ADMIN_PATH}/upload`, auth, uploadCtl)

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
