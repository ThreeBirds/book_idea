const RegularManagerController = require('../controller/regularManagerController')
const regularManagerController = new RegularManagerController()


module.exports =  (router) => {
  router.get('/regularManager/add', async function (ctx, next) {
    await regularManagerController.insert(ctx)
  })
  router.get('/regularManager/delete', async function (ctx, next) {
    await regularManagerController.delete(ctx)
  })
  router.get('/regularManager/queryAll', async function (ctx, next) {
    await regularManagerController.queryAll(ctx)
  })
  router.get('/regularManager/queryType', async function (ctx, next) {
    await regularManagerController.queryType(ctx)
  })
}