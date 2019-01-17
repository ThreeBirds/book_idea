const SignManagerController = require('../controller/signManagerController')
const signManagerController = new SignManagerController()


module.exports =  (router) => {
  router.post('/signManager/insert', async function (ctx, next) {
    await signManagerController.insert(ctx)
  })
  router.get('/signManager/delete', async function (ctx, next) {
    await signManagerController.delete(ctx)
  })
  router.post('/signManager/update', async function (ctx, next) {
    await signManagerController.update(ctx)
  })
  router.get('/signManager/queryAll', async function (ctx, next) {
    await signManagerController.queryAll(ctx)
  })
  router.get('/signManager/queryByDate', async function (ctx, next) {
    await signManagerController.queryByDate(ctx)
  })
}