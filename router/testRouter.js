const express = require('express')
const router = express.Router()
const db = require('../models/index')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const sunFunctions = require('../lib/sunFunctions')

const checkSession = async (req, res, next) => {
	if (req.session.user_token) {
		const check = await checkToken(req.session.user_token)
		if (check) {
			const user = await getDataFromToken(req.session.user_token)

			console.log(`/test${req.path} - ${user.userNm}(idx: ${user.idx})`)

			// req.path에 따라 분기처리 필요하면 여기서 처리
		} else {
			res.redirect('/')
		}
	} else {
		res.redirect('/')
	}
}

const createToken = async (data) => {
	const expiresIn = 60 * 60 * Number(process.env.JWT_EXPIRE_HOURS)
	const token = jwt.sign(data, secret, {expiresIn})
	return token
}

const checkToken = async (user_token) => {
	return await jwt.verify(user_token, secret, (err, decoded) => {
		if (err) {
			return false
		} else {
			return true
		}
	})
}

const getDataFromToken = async (user_token) => {
	return await jwt.verify(user_token, secret, (err, decoded) => {
		return decoded
	})
}

router.get('/', async (req, res) => {
	const testData = {
		title: 'Hello, World!',
	}

	res.render('test/main', {testData})
})

router.get('/log', async (req, res) => {
	console.log('/log')
	res.send({success: 200})
})

module.exports = router
