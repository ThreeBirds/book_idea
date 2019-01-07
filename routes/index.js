let userRouter = require('./users')
let bookRouter = require('./book')
let commentRouter = require('./comment')

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
}

