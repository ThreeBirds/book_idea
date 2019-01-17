const path = require('path')
const crypt = require('crypto')
const fs = require('fs')

class FileUtils {

  /**
   * 
   * @param {File} file 
   */
  static saveFile(file) {
    if (file === undefined)
      return ''
    let fileName = file.name
    let filePath = ''
    if (fileName != '' && file.size > 0) {
      //如果有文件上传
      fileName = new Date() + fileName
      const hashMD5 = crypt.createHash('md5')
      hashMD5.update(fileName)
      fileName = hashMD5.digest('hex')
      filePath = `upload/${fileName}` + path.extname(file.name)
      //将文件保存
      const reader = fs.createReadStream(file.path)
      const upStream = fs.createWriteStream(__dirname + "/../public/" + filePath)
      reader.pipe(upStream)
      // reader.close()
      // upStream.close()
    }
    return filePath
  }
}

module.exports = FileUtils