const CommentController = require('../controller/commentController')

const commentController = new CommentController()

module.exports = (router) => {

  router.all('/comment/insert', async (ctx, next) => {
    await commentController.insert(ctx)
  })
  router.all('/comment/reply', async (ctx, next) => {
    await commentController.reply(ctx)
  })
  router.get('/comment/query', async (ctx, next) => {
    await commentController.query(ctx)
  })
  router.get('/comment/close/:id', async (ctx, next) => {
    await commentController.closeComment(ctx)
  })
} 