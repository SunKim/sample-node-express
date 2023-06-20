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
		title: 'Hello',
	}
	const sessUserData = getTokenData(req.session.user_token)
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

	return res.render('test/main', {sessUserData, viewData, users, usersPerDates})
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
			return res.send({success: 400, message: '이메일 또는 비밀번호가 일치하지 않습니다.'})
		}
		const pwdEnc = sunFunctions.encrypt(pwd)
		if (sunFunctions.decrypt(user.pwd) !== pwd) {
			return res.send({success: 400, message: '이메일 또는 비밀번호가 일치하지 않습니다.'})
		}

		// const token = createToken(user)
		const token = createToken({idx: user.idx, userNm: user.userNm, email: user.email})
		req.session.user_token = token
		req.session.save()

		// update lastLoginDttm
		await db.testUsers.update({lastLoginDttm: new Date()}, {where: {idx: user.idx}})

		return res.send({success: 200, message: '로그인이 완료되었습니다.\n메인 페이지로 이동합니다.'})
	} catch (e) {
		console.error(e)
		return res.send({success: 500, message: '로그인 처리중 오류가 발생했습니다.\n관리자에게 문의 바랍니다.'})
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
			return res.send({success: 400, message: '이미 가입된 이메일입니다.'})
		}
		console.log(`/test/join. pwd enc:`, sunFunctions.encrypt(pwd))

		const newUser = {
			email,
			userNm,
			pwd: sunFunctions.encrypt(pwd),
		}
		const newUserObj = await db.testUsers.create(newUser)

		return res.send({success: 200, message: '회원가입이 완료되었습니다.\n로그인 페이지로 이동합니다.'})
	} catch (e) {
		console.error(e)
		return res.send({success: 500, message: '가입 처리중 오류가 발생했습니다.\n관리자에게 문의 바랍니다.'})
	}
})

// test api
router.post('/api', async (req, res) => {
	console.log(`/test/api - req.body:`, req.body)
	const {sampleParam1, sampleParam2, appVerInfo, deviceInfo} = req.body

	// validation
	if (!sampleParam1 || !sampleParam2) {
		return res.send({success: 200, message: '필수 파라미터가 누락되었습니다.'})
	}

	// process
	try {
		// 테스트로 원래 받았던 param 그대로 return
		return res.send({success: 200, sampleParam1, sampleParam2, appVerInfo, deviceInfo})
	} catch (e) {
		console.error(e)
		return res.send({success: 500, message: '가입 처리중 오류가 발생했습니다.\n관리자에게 문의 바랍니다.'})
	}
})

module.exports = router
