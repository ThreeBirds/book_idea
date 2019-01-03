const BookTypeController = require('../controller/bookTypeController')
const BookInfoController = require('../controller/bookInfoController')

const bookTypeController = new BookTypeController()
const bookInfoController = new BookInfoController()

module.exports = (router) => {

  /** ==================== 图书类别 ========================= */
  //添加类别
  router.get('/book/type/add', async function (ctx, next) {
    await bookTypeController.addType(ctx)
  })

  //修改类别
  router.get('/book/type/update', async function (ctx, next) {
    await bookTypeController.updateType(ctx)
  })

  //删除类别
  router.get('/book/type/delete', async function (ctx, next) {
    await bookTypeController.delete(ctx)
  })

  //查询
  router.get('/book/type/query', async function (ctx, next) {
    await bookTypeController.query(ctx)
  })

  //返回所有记录
  router.get('/book/type/queryAll', async function (ctx, next) {
    await bookTypeController.queryAll(ctx)
  })

  /** ================================  图书详情管理 ========================= */
  //新增图书
  router.all("/book/info/add", async function (ctx, next) {
    await bookInfoController.add(ctx)
  })
  router.all("/book/info/update", async function (ctx, next) {
    await bookInfoController.update(ctx)
  })
  router.get("/book/info/query", async function (ctx, next) {
    await bookInfoController.query(ctx)
  })
  router.get("/book/info/queryByCode/:code", async function (ctx, next) {
    await bookInfoController.queryByCode(ctx)
  })
  router.get("/book/info/delete/:codes", async function (ctx, next) {
    await bookInfoController.delete(ctx)
  })
}
