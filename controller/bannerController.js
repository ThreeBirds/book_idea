const BannerService = require('../services/bannerService')
const bannerService = new BannerService()

class BannerController {

  async insert(ctx) {

    let idx = parseInt(ctx.request.body.idx) || 0
    let url = ctx.request.body.url || ""
    let file = ctx.request.files.file
    if (await bannerService.insert(idx, url, file)) {
      ctx.body = {
        errCode: 0,
        errMsg: '操作成功'
      }
    } else {
      ctx.body = {
        errCode: 1,
        errMsg: '操作失败'
      }
    }
  }

  async update(ctx) {
    let banner = {}
    banner.idx = parseInt(ctx.request.body.idx) || 0
    banner.url = ctx.request.body.url || ""
    banner.file = ctx.request.files.file
    banner.id = ctx.request.body.id || ""
    if (banner.id === "") {
      ctx.body = {
        errCode: 1,
        errMsg: '操作失败'
      }
    } else {
      if (await bannerService.update(banner)) {
        ctx.body = {
          errCode: 0,
          errMsg: '操作成功'
        }
      } else {
        ctx.body = {
          errCode: 1,
          errMsg: '操作失败'
        }
      }
    }
  }

  async delete(ctx) {
    let id = ctx.request.query.id || ""
    if (id === "") {
      ctx.body = {
        errCode: 1,
        errMsg: '操作失败'
      }
    } else {
      if (await bannerService.delete(id)) {
        ctx.body = {
          errCode: 0,
          errMsg: '操作成功'
        }
      } else {
        ctx.body = {
          errCode: 1,
          errMsg: '操作失败'
        }
      }
    }
  }

  async queryAll(ctx) {
    
    ctx.body = await bannerService.queryAll()
  }

}
 
module.exports = BannerController