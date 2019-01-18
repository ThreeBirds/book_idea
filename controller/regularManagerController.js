const RegularManagerService  = require('../services/regularManagerService')
const regularManagerService = new RegularManagerService()

class RegularManagerController {

  async insert(ctx) {
    
    let regularName = ctx.request.query.regularName || ''
    let startTime = ctx.request.query.startTime || ''
    let endTime = ctx.request.query.endTime || ''
    let status = ctx.request.query.status || 'on'
    let regulars = []
    let jn = JSON.stringify([{regularTypeCode:'sign_20190117', start: 1, end: 10, score: 1}])
    try {
      regulars = JSON.parse(ctx.request.query.regulars)
    } catch (error) {
      console.log('tag', error)
    }
    
    if (regularName === '' || startTime === '' || endTime === '') {
      ctx.body = {
        code: 1,
        msg: '必填参数不能为空'
      }
      return
    }

    if (regulars.length == 0) {
      ctx.body = {
        code: 2,
        msg: '规则不能为空'
      }
      return
    }
    let info = {}
    info.regularName = regularName
    info.startTime = startTime
    info.endTime = endTime
    info.regulars = regulars
    info.status = status
    let r = await regularManagerService.insert(info)
    ctx.body = r
  }

  async delete(ctx) {
    let regularCode = ctx.request.query.regularCode || ''
    ctx.body = await regularManagerService.delete(regularCode)
  }

  async queryAll(ctx) {
    ctx.body = await regularManagerService.queryAll()
  }

  async queryType(ctx) {
    ctx.body = await regularManagerService.queryType()
  }

}

module.exports = RegularManagerController