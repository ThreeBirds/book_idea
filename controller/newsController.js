const NewsService = require('../services/NewsService')
const newsService = new NewsService()

class NewsController {

  async hotComments(ctx) {
    ctx.body = await newsService.hotComments()
  }

  async friendComments(ctx) {
    let openid = ctx.request.query.openid
    let page = parseInt(ctx.request.query.page) || 0
    let limit = parseInt(ctx.request.query.limit) || 10
    ctx.body = await newsService.friendComments(openid, page, limit)
  }
}

module.exports = NewsController