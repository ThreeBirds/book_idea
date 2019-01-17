const SignManagerService = require('../services/signManagerService')
const signManagerService = new SignManagerService()

class SignManagerController {

  async insert(ctx) {
    
    let sign = {}
    sign.times = ctx.request.body.times || ""
    sign.file = ctx.request.files.file
    sign.content = ctx.request.body.content || ""
    sign.bookName = ctx.request.body.bookName || ""
    sign.defaultSign = ctx.request.body.defaultSign || "0"

    let r = await signManagerService.insert(sign)
    if (r) {
      ctx.body = {
        code: 0,
        msg: '插入成功'
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '插入失败'
      }
    }
  }

  async delete(ctx) {
    let id = ctx.request.query.id
    let r = await signManagerService.delete(id)
    if (r) {
      ctx.body = {
        code: 0,
        msg: '删除成功'
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '删除失败，该记录已被删除或者id传入不正确'
      }
    }
  }

  async update(ctx) {
    let sign = {}
    sign.times = ctx.request.body.times || ""
    sign.file = ctx.request.files.file
    sign.content = ctx.request.body.content || ""
    sign.bookName = ctx.request.body.bookName || ""
    sign.defaultSign = ctx.request.body.defaultSign || "0"
    let id = ctx.request.body.id
    let r = await signManagerService.update(sign, id)
    if (r) {
      ctx.body = {
        code: 0,
        msg: '插入成功'
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '插入失败'
      }
    }
  }

  async queryAll(ctx) {

    let r = await signManagerService.queryAll()
    ctx.body = r
  }

  async queryByDate(ctx) {
    let date = ctx.request.query.date
    let r = await signManagerService.queryByDate(date)
    ctx.body = r
  }
}

module.exports = SignManagerController