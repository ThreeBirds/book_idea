const NewsController = require('../controller/newsController')
const newsController = new NewsController()

module.exports =  (router) => {
  //50条热评
  router.get('/news/hot', async function (ctx, next) {
    await newsController.hotComments(ctx)
  })
  
}
