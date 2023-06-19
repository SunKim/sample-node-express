const express = require('express')
const router = express.Router()
const db = require('../models/index')
const axios = require('axios')
const Sequelize = require('sequelize')

const sunFunctions = require('../lib/sunFunctions')
const {createToken, checkToken, getTokenData} = require('../lib/jwtHelper')

const checkSession = (req, res, next) => {
	if (req.session.user_token) {
		const check = checkToken(req.session.user_token)
		if (check) {
			const user = getTokenData(req.session.user_token)

			console.log(`checkSession - /test${req.path} - ${user.userNm}(idx: ${user.idx})`)

			// session data를 locals에 자동으로 넘겨줌
			res.locals.user = user

			// req.path에 따라 분기처리 필요하면 여기서 처리

			return next()
		} else {
			return res.redirect('/test/login')
		}
	} else {
		return res.redirect('/test/login')
	}
}

// main page for logged in user
router.get('/', checkSession, async (req, res) => {
	const viewData = {
		title: res.__('message.hello'),
	}
	// findAll example
	// raw: true를 줘야 result가 일반 array, object로 return
	const users = await db.testUsers.findAll({attributes: ['idx', 'userNm'], where: {delYn: false}, raw: true})

	// raw query example. cf) https://sequelize.org/docs/v6/core-concepts/raw-queries/
	// raw query에서 type: Sequelize.QueryTypes.SELECT 옵션을 안주면 결과값이 중복해서 나옴. cf) https://stackoverflow.com/questions/53460754/sequelize-with-mysql-raw-query-returns-a-duplicate-result
	const qry = `
		select joinDt, count(idx) as userCnt
		from testUsers
		where 1=1
			and delYn = 0
		group by joinDt
	`
	const usersPerDates = await db.sequelize.query(qry, {raw: true, type: Sequelize.QueryTypes.SELECT})
	// console.log(`/test - usersPerDates:`, usersPerDates)

	return res.render('test/main', {viewData, users, usersPerDates})
})

// login page(form)
router.get('/login', (req, res) => {
	return res.render('test/login')
})

// process login
router.post('/login', async (req, res) => {
	const {email, pwd} = req.body

	try {
		const user = await db.testUsers.findOne({where: {email}, raw: true})
		// console.log(`/test/login. acceptsLanguages: ${JSON.stringify(req.acceptsLanguages())}`)

		if (!user) {
			return res.send({success: 400, message: res.__('sm400.loginNotFound')})
		}
		const pwdEnc = sunFunctions.encrypt(pwd)
		if (sunFunctions.decrypt(user.pwd) !== pwd) {
			return res.send({success: 400, message: res.__('sm400.loginNotFound')})
		}

		// const token = createToken(user)
		const token = createToken({idx: user.idx, userNm: user.userNm, email: user.email})
		req.session.user_token = token
		req.session.save()

		// update lastLoginDttm
		await db.testUsers.update({lastLoginDttm: new Date()}, {where: {idx: user.idx}})

		return res.send({success: 200, message: res.__('sm200.loginSuccess')})
	} catch (e) {
		console.error(e)
		return res.send({success: 500, message: res.__('sm200.loginFail')})
	}
})

router.get('/logout', async (req, res) => {
	req.session.destroy()

	return res.redirect('/test/login')
})

// join page(form)
router.get('/join', async (req, res) => {
	return res.render('test/join')
})

// process join
router.post('/join', async (req, res) => {
	const {email, userNm, pwd} = req.body

	// validation
	try {
		const user = await db.testUsers.findOne({where: {email}})
		if (user) {
			return res.send({success: 400, message: res.__('sm400.emailExist')})
		}
		console.log(`/test/join. pwd enc:`, sunFunctions.encrypt(pwd))

		const newUser = {
			email,
			userNm,
			pwd: sunFunctions.encrypt(pwd),
		}
		const newUserObj = await db.testUsers.create(newUser)

		return res.send({success: 200, message: res.__('sm200.joinSuccess')})
	} catch (e) {
		console.error(e)
		return res.send({success: 500, message: res.__('sm500.joinFail')})
	}
})

module.exports = router
