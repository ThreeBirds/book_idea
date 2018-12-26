const BookInfoService = require('../services/bookInfoService')
const bookInfoService = new BookInfoService()

class BookInfoController {

  async add(ctx) {

    let book = {}
    book.code = ctx.request.body.code || ''
    book.name = ctx.request.body.name || ''
    book.typeCode = ctx.request.body.typeCode || ''
    book.recommen = ctx.request.body.recommen || ''
    book.author = ctx.request.body.author || ''
    book.summary = ctx.request.body.summary || ''
    book.toRoot = parseInt(ctx.request.body.toRoot) || 0
    if (book.code === '' || book.name === '' || book.typeCode === '') {
      ctx.body = {
        errCode: 1,
        errMsg: '必填字段不能为空'
      }
      return
    }
    const coverImg = ctx.request.files.coverFile
    await bookInfoService.add(book, coverImg)
  }
}

module.exports = BookInfoController