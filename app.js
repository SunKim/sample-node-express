'use strict'

const http = require('http')
const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const session = require('express-session')
const path = require('path')
const cors = require('cors')
const corsOptions = {
	origin: ['https://hold-file.s3.ap-northeast-2.amazonaws.com', 'https://manage.clubhold.com', 'https://hold.hair', 'https://clubhold.com'],
	credentials: true,
}
const allowedOrigins = ['https://hold-file.s3.ap-northeast-2.amazonaws.com', 'https://manage.clubhold.com', 'https://hold.hair', 'https://clubhold.com']
const db_config = require(__dirname + '/config/config.json')[process.env.NODE_ENV]
const fileUpload = require('express-fileupload')

const MySQLStore = require('express-mysql-session')(session)
//세션 생성에 limit이 생기거나 한계가 있으면 sequelize pool limit을 확인!
const sessionStore = new MySQLStore(db_config)
const sess = {
	resave: false,
	saveUninitialized: false,
	secret: 'sessionscrete',
	name: 'sessionId',
	cookie: {
		httpOnly: true,
		secure: false,
	},
	store: sessionStore,
	schema: {
		columnNames: {
			session_id: 'custom_session_id',
			expires: 'custom_expires_column_name',
			data: 'custom_data_column_name',
		},
	},
}

const sunFunctions = require('./lib/sunFunctions')

// 기본 테스트용 라우터
const testRouter = require('./router/testRouter')

// 기본 테스트용 스케쥴러
const testScheduler = require('./schedule/testScheduler')

const db = require('./models/index')

class AppServer extends http.Server {
	constructor(config) {
		const app = express()
		super(app)
		this.config = config
		this.app = app
		this.currentConns = new Set()
		this.busy = new WeakSet()
		this.stop = false
		process.env.NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() == 'production' ? 'production' : 'development'
	}
	start() {
		this.set()
		this.middleWare()
		this.router()
		this.dbConnection()
		this.schedule()

		return this
	}

	set() {
		this.app.engine('ejs', require('ejs').renderFile)
		this.app.set('views', __dirname + '/views')
		this.app.set('view engine', 'ejs')
	}

	middleWare() {
		this.app.enable('trust proxy')

		this.app.use(helmet())

		this.app.use(cors(corsOptions))

		// cf) https://www.npmjs.com/package/express-fileupload
		this.app.use(
			fileUpload({
				limits: {fileSize: 50 * 1024 * 1024},
				useTempFiles: true,
				tempFileDir: path.join(__dirname, './temp_upload'),
			}),
		)

		this.app.use(function (req, res, next) {
			var origin = req.headers.origin
			if (allowedOrigins.indexOf(origin) > -1) {
				res.setHeader('Access-Control-Allow-Origin', origin)
			} else {
				// console.warn(`CORS - unallowed origin: ${req.headers.origin}`)
			}
			// res.header('Access-Control-Allow-Origin', '*')
			res.header('Access-Control-Allow-Methods', '*')
			res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
			res.header('Access-Control-Allow-Credentials', true)
			return next()
		})
		this.app.use(
			express.json({
				limit: '100mb',
			}),
		)
		this.app.use(
			express.urlencoded({
				limit: '100mb',
				extended: true,
			}),
		)
		// this.app.use(bodyParser())
		this.app.use(cookieParser())
		this.app.use('/public', express.static(__dirname + '/public'))
		this.app.use(session(sess))

		this.app.use(async (req, res, next) => {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
			let protocol = req.headers['x-forwarded-proto'] || req.protocol
			// console.log("IP::" + ip)
			// console.log("ENV::"+process.env.NODE_ENV)
			// console.log("URL::"+req.url)
			// console.log("PROTOCOL:"+protocol)
			// console.log("HOST:"+protocol+"://"+req.hostname)
			const now = sunFunctions.getCurDttm()
			console.log(`ENV::${process.env.NODE_ENV} || URL::${req.url} || HOST::${protocol}://${req.hostname}`)
			if (req.hostname == 'manage.clubhold.com') {
				if (protocol == 'https') {
					next()
				} else {
					let from = `${protocol}://${req.hostname}${req.url}`
					let to = `https://${req.hostname}${req.url}`
					// log and redirect
					console.log(`[${req.method}]: ${from} -> ${to}`)
					res.redirect(to)
				}
			} else {
				next()
			}
		})

		// view(.ejs)에서 공통함수 사용
		this.app.locals.sunFunctions = sunFunctions
	}

	router() {
		this.app.use('/test', testRouter)
		this.app.use((req, res, next) => {
			// console.warn(`request url not found. req.headers.host+url: ${req.headers.host}${req.url}`)
			res.status(404)
			res.render('404')
		})
	}

	dbConnection() {
		console.log('Eviroment ::: ' + process.env.NODE_ENV)
		console.log(`db_config: ${JSON.stringify(db_config)}`)

		// cf) sequelize - http://52.78.22.201/tutorials/expressjs/expressjs_orm_two/
		db.sequelize
			.authenticate()
			.then(() => {
				console.log('development: Connection has been established successfully.')
				return db.sequelize.sync({
					force: false,
				})
			})
			.then(() => {
				console.log('DB Sync complete.')
			})
			.catch((err) => {
				console.error('Unable to connect to the database:', err)
			})
	}

	schedule() {
		console.log(`[SCHEDULE] - process.env.NODE_ENV: ${process.env.NODE_ENV}`)
		// nikeCrawling.run()
		if (process.env.NODE_ENV == 'development') {
			// testScheduler.run()
		} else if (process.env.NODE_ENV == 'production') {
			// testScheduler.run()
		}
	}
}

const createServer = (config = {}) => {
	const server = new AppServer(config)
	return server.start()
}

exports.createServer = createServer
