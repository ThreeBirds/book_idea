const MessageService = require('../services/messageService')
const messageService = new MessageService()

class MessageController {

  async send(ctx) {
    let sender = ctx.request.query.sender || ''
    let receiver = ctx.request.query.receiver || ''
    let content = ctx.request.query.content || ''
    ctx.body = await messageService.send(sender, receiver, content)
  }

  async myMessage(ctx) {
    let openid = ctx.request.query.openid || ''
    let page = parseInt(ctx.request.query.page) || 0
    let limit = parseInt(ctx.request.query.limit) || 10
    ctx.body = await messageService.myMessage(openid, page, limit)
  }

  async messageById(ctx) {
    let messageId = ctx.request.query.messageId || ''
    let openid = ctx.request.query.openid || ''
    ctx.body = await messageService.messageById(messageId, openid)    
  }

}

module.exports = MessageController