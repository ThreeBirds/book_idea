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
  //举报
  router.get('/comment/report/:id', async (ctx, next) => {
    await commentController.report(ctx)
  })
  //点赞
  router.get('/comment/praise', async (ctx, next) => {
    await commentController.praise(ctx)
  })
  //取消点赞
  router.get('/comment/canclePraise', async (ctx, next) => {
    await commentController.canclePraise(ctx)
  })
  //该用户是否点赞过该评论
  router.get('/comment/isPraise', async (ctx, next) => {
    await commentController.isPraise(ctx)
  })
  //某些用户是否点过赞
  router.post('/comment/  ', async (ctx, next) => {
    await commentController.praiseRecords(ctx)
  })
} 