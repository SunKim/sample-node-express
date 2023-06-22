const jwt = require('jsonwebtoken')

module.exports = {
	createToken: (data) => {
		const expiresIn = 60 * 60 * Number(process.env.JWT_EXPIRE_HOURS)
		const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn})
		return token
	},
	checkToken: (token) => {
		return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return false
			} else {
				return true
			}
		})
	},
	getTokenData: (token) => {
		return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			return decoded
		})
	},
}
