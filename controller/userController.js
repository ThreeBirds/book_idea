let UserService = require('../services/userService')
let userService = new UserService()

class UserController {

	findUserData() {
		userService.findUserData()
	}
}

module.exports = UserController