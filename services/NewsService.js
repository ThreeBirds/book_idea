const sqlHelper = require('../common/sqlHelper')

class NewsService {
  
  async hotComments() {
    let r = {}
    let sql = 'SELECT * FROM `comment` ORDER BY praise_count DESC LIMIT 50 '
    await sqlHelper.exec(sql, [])
    .then(data => {
      r.code = 0
      r.msg = '查询成功'
      r.data = data.results
      r.count = r.data.length
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

}

module.exports = NewsService