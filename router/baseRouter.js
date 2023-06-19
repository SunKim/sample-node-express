const express = require('express')
const router = express.Router()

router.get('/en', (req, res) => {
	// console.log(`/en - req.cookies:`, req.cookies)
	// console.log(`/en - req.query:`, req.query)

	res.cookie('lang', 'en')
	return res.redirect(req.query.uri || 'back')
})

router.get('/ko', (req, res) => {
	// console.log(`/ko - req.cookies:`, req.cookies)
	// console.log(`/ko - req.query:`, req.query)

	res.cookie('lang', 'ko')
	return res.redirect(req.query.uri || 'back')
})

router.get('/in', (req, res) => {
	// console.log(`/in - req.cookies:`, req.cookies)
	// console.log(`/in - req.query:`, req.query)

	res.cookie('lang', 'in')
	return res.redirect(req.query.uri || 'back')
})

module.exports = router
