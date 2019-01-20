const sqlHelper = require('../common/sqlHelper')
const ScoreManagerService = require('./scoreManagerService')
const scoreManagerService = new ScoreManagerService()

class CommentService {

  /**
   * 插入评论
   * @param {{writeCode:string, type:string, content:string, bookCode:string}} comment 
   */
  async insert(comment) {

    let sql = 'INSERT INTO `comment` (writer_code,type,content,book_code) VALUES(?,"0",?,?)'
    let r = {}
    await sqlHelper.exec(sql, [comment.writeCode, comment.content, comment.bookCode])
    .then(data => {
      r.code = 0
      r.msg = '评论成功'
      scoreManagerService.commentWordScore(comment.writeCode, comment.content)
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

  /**
   * 插入评论
   * @param {{writeCode:string, type:string, content:string, bookCode:string, respCode:string}} comment 
   */
  async reply(comment) {

    let sql = 'INSERT INTO `comment` (writer_code,resp_code,type,content,book_code) VALUES(?,?,"1",?,?)'
    let r = {}
    await sqlHelper.exec(sql, [comment.writeCode, comment.respCode, comment.content, comment.bookCode])
    .then(data => {
      r.code = 0
      r.msg = '回复成功'
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

  /**
   * 查询评论
   * @param {{startTime:string, endTime:string, name:string, content:string, type:string, reportCountMin:number, reportCountMax:number}} comment 
   * @param {number} page 
   * @param {number} limit 
   */
  async query(comment, page, limit) {
    
    let args = []
    args.push(comment.startTime)
    args.push(comment.endTime)
    let sql = 'SELECT c.*,u.name FROM `comment` c INNER JOIN users u ON c.writer_code = u.openid WHERE c.create_time BETWEEN DATE(?) AND DATE(?) AND '
    let countSql = 'SELECT COUNT(*) count FROM `comment` c INNER JOIN users u ON c.writer_code = u.openid WHERE c.create_time BETWEEN DATE(?) AND DATE(?) AND '
    
    if (comment.type !== undefined) {
      sql += 'type=? AND '
      countSql  += 'type=? AND '
      args.push(comment.type)
    }
    if (comment.name !== undefined) {
      sql += 'u.name like ? AND '
      countSql += 'u.name like ? AND '
      args.push(`%${comment.name}%`)
    }
    if (comment.content !== undefined) {
      sql += 'content like ? AND '
      countSql += 'content like ? AND '
      args.push(`%${comment.content}%`)
    }
    if (!isNaN(comment.reportCountMin)) {
      sql += 'report_count >= ? AND '
      countSql += 'report_count >= ? AND '
      args.push(comment.reportCountMin)
    }
    if (!isNaN(comment.reportCountMax)) {
      sql += 'report_count <= ? AND '
      countSql += 'report_count <= ? AND '
      args.push(comment.reportCountMax)
    }
    countSql += ' 1'

    let count = await this.queryCount(countSql, args)

    sql += ' 1 LIMIT ?,?'
    args.push(page)
    args.push(limit)
    let r = {}
    await sqlHelper.exec(sql, args)
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
   * 根据条件和参数查询条数
   * @param {string} sql 
   * @param {[]} args 
   */
  async queryCount(sql, args) {
    let count = 0
    await sqlHelper.exec(sql, args)
    .then(data => {
      count = data.results[0].count
    })
    .catch(err => {

    })
    return count
  }

  async closeComment(id) {

    let r = {}
    if (id === undefined) {
      r.code = 1
      r.msg = 'id不能为空'
      return r
    }
    let sql = 'UPDATE `comment` SET status = "off" WHERE id = ? '
    await sqlHelper.exec(sql, [id])
    .then(data => {
      r.code = 0
      r.msg = '修改成功'
    })
    .catch(err => {
      r.code = 2
      r.msg = err
    })
    return r
  }

  async report(id, openid) {
    let r = {}
    if (id === undefined || openid === undefined) {
      r.code = 1
      r.msg = '必要参数不能为空'
      return r
    }

    let sql = 'UPDATE `comment` SET report_count = report_count + 1 WHERE id = ?'
    await sqlHelper.exec(sql, [id])
    .then(data => {
      r.code = 0
      r.msg = '举报成功'
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })

    return r
  }

  async praise(openid, id) {
    let r = {}
    if (openid === undefined || id === undefined) {
      r.code = 1
      r.msg = '必填参数不能为'
      return r
    }
    let isps = await this.isPraise(openid, id)
    if (isps) {
      r.code = 2
      r.msg = '该用户已经点过赞，不能重复点赞'
      return r
    }

    let sqlInsert = 'INSERT INTO praise(openid,comment_id) VALUES(?,?)'
    await sqlHelper.exec(sqlInsert, [openid, id])
    .then(data => {
      sqlHelper.exec('UPDATE `comment` SET praise_count = praise_count + 1 WHERE id = ?', [id])
      .then(data2 => {

      })
      .catch(err2 => {

      })
      r.code = 0
      r.msg = '点赞成功'
    })
    .catch(err => {
      r.code = 3
      r.msg = err
    })
    return r
  }

  async canclePraise(openid, id) {
    let r = {}
    if (openid === undefined || id === undefined) {
      r.code = 1
      r.msg = '必填参数不能为'
      return r
    }
    let isps = await this.isPraise(openid, id)
    if (!isps) {
      r.code = 2
      r.msg = '该用户没有点过赞，不能取消点赞'
      return r
    }
    let sqlDelete = 'DELETE FROM praise WHERE openid=? AND comment_id=? '
    await sqlHelper.exec(sqlDelete, [openid, id])
    .then(data => {
      sqlHelper.exec('UPDATE `comment` SET praise_count = praise_count - 1 WHERE id = ?',[id])
      .then(data2 => {

      })
      .catch(err2 => {

      })
      r.code = 0
      r.msg = '取消成功'
    })
    .catch(err => {
      r.code = 3
      r.msg = err
    })
    return r
  }

  async isPraise(openid, id) {

    let r = false
    let sql = 'SELECT COUNT(*) as count FROM praise WHERE openid= ? AND comment_id=?'
    await sqlHelper.exec(sql, [openid, id])
    .then(data => {
      r = data.results[0].count > 0?true:false
    })
    .catch(err => {

    })
    return r
  }

}

module.exports = CommentService