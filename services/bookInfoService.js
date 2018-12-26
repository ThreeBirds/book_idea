const sqlHelper = require('../common/sqlHelper')
const path = require('path')
const crypt = require('crypto')
const fs = require('fs')

class BookInfoService {

  /**
   * 
   * @param {*} book 
   * @param {File} coverImg 
   */
  async add(book, coverImg) {
    let fileName = coverImg.name
    let filePath = ''
    if (fileName != '' && coverImg.size > 0) {
      //如果有文件上传
      fileName = new Date() + fileName
      const hashMD5 = crypt.createHash('md5')
      hashMD5.update(fileName)
      fileName = hashMD5.digest('hex')
      filePath = __dirname + `/../public/upload/${fileName}` + path.extname(coverImg.name)
      //将文件保存
      const reader = fs.createReadStream(coverImg.path)
      const upStream = fs.createWriteStream(filePath)
      reader.pipe(upStream)
    }
    //插入记录
    let r = 0
    await sqlHelper.exec('INSERT INTO book_info(CODE,NAME,type_code,cover_url,recommen,author,summary,to_root) ' +
     'VALUES(?,?,?,?,?,?,?,?)',[book.code, book.name, book.typeCode, filePath, book.recommen, book.author, book.summary, book.toRoot])
     .then(data => {
      r = data.results.affectedRows
     })
     .catch(err => {

     })
     console.log('tag', r)
  }
}

module.exports = BookInfoService