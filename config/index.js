module.exports = {
  port: 3000,
  mysql: {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    db: 'ideabook',
    pass: 'wjshl1234*'
  },
  session: {
    key: 'koa:sess',
    maxAge: 10000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
  }
}
