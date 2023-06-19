'use strict'

const http = require('http')
const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const csp = require('helmet-csp')
const session = require('express-session')
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const i18n = require('./i18n')

// cors
const corsOptions = {
	origin: ['https://hold-file.s3.ap-northeast-2.amazonaws.com', 'https://manage.clubhold.com', 'https://hold.hair', 'https://clubhold.com'],
	credentials: true,
}
const allowedOrigins = ['https://hold-file.s3.ap-northeast-2.amazonaws.com', 'https://manage.clubhold.com', 'https://hold.hair', 'https://clubhold.com']

// 공통 function
const sunFunctions = require('./lib/sunFunctions')

// 기본 라우터
const baseRouter = require('./router/baseRouter')
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
		// cf) https://sdy-study.tistory.com/63
		// cf) https://github.com/helmetjs/helmet/tree/main/middlewares/content-security-policy
		this.app.use(
			csp({
				directives: {
					defaultSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
					scriptSrc: ["'self'", "'unsafe-inline'", 'js.example.com'],
				},
			}),
		)

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

		// db session (MySQLStore)
		const dbConfig = require(__dirname + '/config/dbConfig.json')[process.env.NODE_ENV]
		const MySQLStore = require('express-mysql-session')(session)
		const sessionDbConfig = {
			host: dbConfig.host,
			port: dbConfig.port,
			user: dbConfig.username,
			password: dbConfig.password,
			database: dbConfig.database,
		}
		// const dbConfig = require(__dirname + '/config/dbConfig.json')[process.env.NODE_ENV]
		const sessionStore = new MySQLStore(sessionDbConfig)
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
		this.app.use(session(sess))

		// i18n
		this.app.use(i18n)

		// common actions for all requests
		this.app.use(async (req, res, next) => {
			const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
			const protocol = req.headers['x-forwarded-proto'] || req.protocol
			const now = sunFunctions.getCurDttm()

			// console.log(`ENV::${process.env.NODE_ENV} || URI::${req.url} || HOST::${protocol}://${req.hostname}`)
			if (req.method == 'GET') {
				console.log(`${req.method} - ${req.url} [${ip}]`)
			} else {
				console.log(`${req.method} - ${req.url} [${ip}]. body: `, req.body)
			}

			// view(.ejs)에서 공통함수 사용
			this.app.locals.sunFunctions = sunFunctions

			// https redirect
			if (req.hostname == process.env.HOSTNAME) {
				if (protocol == 'https') {
					next()
				} else {
					const from = `${protocol}://${req.hostname}${req.url}`
					const to = `https://${req.hostname}${req.url}`
					// log and redirect
					console.log(`[${req.method}]: ${from} -> ${to}`)
					res.redirect(to)
				}
			} else {
				next()
			}
		})
	}

	router() {
		this.app.use('/', baseRouter)
		this.app.use('/test', testRouter)
		this.app.use((req, res, next) => {
			// console.warn(`request url not found. req.headers.host+url: ${req.headers.host}${req.url}`)
			res.status(404)
			res.render('common/404')
		})
	}

	dbConnection() {
		console.log('\n\nDB CONNECTION - Environment ::: ' + process.env.NODE_ENV)

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
