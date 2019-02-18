const UserController = require('../controller/userController')
const userController = new UserController()

module.exports =  (router) => {
  router.get('/users/update', async function (ctx, next) {
    await userController.updateScore(ctx)
  })
  router.get('/users/follow', async function (ctx, next) {
    await userController.follow(ctx)
  })
  router.get('/users/query', async function (ctx, next) {
    await userController.query(ctx)
  })
  router.get('/users/edit', async function (ctx, next) {
    await userController.editScore(ctx)
  })
  router.get('/users/info', async function (ctx, next) {
    await userController.info(ctx)
  })
}
