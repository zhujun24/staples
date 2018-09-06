import path from 'path'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import json from 'koa-json'
import { ENV } from './config'
import template from './template'
import timer from './middleware/timer'
import { TestDB, dbInit } from './db/dbInit'
import viewCtl from './controllers/view'
import health from './controllers/health'

const app = new Koa()
const router = new KoaRouter()

app.use(timer)
app.use(bodyParser())
app.use(json())

// 配置静态资源
app.use(KoaStatic(path.join(__dirname, './static')))

// config webpack-dev in develop env
if (ENV === 'DEV') {
  const webpack = require('webpack')
  const devMiddleware = require('./middleware/devMiddleware')
  const hotMiddleware = require('./middleware/hotMiddleware')
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
  ctx.body = await TestDB.find({
    collection: 'demo'
  })
})

router.get('/health', health)
router.all('*', viewCtl, template)

;(async () => {
  await Promise.all([
    dbInit()
  ])

  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(3000)
})()
