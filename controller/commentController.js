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

}

module.exports = CommentController