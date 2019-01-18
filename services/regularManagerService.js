const sqlHelper = require('../common/sqlHelper')
const crypt = require('crypto')


class RegularManagerService {

  /**
   * 插入规则
   * @param {{regularName:string, startTime:string, endTime:string, status:string,regulars:[]}} regularInfo 
   */
  async insert(regularInfo) {
    const hashMD5 = crypt.createHash('md5')
    hashMD5.update(JSON.stringify(regularInfo) + new Date())
    let regularCode = hashMD5.digest('hex')
    let regInsertOpts = []
    let regInsertSql = 'INSERT INTO regular_record(regular_type_code,regular_code,start,end,score) VALUES (?, ?, ?,?, ?)'
    for (const iterator of regularInfo.regulars) {
      regInsertOpts.push(sqlHelper.exec(regInsertSql, [iterator.regularTypeCode, regularCode, iterator.start, iterator.end, iterator.score]))
    }
    let insertOptsSuccess = false
    let r = {}
    await Promise.all(regInsertOpts)
    .then(data => {
      insertOptsSuccess = true
    })
    .catch(err => {
      r.code = 5
      r.msg = err
    })

    if (!insertOptsSuccess)
      return r
    let sql = 'INSERT INTO regular_list(regular_code,regular_name,start_time,end_time,status) VALUES (?,?,?,?,?)'
    await sqlHelper.exec(sql, [regularCode, regularInfo.regularName, regularInfo.startTime, regularInfo.endTime, regularInfo.status])
    .then(data => {
      r.code = 0
      r.msg = '插入成功'
    })
    .catch(err => {
      r.code = 6
      r.msg = err
    })
    return r
  }

  /**
   * 根据code删除规则
   * @param {string} regularCode 
   */
  async delete(regularCode) {

    let sql = 'DELETE FROM regular_list WHERE regular_code = ? '
    let r = {}
    await sqlHelper.exec(sql, [regularCode])
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

  async queryAll() {
    
    let sql = 'SELECT * FROM regular_list'
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
      r.msg = err
      r.count = 0
    })
    return r
  }

  async queryType() {
    let sql = 'SELECT * FROM regular_type '
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
      r.msg = err
      r.count = 0
    })
    return r
  }

  /**
   * 查询适用于某天的详细规则组合
   * @param {string} date 
   */
  async queryRegularByDate(date, regularTypeCode) {
    let sql = 'SELECT * FROM regular_record WHERE regular_code in ( ' +
      'SELECT ty.regular_code FROM (SELECT * FROM regular_list WHERE start_time <= ? AND end_time >= ? AND status="on" LIMIT 1) as ty ' +
    ') AND regular_type_code=?'

    let r = []
    await sqlHelper.exec(sql, [date, date, regularTypeCode])
    .then(data => {
      r = data.results
    })
    .catch(err => {

    })
    if (r.length > 0)
      return r[0]
    return null
  }

}

module.exports = RegularManagerService