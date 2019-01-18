const SignManagerController = require('../controller/signManagerController')
const signManagerController = new SignManagerController()


module.exports =  (router) => {
  // ============ 管理系统使用接口
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

  //=========== 前端用户接口
  router.get('/signManager/userSign', async function (ctx, next) {
    await signManagerController.userSign(ctx)
  })
}