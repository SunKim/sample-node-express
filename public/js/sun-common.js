// input 박스 클릭시 0일 때 null ex) <input @foucs="emptyNumberInput" />
const emptyNumberInput = (e) => {
	// 입력된 데이터 타입이 문자열이고 0일 때
	if (typeof e.target.value === 'string' && e.target.value === '0') {
		e.target.value = ''
	}
	// 입력된 데이터 타입이 숫자이고 0일 때
	if (typeof e.target.value === 'number' && e.target.value === 0) {
		e.target.value = ''
	}
}

const getRandomId = () => {
	const now = new Date()
	return `id${now.getTime()}`
}

// 숫자에 콤마
const setComma = (num) => {
	if (typeof (num * 1) !== 'number') {
		return 0
	}
	return Math.round(num)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 콤마 표시, 값이 없거나 0일경우 - 로 반환 an
const setCommaDash = (num) => {
	if (typeof (num * 1) !== 'number' || num * 1 === 0) {
		return '-'
	}
	return Math.round(num)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 현재 일시를 'yyyy-mm-dd H:i:s' 형태로 반환
const getCurDttm = () => {
	let date = new Date()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()

	month = month >= 10 ? month : '0' + month
	day = day >= 10 ? day : '0' + day
	hour = hour >= 10 ? hour : '0' + hour
	minute = minute >= 10 ? minute : '0' + minute
	second = second >= 10 ? second : '0' + second

	return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

// 현재 날짜를 'yyyy-mm-dd' 형태로 반환
const getCurDate = (_seperator) => {
	const seperator = _seperator || '-'

	let date = new Date()
	let month = date.getMonth() + 1
	let day = date.getDate()

	month = month >= 10 ? month : '0' + month
	day = day >= 10 ? day : '0' + day

	return `${date.getFullYear()}${seperator}${month}${seperator}${day}`
	// return date.getFullYear() + '-' + month + '-' + day
}

// MySQL의 DATETIME 형식을 받아서 'yyyy-mm-dd H:i:s' 형태로 반환
const formatDttm = (d) => {
	const date = new Date(d)
	let month = date.getMonth() + 1
	let day = date.getDate()
	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()

	month = month >= 10 ? month : '0' + month
	day = day >= 10 ? day : '0' + day
	hour = hour >= 10 ? hour : '0' + hour
	minute = minute >= 10 ? minute : '0' + minute
	second = second >= 10 ? second : '0' + second

	return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

// MySQL의 DATE 형식을 받아서 'yyyy-mm-dd' 형태로 반환
const formatDate = (d) => {
	const date = new Date(d)
	let month = date.getMonth() + 1
	let day = date.getDate()

	month = month >= 10 ? month : '0' + month
	day = day >= 10 ? day : '0' + day

	return date.getFullYear() + '-' + month + '-' + day
}

// MySQL의 DATE 형식을 받아서 'h:i:s' 형태로 반환
const formatTime = (d) => {
	const date = new Date(d)
	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()

	hour = hour >= 10 ? hour : '0' + hour
	minute = minute >= 10 ? minute : '0' + minute
	second = second >= 10 ? second : '0' + second

	return hour + ':' + minute + ':' + second
}

// 쿠가 가져오기
const getCookie = (name) => {
	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)
	if (parts.length === 2) return parts.pop().split(';').shift()
}
