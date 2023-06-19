// change language
const changeLang = (lang) => {
	// alert(`Change language to ${lang}`)
	location.href = `/${lang}?uri=${window.location.pathname}`
}
