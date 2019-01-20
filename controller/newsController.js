const NewsService = require('../services/NewsService')
const newsService = new NewsService()

class NewsController {

  async hotComments(ctx) {
    ctx.body = await newsService.hotComments()
  }
}

module.exports = NewsController