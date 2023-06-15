const cryptoJs = require('crypto-js')

module.exports = {
	// 숫자에 콤마
	setComma: (num) => {
		if (!num || typeof (num * 1) !== 'number') {
			return 0
		}
		return Math.round(num)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	},
	// 콤마 표시, 값이 없거나 0일경우 - 로 반환 an
	setCommaDash: (num) => {
		if (typeof (num * 1) !== 'number' || num * 1 === 0) {
			return '-'
		}
		return Math.round(num)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	},
	// 빈값 체크 - '', null, undefined, [], {} 모두 true로 return
	isEmpty: (val) => {
		return val === '' || val === null || val === undefined || (val !== null && typeof val === 'object' && !Object.keys(val).length)
	},
	// 퍼센트인지 체크. 소수점 1자리 (0.0 ~ 100.0)
	checkPercent: (num, scale) => {
		if (num === '' || typeof (num * 1) !== 'number' || num * 1 < 0 || num * 1 > 100) {
			return false
		}
		if (scale && Number.isInteger(scale) && (num + '').indexOf('.') > 0) {
			const tLength = (num + '').substring((num + '').indexOf('.') + 1)
			if (tLength.length > scale) {
				alert('소숫점 ' + scale + '자리만 입력가능. tLength : ' + tLength)
				return false
			}
		}

		return true
	},
	// 문자열 입력받아서 숫자만 return
	numberfy: (num) => {
		return num.replace(/[^0-9.]/g, '')
	},
	// 숫자만 있는지 체크
	checkNumber: (number) => {
		const re = /[0-9.]/g
		return re.test(number)
	},
	// validation 관련
	// 숫자 체크
	checkInt: (num, min, max) => {
		// console.log(`num : ${num}`)
		if (!num) {
			return false
		}
		if (num === '' || typeof (num * 1) !== 'number' || !Number.isInteger(num * 1) || Number.isNaN(num)) {
			return false
		}
		if ((min && num < min) || (max && num > max)) {
			return false
		}

		return true
	},
	// 금액 체크
	checkCurrency: (num, min, max) => {
		if (num === '' || typeof (num * 1) !== 'number' || !Number.isInteger(num * 1)) {
			return false
		}
		if ((min && num < min) || (max && num > max)) {
			return false
		}

		return true
	},
	// 날짜 체크
	checkDate: (date) => {
		/* eslint-disable-next-line */
		const re = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/

		return re.test(date)
	},
	// 현재 일시를 'yyyy-mm-dd H:i:s' 형태로 반환
	getCurDttm: () => {
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
	},
	// 현재 날짜를 'yyyy-mm-dd' 형태로 반환
	getCurDate: (_seperator) => {
		const seperator = _seperator || '-'

		let date = new Date()
		let month = date.getMonth() + 1
		let day = date.getDate()

		month = month >= 10 ? month : '0' + month
		day = day >= 10 ? day : '0' + day

		return `${date.getFullYear()}${seperator}${month}${seperator}${day}`
		// return date.getFullYear() + '-' + month + '-' + day
	},
	// MySQL의 DATETIME 형식을 받아서 'yyyy-mm-dd H:i:s' 형태로 반환
	formatDttm: (d) => {
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
	},
	// MySQL의 DATE 형식을 받아서 'yyyy-mm-dd' 형태로 반환
	formatDate: (d) => {
		const date = new Date(d)
		let month = date.getMonth() + 1
		let day = date.getDate()

		month = month >= 10 ? month : '0' + month
		day = day >= 10 ? day : '0' + day

		return date.getFullYear() + '-' + month + '-' + day
	},
	// MySQL의 DATE 형식을 받아서 'yyyy년 m월 d일' 형태로 반환
	formatDateMark: (d) => {
		const date = new Date(d)
		let month = date.getMonth() + 1
		let day = date.getDate()

		return date.getFullYear() + '년 ' + month + '월 ' + day + '일'
	},
	// MySQL의 DATE 형식을 받아서 'h:i:s' 형태로 반환
	formatTime: (d) => {
		const date = new Date(d)
		let hour = date.getHours()
		let minute = date.getMinutes()
		let second = date.getSeconds()

		hour = hour >= 10 ? hour : '0' + hour
		minute = minute >= 10 ? minute : '0' + minute
		second = second >= 10 ? second : '0' + second

		return hour + ':' + minute + ':' + second
	},
	// 휴대폰번호 형식 체크
	checkMobile: (mobile) => {
		/* eslint-disable-next-line */
		//const re = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/
		const reMobile = /(01[016789])([0-9]{3,4})([0-9]{4})$/
		return reMobile.test(mobile)
	},
	// 계좌번호 형식 체크
	checkAcnutNo: (acnutNo) => {
		/* eslint-disable-next-line */
		const re = /^(\d+-?)+\d+$/

		return re.test(acnutNo)
	},
	// 이메일 주소 체크
	checkEmail: (email) => {
		/* eslint-disable-next-line */
		const re = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
		// const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		// const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return re.test(String(email).toLowerCase())
	},
	formatInvocNo: (invocNo) => {
		if (!invocNo || invocNo == '') {
			return ''
		}
		return invocNo.substr(0, 4) + '-' + invocNo.substr(4, 4) + '-' + invocNo.substr(8, 5)
	},
	// 문자열에 특수문자 포함 여부
	hasSpecialCharacter: (str) => {
		const re = /[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/

		return re.test(str)
	},
	// 문자열 white space 제거
	trim: (str) => {
		return str.replace(/^\s+|\s+$/g, '')
	},
	// 숫자에 자릿수에 맞춰 0을 붙여줌. pad(5, 3) => '005'
	pad: (n, width) => {
		n = n + ''
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
	},
	// null값을 dash로 바꿔줌
	replaceNullToDash: (text) => {
		if (text === '' || text === null) {
			return '-'
		}
		return text
	},
	// 전화번호/휴대폰번호 format (즉 01011112222 받아서 010-1111-2222 리턴. 우선 숫자만 남기려면 simplifyMobile)
	formatMobile: (mobile) => {
		if (typeof (mobile * 1) !== 'number' || mobile.length > 11 || mobile.length < 9) {
			return mobile
		} else {
			return mobile.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3')
		}
	},
	// 사업자번호 format
	formatBusinessNumber: (businessNumber) => {
		if (typeof (businessNumber * 1) !== 'number' || businessNumber.length !== 10) {
			return '사업자번호가 형식에 맞지 않습니다.(숫자 10자리)'
		} else {
			return businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
		}
	},
	// 이름 마스킹
	maskName: (name) => {
		// console.log('maskName. name : ' + name)
		if (typeof name !== 'string') {
			return ''
		}

		if (name.length === 1) {
			return name
		} else if (name.length === 2) {
			return name.substr(0, 1) + '*'
		} else {
			return name.substr(0, 1) + '*'.repeat(name.length - 2) + name.substr(name.length - 1, 1)
		}
	},
	// 전화번호/휴대폰번호 가운데자리 마스킹 (010-1111-2222 => 010-****-2222)
	// https://rios.tistory.com/entry/JS-Javascirpt-를-이용한-각종-정규식마스킹-방법
	maskPhone: (mobile) => {
		if (typeof mobile !== 'string') {
			return '문자열이 아닙니다. (' + mobile + ')'
		}

		if (mobile === '') {
			return ''
		}

		if (!mobile.match(/\d{2,3}-\d{3,4}-\d{4}/gi)) {
			return '전화번호/휴대폰 형식이 올바르지 않습니다. (' + mobile + ')'
		}

		let _mobile = ''
		// 00-000-0000 / 000-000-0000 형태
		if (/-[0-9]{3}-/.test(mobile)) {
			_mobile = mobile.replace(/-[0-9]{3}-/g, '-***-')
		}
		// 00-0000-0000 / 000-0000-0000 형태
		if (/-[0-9]{4}-/.test(mobile)) {
			_mobile = mobile.replace(/-[0-9]{4}-/g, '-****-')
		}

		// console.log('maskMobile(' + mobile + ') : ' + _mobile.replace(/(\d{3})(\d{4})(\d{4})/gi, '$1-****-$3'))
		return _mobile.replace(/(\d{3})(\d{3,4})(\d{4})/gi, '$1-****-$3')
	},
	// 전화번호/휴대폰번호에 숫자 외의 다른 문자가 들어가있으면 제거 (이렇게 하고 다시 -를 넣으려고)
	simplifyMobile: (mobile) => {
		return mobile.replace(/[^0-9.]/g, '')
	},
	// 입력 받으면서 전화번호 - 붙이기
	getPhoneMask: (phoneNumber) => {
		if (!phoneNumber) return phoneNumber
		phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
		let res = ''
		if (phoneNumber.length < 3) {
			res = phoneNumber
		} else {
			if (phoneNumber.substr(0, 2) === '02') {
				if (phoneNumber.length <= 5) {
					// 02-123-5678
					res = phoneNumber.substr(0, 2) + '-' + phoneNumber.substr(2, 3)
				} else if (phoneNumber.length > 5 && phoneNumber.length <= 9) {
					// 02-123-5678
					res = phoneNumber.substr(0, 2) + '-' + phoneNumber.substr(2, 3) + '-' + phoneNumber.substr(5)
				} else if (phoneNumber.length > 9) {
					// 02-1234-5678
					res = phoneNumber.substr(0, 2) + '-' + phoneNumber.substr(2, 4) + '-' + phoneNumber.substr(6)
				}
			} else {
				if (phoneNumber.length < 8) {
					res = phoneNumber
				} else if (phoneNumber.length === 8) {
					res = phoneNumber.substr(0, 4) + '-' + phoneNumber.substr(4)
				} else if (phoneNumber.length === 9) {
					res = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6)
				} else if (phoneNumber.length === 10) {
					res = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6)
				} else if (phoneNumber.length > 10) {
					// 010-1234-5678
					res = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 4) + '-' + phoneNumber.substr(7)
				}
			}
		}
		return res
	},
	// 전화번호 체크
	checkTell: (tell) => {
		// 서울
		const reSeoul = /(02)([0-9]{3,4})([0-9]{4})$/
		// 서울 제외한곳
		const reEtc = /(0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/
		let result = false
		if (reSeoul.test(tell) || reEtc.test(tell)) {
			result = true
		}
		return result
	},
	// 비밀번호 유효성 검사 (공백 포함여부, 한글 포함 여부, 영어 숫자 특문 중 2개이상 포함)
	checkPwd: (pwd) => {
		// 비밀번호 공백 체크
		if (pwd.search(/\s/) !== -1) {
			return 0
		}
		// 한글 포함 여부 체크
		if (pwd.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/) !== -1) {
			return 0
		}

		const num = pwd.search(/[0-9]/g)
		const eng = pwd.search(/[a-z]/gi)
		const spe = pwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)

		let result = 0

		if (num >= 0) {
			result++
		}
		if (eng >= 0) {
			result++
		}
		if (spe >= 0) {
			result++
		}

		return result
	},
	// 랜덤 문자열 생성
	makeRandom: (length = 10, upperCase = true, lowerCase = true, numberCase = true) => {
		let chars = ''

		// 대문자
		if (upperCase) {
			chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		}
		// 소문자
		if (lowerCase) {
			chars += 'abcdefghijklmnopqrstuvwxyz'
		}
		// 숫자
		if (numberCase) {
			chars += '0123456789'
		}

		// 생성 랜덤 문자열
		let randomString = ''

		for (let i = 0; i < length; i++) {
			randomString += chars.charAt(Math.floor(Math.random() * chars.length))
		}

		return randomString
	},
	// 동일문자 연속 3회 반복 체크
	checkSameThreeChar: (pwd) => {
		const re = /([\w`~!@@#$%^&*|₩₩₩'₩";:₩/?])\1{2,}/g

		return re.test(pwd)
	},
	// keep-alive에서 화면갱신용 key(랜덤 문자열) 생성
	generateKey: () => {
		const _key = Math.random().toString(36).slice(2)
		// console.log('generateKey : ' + _key)
		return _key
	},
	// crypto-js의 AES를 통한 암호화
	encrypt: (encodeTarget) => {
		return cryptoJs.AES.encrypt(encodeTarget, process.env.AES_ENCRYPT_SECRET).toString()
	},
	// crypto-js의 AES를 통한 복호화
	decrypt: (decodeTarget) => {
		return cryptoJs.AES.decrypt(decodeTarget, process.env.AES_ENCRYPT_SECRET).toString(cryptoJs.enc.Utf8)
	},
	// 임시 encryption (자동로그인 패스워드 저장등에 사용)
	// cf) https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
	cipher: (salt) => {
		const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0))
		const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2)
		const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code)

		return (text) => text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('')
	},
	// 임시 decryption
	decipher: (salt) => {
		const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0))
		// let saltChars = textToChars(salt)
		const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code)
		return (encoded) =>
			encoded
				.match(/.{1,2}/g)
				.map((hex) => parseInt(hex, 16))
				.map(applySaltToChar)
				.map((charCode) => String.fromCharCode(charCode))
				.join('')
	},
	// 성인인지 체크 T/F 성인이면 true 미성년자면 false. mlnmYn : 밀레니엄 여부
	checkAdult: (BRTH_DT = null, mlnmYn = '1') => {
		if (BRTH_DT !== null) {
			let old = 0
			if (mlnmYn === '1') {
				old = Number(date.formatDate(Date.now(), 'YYYY')) - Number('20' + BRTH_DT.substr(0, 2)) + 1
			} else {
				old = Number(date.formatDate(Date.now(), 'YYYY')) - Number('19' + BRTH_DT.substr(0, 2)) + 1
			}
			return old >= 20
		}
		return false
	},
	// 주민등록번호 유효성 체크
	checkSsn: (ssn) => {
		ssn = ssn.replace('-', '')
		const compare = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]
		let sum = 0

		for (var i = 0; i < 12; i++) {
			sum += ssn.substring(i, i + 1) * compare[i]
		}
		sum = (11 - (sum % 11)) % 10

		return sum === ssn.substring(12, 13) * 1
	},
}
