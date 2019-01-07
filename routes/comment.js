const CommentController = require('../controller/commentController')

const commentController = new CommentController()

module.exports = (router) => {

  router.all('/comment/insert', async (ctx, next) => {
    await commentController.insert(ctx)
  })

  router.all('/rsi/rsi/punch_attenceAddParams.action', async (ctx, next) => {
    console.log('tag', '-----------------')
    ctx.body = {
      errCode: 0
    }
  })

} 