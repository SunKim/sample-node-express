'use strict'

// dotenv 설정파일. https://webinformation.tistory.com/106
require('dotenv').config()

const {createServer} = require('./app.js')
const option = {
	port: process.env.SERVER_PORT,
}

const www = async (config = {}) => {
	const server = await createServer(config)
	const port = config.port
	server.listen(port, () => {
		console.log(config)
		console.log(`SERVER IS RUNNING ::: ${port}`)
	})
}

www(option)
