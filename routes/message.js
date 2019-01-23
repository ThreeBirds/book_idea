const MessageController = require('../controller/messageController')
const messageController = new MessageController()

module.exports =  (router) => {
  //50条热评
  router.get('/message/send', async function (ctx, next) {
    await messageController.send(ctx)
  })
  router.get('/message/myMessage', async function (ctx, next) {
    await messageController.myMessage(ctx)
  })
  router.get('/message/messageById', async function (ctx, next) {
    await messageController.messageById(ctx)
  })
}
