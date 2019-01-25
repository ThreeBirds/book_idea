const BannerController = require('../controller/bannerController')
const bannerController = new BannerController()

module.exports =  (router) => {
  router.post('/banner/insert', async function (ctx, next) {
    await bannerController.insert(ctx)
  })
  router.post('/banner/update', async function (ctx, next) {
    await bannerController.update(ctx)
  })
  router.get('/banner/delete', async function (ctx, next) {
    await bannerController.delete(ctx)
  })
  router.get('/banner/queryAll', async function (ctx, next) {
    await bannerController.queryAll(ctx)
  })
}