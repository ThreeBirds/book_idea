const sqlHelper = require('../common/sqlHelper')
const FileUtils = require('../common/fileUtils')
const ScoreManagerService = require('./scoreManagerService')
const scoreManagerService = new ScoreManagerService()

class SignManagerService {

  /**
   * 签到管理插入
   * @param {{times:string, file:File, content:string, bookName:string, defaultSign:string}} sign 
   */
  async insert(sign) {

    let filePath = FileUtils.saveFile(sign.file)

    let sql = 'INSERT INTO sign_manager(book_name,content,file_path,times,default_sign) VALUES (?,?,?,?,?)'
    let r = false
    await sqlHelper.exec(sql, [sign.bookName, sign.content, filePath, sign.times, sign.defaultSign])
    .then(data => {
      r = data.results.affectedRows
    })
    .catch(err => {

    })
    return r
  }

  async delete(id) {

    let r = false
    if (id === undefined)
      return r
    let sql = 'DELETE FROM sign_manager WHERE id=?'
    await sqlHelper.exec(sql, [id])
    .then(data => {
      r = data.results.affectedRows
    })
    .catch(err => {

    })
    return r
  }

  /**
   * 签到管理插入
   * @param {{times:string, file:File, content:string, bookName:string, defaultSign:string}} sign 
   * @param {string} id
   */
  async update(sign, id) {

    let r = false
    if (id === undefined) 
      return r
    let filePath = FileUtils.saveFile(sign.file)
    let sql = 'UPDATE sign_manager SET book_name=?,content=?,file_path=?,times=?,default_sign=? WHERE id=?'
    await sqlHelper.exec(sql, [sign.bookName, sign.content, filePath, sign.times, sign.defaultSign, id])
    .then(data => {
      r = data.results.affectedRows
    })
    .catch(err => {

    })
    return r
  }

  /**
   * 查询所有签到类型
   */
  async queryAll() {

    let sql = 'SELECT * FROM sign_manager'
    let r = {}
    await sqlHelper.exec(sql, [])
    .then(data => {
      r.code = 0
      r.msg = '查询成功'
      r.data = data.results
      r.count = data.results.length || 0
    })
    .catch(err => {
      r.code = 1
      r.count = 0
      r.msg = err
      r.data = []
    })
    return r
  }

  async queryByDate(date) {
    let sql = 'SELECT * FROM sign_manager WHERE times LIKE ? LIMIT 1'
    let r = {}
    if (date === undefined) {
      r.count = 0
      r.code = 1
      r.msg = '日期不能为空'
      return r
    }
    await sqlHelper.exec(sql, [date])
    .then(data => {
      r.data = data.results
      r.code = 0
      r.msg = '查询成功'
      r.count = data.results.length
    })
    .catch(err => {
      r.count = 0
      r.code = 1
      r.msg = err
    })
    return r
  }

  /**
   * 用户签到
   * @param {string} openid 用户id
   */
  async userSign(openid) {

    let r = {}
    await sqlHelper.exec('INSERT INTO user_sign(openid) VALUES (?)', openid)
    .then(data => {
      r.code = 0
      r.msg = '签到成功'
      scoreManagerService.signScore(openid)
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

}

module.exports = SignManagerService