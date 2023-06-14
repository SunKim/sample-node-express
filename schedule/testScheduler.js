'use strict'

const schedule = require('node-schedule')
const db = require('../models/index')
const axios = require('axios')

const sunFunctions = require('../lib/sunFunctions')

// test scheduler
const run = () => {
	const rule = new schedule.RecurrenceRule()
	// cf) minute는 꼭 지정해줘야함. https://www.npmjs.com/package/node-schedule
	rule.hour = 10
	rule.minute = 15
	rule.tz = 'Asia/Seoul'

	// crontab base - 5초마다 실행
	// schedule.scheduleJob(`0/5 * * * * *`, async () => {

	// crontab base - 매시 10분 수행. 2~5시 4시간은 제외. 운송장번호당 하루 20회 조회 가능
	// schedule.scheduleJob(`0 10 0-1,6-23 * * *`, async () => {

	// rule base
	schedule.scheduleJob(rule, async () => {
		console.log(`\n\n\nschedule() - testScheduler start =================================== ${sunFunctions.getCurDttm()}`)

		try {
			// do something

			console.log(`schedule() - testScheduler end =================================== ${sunFunctions.getCurDttm()}`)
		} catch (e) {
			console.error(`schedule() - testScheduler. error: `, e)
		}
	})
}

module.exports = {
	run: run,
}
