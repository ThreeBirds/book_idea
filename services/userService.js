const sqlHelper = require('../common/sqlHelper')
const WeChatUtils = require('../common/wechatUtils')
const weChatUtils = new WeChatUtils()

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
      r.msg = '查询成功'
      r.code = 0
      r.data = data.results
      r.count = count
    })
    .catch(err => {
      r.msg = err
      r.code = 1
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

  async info(openid) {
    let r = {}
    if (openid === '') {
      r.code = 1
      r.msg = '必填参数不能为空'
      return r
    }
    let date = new Date().Format("yyyy-MM-dd")
    let sql = 'SELECT *,(SELECT count(*) FROM message WHERE id not in (SELECT m.id FROM message m INNER JOIN message_read r ON m.id=r.message_id WHERE m.receiver=?) AND receiver=?) unread_count,(SELECT COUNT(*) FROM user_sign WHERE openid=? AND create_time BETWEEN DATE(?) AND (?)) sign_count, (SELECT COUNT(*) FROM fans f WHERE f.user_code=? ) fans_count,(SELECT COUNT(*) FROM fans f WHERE f.fans_code=? ) collect_count  FROM users WHERE openid=?'
    await sqlHelper.exec(sql, [openid,openid,openid, date, date + ' 23:59:59', openid, openid, openid])
    .then(data => {
      r.data = data.results
      r.code = 0
      r.msg = '查询成功'
    })
    .catch(err => {
      r.code = 2
      r.msg = err
    })
    return r
  }

  async oauth(code) {
    if (code == '') {
      return {
        errCode: 1,
        errMsg: 'code不能为空'
      }
    }
    let tokenObj = await weChatUtils.getAccessToken(code)
    let result = {}
    result.errCode = 1
    result.errMsg = '获取失败'
    let ret = false
    if (tokenObj.openid && tokenObj.access_token) {
      let user = await weChatUtils.getUser(tokenObj.openid, tokenObj.access_token) 
      if (user.openid) {
        let sql = 'INSERT INTO users(openid,name,headimgurl)  SELECT ?, ?, ? WHERE NOT EXISTS (SELECT * FROM users WHERE openid=?)'
        await sqlHelper.exec(sql, [user.openid, user.nickname||"", user.headimgurl||"", user.openid])
        .then(data => {
          ret = true
        })
        .catch(err => {
  
        })
      }
      if (ret) {
        result.errCode = 0
        result.errMsg = '获取成功'
        result.data = {
          openid: user.openid,
          name: user.nickname,
          headimgurl: user.headimgurl
        }
      }
      
    } 

    return result
  }

}

module.exports = UserService
