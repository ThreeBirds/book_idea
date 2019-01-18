const sqlHelper = require('../common/sqlHelper')
const RegularManagerService = require('../services/regularManagerService')
const regularManagerService = new RegularManagerService()
const config = require('../config')
const scoreReg = config.scoreReg

/**
 * 积分管理
 */
class ScoreManagerService {


  /**
   * 签到增加积分
   * @param {string} openId 
   */
  async signScore(openId) {

    let date = new Date().Format("yyyy-MM-dd")
    let regularGroup = null
    //查询当前日期是否有可以执行的规则组
    await sqlHelper.exec('SELECT * FROM regular_list WHERE status="on" AND  start_time <= ? AND end_time >= ? LIMIT 1', [date, date])
    .then(data => {
      let results = data.results
      if (results.length > 0)
        regularGroup = results[0]
    })
    .catch(err => {

    })
    if (regularGroup == null)
      return

    let regular = await regularManagerService.queryRegularByDate(date, scoreReg.sign)
    if (regular === null)
      return
    let scoreInc = parseInt(regular.score) || 0
    let start = parseInt(regular.start) || 0
    let end = parseInt(regular.end) || 0
    let startTime = regularGroup.start_time
    let endTime = regularGroup.end_time

    let signCountSql = 'SELECT COUNT(*) count FROM user_sign WHERE create_time >= ? AND create_time <= ?'
    let count = null
    await sqlHelper.exec(signCountSql, [startTime, endTime])
    .then(data => {
      count = data.results[0].count
    })
    .catch(err => {

    })
    if (count == null)
      return
    if (count >= start && count <= end) {
      sqlHelper.exec('UPDATE users SET score = score + ? WHERE openid = ?', [scoreInc, openId])
      .then(data => {

      })
      .catch(err => {
        
      })
    }
    
  }
}

module.exports = ScoreManagerService
