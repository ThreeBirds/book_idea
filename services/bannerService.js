const sqlHelper = require('../common/sqlHelper')
const FileUtils = require('../common/fileUtils')

class BannerService {

  /**
   * 
   * @param {number} idx 顺序
   * @param {string} url 链接
   * @param {File} file 图片
   */
  async insert(idx, url, file) {

    let path = FileUtils.saveFile(file)
    let sql = "INSERT INTO banner(idx,url,file_path) VALUES (?, ?, ?)"
    let r = false
    await sqlHelper.exec(sql, [idx, url, path])
    .then(data => {
      r = data.results.affectedRows > 0 ? true : false
    })
    .catch(err => {

    })
    return r
  }

  /**
   * 修改轮播图
   * @param {{idx:number, url:string, file:File, id:string}} banner 
   */
  async update(banner) {

    let filePath = FileUtils.saveFile(banner.file)
    let sql = "UPDATE banner SET idx=?,url=?,file_path=? WHERE id=?"
    let r = false
    await sqlHelper.exec(sql, [banner.idx, banner.url, filePath, banner.id])
    .then(data => {
      r = data.results.affectedRows > 0 ? true : false
    })
    .catch(err => {

    })
    return r
  }

  async delete(id) {
    let sql = 'DELETE FROM banner WHERE id=?'
    let r = false
    await sqlHelper.exec(sql, [id])
    .then(data => {
      r = data.results.affectedRows > 0 ? true : false
    })
    .catch(err => {

    })
    return r
  }

}

module.exports = BannerService