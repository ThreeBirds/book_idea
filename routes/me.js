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
}
