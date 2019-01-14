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

  /**
   * 
   * @param {{name:string, scoreMin:number, scoreMax:number, fansMin:number, fansMax:number}} user
   * @param {number}start 分页起始条目
   * @param {number}size 分页一页的数量 
   */
  async query(user, start, size) {
    
    let sql = 'SELECT *,(SELECT COUNT(*) FROM fans WHERE user_code=openid) fansCount,' +
                '(SELECT COUNT(*) FROM `comment` WHERE writer_code=openid) commentCount ' +
                'FROM users '
    let args = []
    if (user.fansMax === user.fansMax || user.fansMin > 0) {
      sql += ' HAVING fansCount >= ? ' 
      args.push(user.fansMin)
      if (user.fansMax === user.fansMax) {
        sql += 'AND fansCount <= ? AND '
        args.push(parseInt(user.fansMax))
      }
    } else {
      sql += 'WHERE '
    }

    if (user.scoreMin > 0 || user.scoreMax === user.scoreMax) {
      sql += ' score >= ? AND '
      args.push(user.scoreMin)
      if (user.scoreMax === user.scoreMax) {
        sql += 'score <= ? AND '
        args.push(parseInt(user.scoreMax))
      }
    }

    sql += '`name` LIKE ? '
    args.push(`%${user.name}%`)
    //查询数量的sql
    let sqlCount = `SELECT COUNT(*) count FROM (${sql} ) AS r `
    //查询数量的
    let count = 0
    await sqlHelper.exec(sqlCount, args)
    .then(data => {
      count = data.results[0].count
    })
    .catch(err => {

    })

    sql += 'LIMIT ?,?'
    args.push(start)
    args.push(size)
    let r = {}
    await sqlHelper.exec(sql, args)
    .then(data => {
      r.errMsg = '查询成功'
      r.errCode = 0
      r.data = data.results
      r.count = count
    })
    .catch(err => {
      r.errMsg = err
      r.errCode = 1
    })
    return r
  }

  async editScore(openid, score) {

    let sql = 'UPDATE users SET score=? WHERE openid=? '
    let r = false
    await sqlHelper.exec(sql, [score, openid])
    .then(data => {
      r = data.results.affectedRows > 0 ? true : false
    })
    .catch(err => {

    })
    return r
  }

}

module.exports = UserService
