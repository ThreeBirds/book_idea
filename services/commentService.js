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

}

module.exports = CommentService