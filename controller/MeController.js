const MeService = require('../services/MeService')
const meService = new MeService()

class MeController {

  async add(ctx) {
    let openid = ctx.request.query.openid
    let bookCode = ctx.request.query.bookCode
    ctx.body = await meService.add(openid, bookCode)
  }

  async queryCollection(ctx) {
    let openid = ctx.request.query.openid
    let page = parseInt(ctx.request.query.page) || 0
    let limit = parseInt(ctx.request.query.limit) || 10
    ctx.body = await meService.queryCollection(openid, page, limit)
  }

  async deleteCollection(ctx) {
    let openid = ctx.request.query.openid
    let bookCode = ctx.request.query.bookCode
    ctx.body = await meService.delete(openid, bookCode)
  }

  async queryFollow(ctx) {
    let openid = ctx.request.query.openid
    let type = parseInt(ctx.request.query.type) || 0
    ctx.body = await meService.queryFollow(openid, type)
  }

  async queryComment(ctx) {
    let openid = ctx.request.query.openid
    let type = parseInt(ctx.request.query.type) || 0
    let me = parseInt(ctx.request.query.me) || 0
    let page = parseInt(ctx.request.query.page) || 0
    let limit = parseInt(ctx.request.query.limit) || 10
    ctx.body = await meService.queryComment(openid, type, me, page, limit)
  }

}

module.exports = MeController
