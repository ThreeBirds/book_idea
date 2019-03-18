let UserService = require('../services/userService')
let userService = new UserService()
let WeChatUtils = require('../common/wechatUtils')
let weChatUtils = new WeChatUtils()

class UserController {

  /**
   * 
   * @param {Context} ctx 
   */
  async findUserData(ctx) {
    let r = await userService.findUserData()
    ctx.body = r
  }

  async updateScore(ctx) {
    let openid = ctx.request.query.openid || ""
    let score = ctx.request.query.score || 0
    let r = await userService.updateScore(openid, parseInt(score))
    if (r > 0) {
      ctx.body = {
        errCode: 0,
        errMsg: '修改成功'
      }
    } else {
      ctx.body = {
        errCode: 1,
        errMsg: '修改失败'
      }
    }
  }

  async follow(ctx) {
    //点关注的openid
    let fansCode = ctx.request.query.fansCode || ""
    //被关注的人的openid
    let userCode = ctx.request.query.userCode || ""
    let flw = parseInt(ctx.request.query.flw) || 0
    if (fansCode === '' || userCode === '') {
      ctx.body = {
        errCode: 1,
        errMsg: '必要参数不能为空'
      }
      return
    }

    let r = await userService.follow(fansCode, userCode, flw)
    if (r) {
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

  async query(ctx) {

    let user = {}
    user.name = ctx.request.query.name || ""
    user.scoreMin = parseInt(ctx.request.query.scoreMin) || 0
    user.scoreMax = parseInt(ctx.request.query.scoreMax)
    user.fansMin = parseInt(ctx.request.query.fansMin) || 0
    user.fansMax = parseInt(ctx.request.query.fansMax)
    let start = parseInt(ctx.request.query.page) || 0
    let size = parseInt(ctx.request.query.limit) || 0
    let r = await userService.query(user, start, size)
    ctx.body = r
  }

  async editScore(ctx) {
    let openid = ctx.request.query.openid || ""
    let score = parseInt(ctx.request.query.score) || 0
    let r = await userService.editScore(openid, score)
    if (r) {
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

  async info(ctx) {
    let openid = ctx.request.query.openid || ""
    ctx.body = await userService.info(openid)
  }

  async oauth(ctx) {
    // ctx.response.redirect('http://www.baidu.com')
    weChatUtils.getAccessToken()
  }

}

module.exports = UserController
