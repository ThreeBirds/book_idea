const sqlHelper = require('../common/sqlHelper')
const FileUtils = require('../common/fileUtils')

class BookInfoService {

  /**
   * 
   * @param {{code,name,typeCode,recommen,author,authorSummary,summary,isRoot}} book 
   * @param {File} coverImg 
   */
  async add(book, coverImg) {
    let filePath = FileUtils.saveFile(coverImg)
    //插入记录
    let r = 0
    await sqlHelper.exec('INSERT INTO book_info(CODE,NAME,type_code,cover_url,recommen,author,author_summary,summary,to_root) ' +
        'VALUES(?,?,?,?,?,?,?,?,?)', [book.code, book.name, book.typeCode, filePath, book.recommen, book.author,book.authorSummary, book.summary, book.toRoot])
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
   * @param {{name,typeCode,coverUrl,recommen,author,authorSummary,summary,isRoot}} book 
   * @param {File} coverImg
   */
  async update(id, book, coverImg) {

    let filePath = book.coverUrl
    let savePath = FileUtils.saveFile(coverImg)
    if (savePath !== '') {
      filePath = savePath
    }
    let r = 0
    const sql = 'UPDATE book_info SET `code`=?,`name`=?,type_code=?,cover_url=?,recommen=?,author=?,author_summary=?,summary=?,to_root=? WHERE `id`=?'
    await sqlHelper.exec(sql, [book.code,book.name, book.typeCode, filePath, book.recommen, book.author, book.authorSummary, book.summary, book.toRoot, id])
      .then(data => {
        r = data.results.affectedRows
      })
      .catch(err => {

      })
    return r
  }

  /**
   * 
   * @param {number} toRoot 
   * @param {string} typeCode 
   * @param {string} name 
   * @param {number} start
   * @param {number} size
   */
  async query(toRoot, typeCode, name, start, size) {

    // let sqlCount = "SELECT COUNT(*) count FROM book_info "
    let sqlCount = "SELECT COUNT(*) count FROM book_info bi INNER JOIN book_type bt ON bi.type_code=bt.`CODE` "
    let sqlInfo = "SELECT bi.*,bt.type FROM book_info bi INNER JOIN book_type bt ON bi.type_code=bt.`CODE` "

    let condition = "WHERE "
    let args = []
    if (toRoot !== undefined) {
      condition += "to_root=? AND "
      args.push(toRoot)
    }
    if (typeCode !== undefined) {
      condition += "type_code=? AND "
      args.push(typeCode)
    }
    if (name !== undefined) {
      condition += "`name` like ? AND "
      args.push(`%${name}%`)
    }
    condition += "1"

    sqlCount += condition
    sqlInfo += condition
    sqlInfo += " LIMIT ?,?"
    let count = await this.queryCount(sqlCount, args)
    let r = {}
    r.count = count
    args.push(start)
    args.push(size)
    await sqlHelper.exec(sqlInfo, args)
      .then(data => {
        r.code = 0
        r.msg = '查询成功'
        r.data = data.results
      })
      .catch(err => {
        r.count = 0
        r.code = 1
        r.errMsg = err
      })
    return r
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

  async queryByCode(openid, code) {
    let r = null
    await sqlHelper.exec('SELECT bi.*,bt.type,(SELECT COUNT(*) FROM me_collection WHERE openid=? AND book_code=?) iscollect FROM book_info bi  LEFT JOIN book_type bt ON  bi.type_code=bt.`CODE` WHERE bi.`code`=?', [openid, code, code])
      .then(data => {
        r = data.results
      })
      .catch(err => {
        r = err
      })
    return r
  }

  /**
   * 删除图书信息
   * @param {[string]} codes 
   */
  async delete(codes) {
    let r = 0
    let sql = 'DELETE FROM book_info WHERE CODE in (?'
    for (let i = 0; i < codes.length - 1; i++) {
      sql += ', ?'
    }
    sql += ')'
    await sqlHelper.exec(sql, codes)
      .then(data => {
        r = true
      })
      .catch(err => {
        r = false
      })
    return r
  }

  async queryGoodBooks(start, size) {

    let r = {}
    await sqlHelper.exec('SELECT * FROM book_info WHERE to_root=1 LIMIT ?,?', [start, size])
    .then(data => {
      r.code = 0
      r.msg = '查询成功'
      r.data = data.results
      r.count = data.results.count
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

}

module.exports = BookInfoService
