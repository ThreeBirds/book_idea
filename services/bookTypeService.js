const sqlHelper = require('../common/sqlHelper')

class BookTypeService {

  async addType(code, type) {
    let r = 0
    await sqlHelper.exec("INSERT INTO book_type(CODE,type) VALUES(?,?)", [code, type])
      .then(data => {
        r = data.results.affectedRows
      })
      .catch(err => {

      })
    return r
  }

  async updateType(code, type) {
    let r = 0
    await sqlHelper.exec("UPDATE book_type SET type=? WHERE `code`=?", [type, code])
      .then(data => {
        r = data.results.affectedRows
      })
      .catch(err => {

      })
    return r
  }

  async delete(code) {
    let r = 0
    await sqlHelper.exec("DELETE FROM book_type WHERE CODE=?", [code])
      .then(data => {
        r = data.results.affectedRows
      })
      .catch(err => {

      })
    return r
  }

  /**
   * 
   * @param {string} code 
   * @param {string} type 
   * @param {number} start 
   * @param {number} size 
   */
  async query(code, type, start, size) {
    let sqlCountPre = 'SELECT COUNT(*) count FROM book_type WHERE '
    let sqlQueryPre = 'SELECT * FROM book_type WHERE '
    let sql = ''
    let args = []
    if (code != undefined && code != '') {
      sql += "`code` like ? AND "
      args.push('%' + code + '%')
    }
    if (type != undefined && type != '') {
      sql += "type like ? AND "
      args.push('%' + type + '%')
    }
    sql += '1'
    let count = await this.queryCount(sqlCountPre + sql, args)
    let result = {}
    result.count = count
    sql += ' LIMIT ?,?'
    args.push(start)
    args.push(size)
    await sqlHelper.exec(sqlQueryPre + sql, args)
      .then(data => {
        result.data = data.results
        result.errCode = 0
        result.errMsg = "查询成功"
      })
      .catch(err => {
        result.errCode = 1
        result.errMsg = err
      })
      return result
  }

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

}

module.exports = BookTypeService
