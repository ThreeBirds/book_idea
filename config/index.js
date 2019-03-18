module.exports = {
  port: 80,
  // mysql: {
  //   host: '127.0.0.1',
  //   port: '3306',
  //   user: 'root',
  //   db: 'ideabook',
  //   pass: 'wjshl1234*'
  // },
  mysql: {
    host: 'cdb-h31ndcva.bj.tencentcdb.com',
    port: '10086',
    user: 'root',
    db: 'ideabook',
    pass: 'wjshl1234*'
  },
  session: {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
  },
  scoreReg: {
    sign: 'sign_20190117', //签到规则
    comment: 'comment_20190117' //评论字数规则
  }
}
