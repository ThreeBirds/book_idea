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

  async queryCollection(openid, page, limit) {
    let r = {}
    if (openid === undefined || openid === '') {
      r.code = 1
      r.msg = '必填参数不能为空'
      return r
    } 
    let count = await this.queryCollectionCount(openid)
    if (count == 0) {
      r.code = 0
      r.msg = '查询成功'
      r.count = 0
      r.data = []
      return r
    }
    await sqlHelper.exec('SELECT m.*,b.name,b.cover_url FROM me_collection m INNER JOIN book_info b ON m.book_code=b.code WHERE m.openid=? LIMIT ?,?', [openid, page, limit])
    .then(data => {
      r.code = 0
      r.msg = '查询成功'
      r.data = data.results
      r.count = count
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

  /**
   * 查询收藏数量
   * @param {string} openid 
   */
  async queryCollectionCount(openid) {
    let count = 0
    await sqlHelper.exec('SELECT COUNT(*) count FROM me_collection WHERE openid=?', [openid])
    .then(data => {
      count = data.results[0].count
    })
    .catch(err => {

    })
    return count
  }

  async delete(openid, bookCode) {
    let r = {}
    if (openid === undefined || openid === '' || bookCode === undefined || bookCode === '') {
      r.code = 1
      r.msg = '必填参数不能为空'
      return r
    }
    await sqlHelper.exec('DELETE FROM me_collection WHERE openid=? AND book_code=?', [openid, bookCode])
    .then(data => {
      r.code = 0
      r.msg = '删除成功'
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

  async queryFollow(openid, type) {
    let r = {}
    if (openid === undefined || openid === '') {
      r.code = 1
      r.msg = '必要参数不能为空'
      return
    }

    let sql0 = 'SELECT f.*,u.name fansname,u.headimgurl FROM fans f INNER JOIN users u ON f.fans_code=u.openid WHERE f.user_code=?'
    let sql1 = 'SELECT f.*,u.name username,u.headimgurl FROM fans f INNER JOIN users u ON f.user_code=u.openid WHERE f.fans_code=?'
    let sql = type == 0?sql0:sql1
    await sqlHelper.exec(sql, [openid])
    .then(data => {
      r.code = 0
      r.data = data.results
      r.count = r.data.length
      r.msg = '查询成功'
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

  /**
   * 查询某人评论或者评论某人的
   * @param {string} openid 用户id
   * @param {number} type 评论类型 0书评 1回复 
   * @param {number} me 1该人评论的 0评论该人的
   * @param {number} page 
   * @param {number} limit 
   */
  async queryComment(openid, type, me, page, limit) {
    let r = {}
    if (openid === undefined || openid === '') {
      r.code = 1
      r.msg = '必要参数不能为空'
      return
    }

    let sql0 = 'SELECT c.*,u.name,u.headimgurl,bi.`name`,bi.cover_url,c3.content orgin_content FROM `comment` c INNER JOIN users u ON c.writer_code=u.openid LEFT JOIN book_info bi ON c.book_code=bi.`code` LEFT JOIN `comment` c3 ON c.reply_to=c3.id WHERE reply_to in ( ' +
      'SELECT c2.id FROM `comment` c2 WHERE writer_code=? ' +
    ') LIMIT ?,? '
    let sql1 = 'SELECT c.*,u.name,u.headimgurl FROM `comment` c INNER JOIN users u ON writer_code=openid WHERE writer_code = ? LIMIT ?,?'
    let sql = me === 1?sql1:sql0
    let sqlCount = me === 1?'SELECT COUNT(*) count FROM `comment` c INNER JOIN users u ON writer_code=openid WHERE writer_code = ?':'SELECT COUNT(*) count FROM `comment` c INNER JOIN users u ON c.writer_code=u.openid WHERE reply_to in (SELECT c2.id FROM `comment` c2 WHERE writer_code=?)'
    let count = 0
    let countErr = null
    await sqlHelper.exec(sqlCount, [openid])
    .then(data => {
      count = data.results[0].count
    })
    .catch(err => {
    })
    
    if (count === 0) {
      r.code = 0
      r.msg = '查询成功'
      r.data = []
      return r
    }

    await sqlHelper.exec(sql, [openid, page, limit])
    .then(data => {
      r.code = 0
      r.msg = '查询成功'
      r.data = data.results
      r.count = count
    })
    .catch(err => {
      r.code = 2
      r.msg = err
    })

    return r
  }

}

module.exports = MeService