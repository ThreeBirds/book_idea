let userRouter = require('./users')
let bookRouter = require('./book')
let commentRouter = require('./comment')
let banner = require('./banner')

module.exports =  (router) => {
  router.get('/welcome', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title'
    };

    await ctx.render('index', {title: ctx.state});
  })

  userRouter(router)
  bookRouter(router)
  commentRouter(router)
  banner(router)
}

