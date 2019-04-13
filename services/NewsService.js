const sqlHelper = require('../common/sqlHelper')

class NewsService {
  
  async hotComments() {
    let r = {}
    let sql = 'SELECT c.*,u.`name` username, u.headimgurl,b.`name` bookname,b.author,b.cover_url FROM `comment` c INNER JOIN users u ON c.writer_code=u.openid  LEFT JOIN book_info b ON c.book_code=b.`code`  WHERE c.type=0  ORDER BY praise_count DESC LIMIT 50 '
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
  
  /**
   * 查询我关注的人的动态
   * @param {string} openid 
   * @param {number} page 
   * @param {number} limit 
   */
  async friendComments(openid, page, limit) {
    let sql = 'SELECT c.*,b.`name` bookname,b.author,b.cover_url FROM `comment` c LEFT JOIN book_info b ON c.book_code=b.`code` WHERE type=0  AND status="on" AND writer_code in  (SELECT user_code FROM fans WHERE fans_code = ?) LIMIT ?,?'
    let r = {}
    if (openid === undefined || openid === '') {
      r.code = 1
      r.msg = '必要参数不能为空'
      return r
    }
    let count = 0
    await sqlHelper.exec('SELECT COUNT(*) count FROM `comment` WHERE type=0  AND status="on" AND writer_code in (SELECT user_code FROM fans WHERE fans_code = ?)', [openid])
    .then(data => {
      count = data.results[0].count
    })
    .catch(err => {

    })
    if (count === 0) {
      r.code = 0
      r.msg = '查询成功'
      r.count = count
      return r
    }
    await sqlHelper.exec(sql, [openid, page, limit])
    .then(data => {
      r.code = 0
      r.msg = '查询成功'
      r.count = count
      r.data = data.results
    })
    .catch(err => {
      r.code = 2
      r.msg = err
    })
    return r
  }

}

module.exports = NewsService