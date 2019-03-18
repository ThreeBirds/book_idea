let request = require('request')

class WechatUtils {

  constructor() {
    this.access_token = null
  }

  async getUser(openid, access_token) {
    let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    let user = {}
    await new Promise((resolve, reject) => {
      request({
        url
      }, (err, response, body) => {
        if (err) {
          reject(err)
        } else {
          resolve(body)
        }
      })
    })
    .then(data => {
      user = JSON.parse(data) || {}
    })
    .catch(err => {

    })
    return user
  }

  async getAccessToken(code) {
    // if (this.access_token == null) {
    //   this.access_token = "0000"
    // }
    let access_token = {}
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx59aacdfcf6bfed35&secret=b53aeb380f537e20cf4aa3df5fb8ecd5&code=${code}&grant_type=authorization_code`
    await new Promise((resolve, reject) => {
      request({
        url
      }, (err, response, body) => {
        if (err) {
          reject(err)
        } else {
          resolve(body)
        }
      })
    })
    .then(data => {
      let res = JSON.parse(data)
      access_token = {access_token: res.access_token, openid: res.openid}
    })
    .catch(err => {

    })
    return access_token
  }

}

module.exports = WechatUtils
