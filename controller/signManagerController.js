
class SignManagerController {

  async insert(ctx) {
    
    let times = ctx.request.body.times || ""
    let file = ctx.request.files.file
    let content = ctx.request.body.content || ""
    let bookName = ctx.request.body.bookName || ""

  }
}

module.exports = SignManagerController