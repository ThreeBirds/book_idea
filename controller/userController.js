let UserService = require('../services/userService')
let userService = new UserService()

class UserController {

	/**
	 * 
	 * @param {Context} ctx 
	 */
	async findUserData(ctx) {
		let r = await userService.findUserData()
		ctx.body = r
	}
}

module.exports = UserController