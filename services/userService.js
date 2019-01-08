const sqlHelper = require('../common/sqlHelper')

class UserService {

  async findUserData() {
    let result
    await sqlHelper.exec('SELECT * FROM admin')
      .then(data => {
        result = data
      })
      .catch(err => {

      })
    return result
  }

  async updateScore(openid, score) {
    let r = 0
    await sqlHelper.exec('UPDATE users SET score=? WHERE openid=?', [score, openid])
      .then(data => {
        r = data.results.affectedRows
      })
      .catch(err => {

      })
    return r
  }

  async follow(fansCode, userCode, flw) {
    let count = 0
    let r = false
    if (flw) {
      //操作为关注时，先查询是否有关注信息
      await sqlHelper.exec('SELECT count(*) count FROM fans WHERE fans_code=? AND user_code=?', [fansCode, userCode])
        .then(data => {
          count = data.results[0].count

        })
        .catch(err => {

        })
      if (count == 0) {
        //如果这个人没有关注过那个人if (count == 0) {
        await sqlHelper.exec('INSERT INTO fans(fans_code, user_code) VALUES(?, ?)', [fansCode, userCode])
          .then(data => {
            r = data.results.affectedRows > 0 ? true : false
          })
          .catch(err => {

          })
      } else {
        r = true
      }
    } else {
      //取消关注
      await sqlHelper.exec('DELETE FROM fans WHERE fans_code=? AND user_code=?', [fansCode, userCode])
        .then(data => {
          r = data.results.affectedRows > 0 ? true : false
        })
        .catch(err => {

        })
    }

    return r
  }

  
  async query(user) {

    let sqlPre = 'SELECT *,(SELECT COUNT(*) FROM fans WHERE user_code=openid) fansCount,' +
                '(SELECT COUNT(*) FROM `comment` WHERE writer_code=openid) commentCount ' +
                'FROM users WHERE '
    let sql = ' openid in (SELECT * FROM (' +
    'SELECT user_code FROM fans GROUP BY user_code HAVING COUNT(*) >= 1 AND COUNT(*) < 4' +
    ') AS tcodes WHERE tcodes.user_code in (' +
    'SELECT writer_code FROM `comment` GROUP BY writer_code HAVING COUNT(*) >= 0 AND COUNT(*) < 4' +
    ') )'


    console.log('tag', '')
  }

}

module.exports = UserService
