const i18n = require('i18n')

// i18n options
i18n.configure({
	// languages
	locales: ['ko', 'en', 'in', 'th'],

	// set up language directory. default: ./locales
	directory: __dirname + '/locales',

	// deffault locale
	defaultLocale: 'en',

	// cookie name for the language being used
	cookie: 'lang',

	// watch for changes in JSON files to reload locale on updates - defaults to false
	autoReload: true,

	// enable object notation
	objectNotation: true,
})

module.exports = (req, res, next) => {
	i18n.init(req, res)
	res.locals.__ = res.__
	return next()
}
