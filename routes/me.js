const MeController = require('../controller/MeController')
const meController = new MeController()

module.exports =  (router) => {
  //添加收藏
  router.get('/me/collection', async function (ctx, next) {
    await meController.add(ctx)
  })
  //我收藏的书
  router.get('/me/queryCollection', async function (ctx, next) {
    await meController.queryCollection(ctx)
  })
  //删除收藏
  router.get('/me/deleteCollection', async function (ctx, next) {
    await meController.deleteCollection(ctx)
  })
  //关注我的和我关注的查询
  router.get('/me/queryFollow', async function (ctx, next) {
    await meController.queryFollow(ctx)
  })
  //我回复的和回复我的
  router.get('/me/queryComment', async function (ctx, next) {
    await meController.queryComment(ctx)
  })
}
