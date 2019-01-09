const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')
const session = require('koa-session')
const koaBody = require('koa-body')

const config = require('./config')
const routes = require('./routes')

const port = process.env.PORT || config.port

// error handler
onerror(app)

app.keys = ['hello World']
app.use(async (ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*')
  ctx.response.set("Access-Control-Allow-Headers", "X-Requested-With")
  ctx.response.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  await next()
})
// middlewares
app.use(bodyparser())
  .use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 20 * 1024 * 1024
    }
  }))
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'njk': 'nunjucks'},
    extension: 'njk'
  }))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(session(config.session, app))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

router.get('/*', async (ctx, next) => {
  // ctx.body = 'Hello World'
  // ctx.state = {
  //   title: 'Koa2'
  // }
  // await ctx.render('index', ctx.state)
  await next()
})

routes(router)
app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})


module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
