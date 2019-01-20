const sqlHelper = require('../common/sqlHelper')

class MeService {


  /**
   * 收藏某图书
   * @param {string} openid 
   * @param {string} bookCode 
   */
  async add(openid, bookCode) {
    let r = {}
    if (openid === undefined || bookCode === undefined) {
      r.code = 1
      r.msg = '必要参数不能为空'
      return r
    }
    await sqlHelper.exec('INSERT INTO me_collection(openid,book_code)  SELECT ?, ? WHERE NOT EXISTS (SELECT * FROM me_collection WHERE openid=? AND book_code=?)', [openid, bookCode, openid, bookCode])
    .then(data => {
      if (data.results.affectedRows > 0) {
        r.code = 0
        r.msg = '收藏成功'
      } else {
        r.code = 3
        r.msg = '已经收藏过该图书'
      }
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }
}

module.exports = MeService