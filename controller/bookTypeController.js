let BookTypeService = require('../services/bookTypeService')
let bookTypeService = new BookTypeService()

/**
 * 图书类别管理类
 */
class BookTypeController {

  async addType(ctx) {
    let code = ctx.request.query.code
    let type = ctx.request.query.type
    if (code === undefined || code === '' || type === undefined || type === '') {
      ctx.body = {
        errCode: 1,
        errMsg: '插入失败'
      }
    } else {
      let r = await bookTypeService.addType(code, type)
      if (r > 0) {
        ctx.body = {
          errCode: 0,
          errMsg: '插入成功'
        }
      } else {
        ctx.body = {
          errCode: 1,
          errMsg: '插入失败,该编号可能存在'
        }
      }
    }
  }

  async updateType(ctx) {
    let code = ctx.request.query.code
    let type = ctx.request.query.type
    if (code === undefined || code === '' || type === undefined || type === '') {
      ctx.body = {
        errCode: 1,
        errMsg: '编辑失败'
      }
    } else {
      let r = await bookTypeService.updateType(code, type)
      if (r > 0) {
        ctx.body = {
          errCode: 0,
          errMsg: '修改成功'
        }
      } else {
        ctx.body = {
          errCode: 1,
          errMsg: '修改失败,该编号可能不存在'
        }
      }
    }
  }

  async delete(ctx) {
    let code = ctx.request.query.code
    if (code === undefined || code === '') {
      ctx.body = {
        errCode: 1,
        errMsg: '删除失败，编号不能为空'
      }
    } else {
      if (await bookTypeService.delete(code) > 0) {
        ctx.body = {
          errCode: 0,
          errMsg: '修改成功'
        }
      } else {
        ctx.body = {
          errCode: 1,
          errMsg: '删除失败,该编号可能不存在'
        }
      }
    }
  }

  async query(ctx) {
    let code = ctx.request.query.code
    let type = ctx.request.query.type
    let start = ctx.request.query.page
    let size = ctx.request.query.limit
    let result = await bookTypeService.query(code, type, parseInt(start), parseInt(size))
    ctx.body = result
  }

  async queryAll(ctx) {
    let result = await bookTypeService.queryAll()
    ctx.body = result
  }

}


module.exports = BookTypeController
