const BookController = require('../controller/bookTypeController')
const bookController = new BookController()

module.exports =  (router) => {
  //添加类别
  router.get('/book/add', async function (ctx, next) {
    await bookController.addType(ctx)
  })

  //修改类别
  router.get('/book/update', async function (ctx, next) {
    await bookController.updateType(ctx)
  })

  //删除类别
  router.get('/book/delete', async function (ctx, next) {
    await bookController.delete(ctx)
  })

    //查询
    router.get('/book/query', async function (ctx, next) {
      await bookController.query(ctx)
    })
  
}
