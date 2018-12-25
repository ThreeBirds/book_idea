const sqlHelper = require('../common/sqlHelper')

class UserService {

	async findUserData() {
		let result
		await	sqlHelper.exec('SELECT * FROM admin')
				.then(data => {
					result = data					 
				})
				.catch(err => {
					
				})
		return result
	}
}

module.exports = UserService