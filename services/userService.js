const sqlHelper = require('../common/sqlHelper')

class UserService {

	findUserData() {
		sqlHelper.exec('SELECT * FROM admin')
				.then(data => {
					let i = 0
				})
				.catch(err => {

				})
			
	}
}

module.exports = UserService