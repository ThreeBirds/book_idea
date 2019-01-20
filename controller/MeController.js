const MeService = require('../services/MeService')
const meService = new MeService()

class MeController {

  async add(ctx) {
    let openid = ctx.request.query.openid
    let bookCode = ctx.request.query.bookCode
    ctx.body = await meService.add(openid, bookCode)
  }

  async queryCollection(ctx) {
    
  }

}

module.exports = MeController
