let request = require('request')

class WechatUtils {

  constructor() {
    this.access_token = null
  }

  async getAccessToken() {
    // if (this.access_token == null) {
    //   this.access_token = "0000"
    // }
    let code = '222'
    let res = {}
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx59aacdfcf6bfed35&secret=b53aeb380f537e20cf4aa3df5fb8ecd5&code=${code}&grant_type=authorization_code`

    await new Promise(resolve => {
      request({
        url
      }, (err, response, body) => {
        
      })
    })
  }
}

module.exports = WechatUtils
