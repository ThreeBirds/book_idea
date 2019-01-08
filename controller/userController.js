let UserService = require('../services/userService')
let userService = new UserService()

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
    await userService.query()
  }

}

module.exports = UserController
