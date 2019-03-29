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
    book.authorSummary = ctx.request.body.authorSummary || ''
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
    let r = await bookInfoService.add(book, coverImg)
    if (r > 0) {
      ctx.body = {
        errCode: 0,
        errMsg: '插入成功'
      }
    } else {
      ctx.body = {
        errCode: 1,
        errMsg: '插入失败'
      }
    }
  }

  async update(ctx) {
    let book = {}
    let id = ctx.request.body.id || ''
    book.code = ctx.request.body.code || ''
    book.name = ctx.request.body.name || ''
    book.typeCode = ctx.request.body.typeCode || ''
    book.recommen = ctx.request.body.recommen || ''
    book.author = ctx.request.body.author || ''
    book.authorSummary = ctx.request.body.authorSummary || ''
    book.summary = ctx.request.body.summary || ''
    book.coverUrl = ctx.request.body.coverUrl || ''
    book.toRoot = parseInt(ctx.request.body.toRoot) || 0
    if (id === '' || book.code === '' || book.name === '' || book.typeCode === '') {
      ctx.body = {
        errCode: 1,
        errMsg: '必填字段不能为空'
      }
      return
    }
    const coverImg = ctx.request.files.coverFile
    let r = await bookInfoService.update(id, book, coverImg)
    if (r > 0) {
      ctx.body = {
        errCode: 0,
        errMsg: '修改成功'
      }
    } else {
      ctx.body = {
        errCode: 1,
        errMsg: '修改失败'
      }
    }
  }

  async query(ctx) {

    let toRoot = ctx.request.query.toRoot
    let typeCode = ctx.request.query.typeCode
    let name = ctx.request.query.name
    let start = parseInt(ctx.request.query.page) || 0
    let size = parseInt(ctx.request.query.limit) || 10
    let r = await bookInfoService.query(toRoot, typeCode, name, start, size)
    ctx.body = r
  }

  async queryByCode(ctx) {
    let code = ctx.params.code || ""
    let openid = ctx.params.openid || ""
    if (code === '' || openid == '') {
      ctx.body = {
        errCode: 1,
        errMsg: 'code不能为空'
      }
    } else {
      let r = await bookInfoService.queryByCode(openid, code)
      ctx.body = {
        errCode: 0,
        errMsg: '查询成功',
        data: r
      }
    }
  }

  async delete(ctx) {
    let codes = ctx.params.codes || ""
    codes = JSON.parse(codes)
    if (codes instanceof Array && codes.length > 0) {
      let r = await bookInfoService.delete(codes) 
      if (r) {
        ctx.body = {
          errCode: 0,
          errMsg: '删除成功'
        }
      } else {
        ctx.body = {
          errCode: 1,
          errMsg: '字段输入不正确'
        }
      }
    } else {
      ctx.body = {
        errCode: 1,
        errMsg: '字段输入不正确'
      }
    }
    
  }

  async queryGoodBooks(ctx) {
    let start = parseInt(ctx.request.query.page) || 0
    let size = parseInt(ctx.request.query.limit) || 10
    ctx.body = await bookInfoService.queryGoodBooks(start, size)
  }

}

module.exports = BookInfoController