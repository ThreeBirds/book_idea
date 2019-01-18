const RegularManagerController = require('../controller/regularManagerController')
const regularManagerController = new RegularManagerController()


module.exports =  (router) => {
  router.get('/signManager/add', async function (ctx, next) {
    await regularManagerController.insert(ctx)
  })

}