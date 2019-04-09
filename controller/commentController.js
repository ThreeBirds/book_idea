const CommentService = require('../services/commentService')
const commentService = new CommentService()

class CommentController {

  async insert(ctx) {
    let writeCode = ctx.request.query.openid || ''
    let content = ctx.request.query.content || ''
    let bookCode = ctx.request.query.bookCode || ''
    if (writeCode === '' || content === '' || bookCode === '') {
      ctx.body = {
        code: 1,
        msg: '必填参数不能为空'
      }
      return
    }

    let comment = {writeCode, content, bookCode}
    ctx.body = await commentService.insert(comment)
  }

  async reply(ctx) {
    let writeCode = ctx.request.query.openid || ''
    let content = ctx.request.query.content || ''
    let bookCode = ctx.request.query.bookCode || ''
    let respCode = ctx.request.query.respCode || ''
    if (writeCode === '' || content === '' || bookCode === '' || respCode === '') {
      ctx.body = {
        code: 1,
        msg: '必填参数不能为空'
      }
      return
    }

    let comment = {writeCode, content, bookCode, respCode}
    ctx.body = await commentService.reply(comment)
  }

  async query(ctx) {
    let startTime = ctx.request.query.startTime || '2019-01-01'
    let endTime = ctx.request.query.endTime || '2019-01-01'
    let name = ctx.request.query.name
    let content = ctx.request.query.content
    let type = ctx.request.query.type
    let reportCountMin = parseInt(ctx.request.query.reportCountMin)
    let reportCountMax = parseInt(ctx.request.query.reportCountMax)
    let page = parseInt(ctx.request.query.page) || 0
    let limit = parseInt(ctx.request.query.limit) || 10
    let condition = {startTime, endTime, name, content, type, reportCountMax, reportCountMin}
    ctx.body = await commentService.query(condition, page, limit)
  }

  async closeComment(ctx) {
    let id = ctx.params.id
    ctx.body = await commentService.closeComment(id)
  }

  async report(ctx) {
    let id = ctx.params.id
    let openid = ctx.request.query.openid
    ctx.body = await commentService.report(id, openid)
  }

  async praise(ctx) {
    let openid = ctx.request.query.openid
    let id = ctx.request.query.id
    ctx.body = await commentService.praise(openid, id)
  }

  async canclePraise(ctx) {
    let openid = ctx.request.query.openid
    let id = ctx.request.query.id
    ctx.body = await commentService.canclePraise(openid, id)
  }

  async isPraise(ctx) {
    let openid = ctx.request.query.openid || ''
    let id = ctx.request.query.id || ''
    if (openid === '' || id === '') {
      ctx.body = {
        code: 1,
        msg: '必要参数不能为空'
      }
      return
    }
    let r = await commentService.isPraise(openid, id)
    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: r
    }
  }

  async praiseRecords(ctx) {
    let openid = ctx.request.query.openid || ''
    let id = ctx.request.query.id || ''
    if (openid === '' || id === '') {
      ctx.body = {
        code: 1,
        msg: '必要参数不能为空'
      }
      return
    }
    let r = await commentService.isPraise(openid, id)
    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: r
    }
  }

}

module.exports = CommentController