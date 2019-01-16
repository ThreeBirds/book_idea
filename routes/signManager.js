const SignManagerController = require('../controller/signManagerController')
const signManagerController = new SignManagerController()


module.exports =  (router) => {
  router.post('/signManager/insert', async function (ctx, next) {
    await signManagerController.insert(ctx)
  })

}