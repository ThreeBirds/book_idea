const sqlHelper = require('../common/sqlHelper')

class MessageService {

  /**
   * 某人给某人发送私信
   * @param {string} sender 发送者id 
   * @param {string} receiver 接收者id
   * @param {string} content 消息内容
   */
  async send(sender, receiver, content) {
    let r = {}
    if (sender === '' || receiver === '' || content === '') {
      r.code = 1
      r.msg = '必填参数不能为空'
      return r
    }
    let sql = 'INSERT INTO message(sender, receiver, content) VALUES (?, ?, ?)'
    await sqlHelper.exec(sql, [sender, receiver, content])
    .then(data => {
      r.code = 0
      r.msg = '发送成功'
    })
    .catch(err => {
      r.code = 1
      r.msg = err
    })
    return r
  }

  async myMessage(openid, page, limit) {
    let r = {}
    if (openid === '') {
      r.code = 1
      r.msg = '必填参数不能为空'
      return r
    }
    let count = 0
    await sqlHelper.exec('SELECT COUNT(*) count FROM message m INNER JOIN users u ON m.sender=u.openid LEFT JOIN message_read mr ON  m.id=mr.message_id WHERE m.receiver=? ', [openid])
    .then(data => {
      count = data.results[0].count
    })
    .catch(err => {
      
    })
    if (count == 0) {
      r.count = 0
      r.data = []
      r.msg = '查询成功'
      return r
    }
    let sql = 'SELECT m.*,u.name,u.headimgurl,IFNULL(mr.receiver, 0) read_receiver FROM message m INNER JOIN users u ON m.sender=u.openid LEFT JOIN message_read mr ON  m.id=mr.message_id WHERE m.receiver=? LIMIT ?,?'
    await sqlHelper.exec(sql, [openid, page, limit])
    .then(data => {
      r.code = 0
      r.count = count
      r.data = data.results
      r.msg = '查询成功'
    })
    .catch(err => {
      r.code = 2
      r.msg = err
    })
    return r
  }

  async messageById(messageId, openid) {
    let r = {}
    if (messageId === '' || openid === '') {
      r.code = 1
      r.msg = '必填参数不能为空'
      return
    }
    await sqlHelper.exec('SELECT * FROM message WHERE id=?', [messageId])
    .then(data => {
      sqlHelper.exec('INSERT INTO message_read(receiver,message_id)  SELECT ?, ? WHERE NOT EXISTS (SELECT * FROM message_read WHERE receiver=? AND message_id=?)', [openid, messageId, openid, messageId])
      .then(data2 => {

      })
      .catch(err2 => {

      })
      r.code = 0
      r.msg = '查询成功'
      r.data = data.results
    })
    .catch(err => {
      r.code = 2
      r.msg = err
    })
    return r
  }
}

module.exports = MessageService