const UserController = require('../controller/userController')
const userController = new UserController()

module.exports =  (router) => {
  router.get('/user', async function (ctx, next) {
    await userController.findUserData(ctx)
  })
}
