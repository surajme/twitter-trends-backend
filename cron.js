const cron = require('node-cron')
const bin = require('./bin')

cron.schedule('10 * * * *', () => {
	console.log(`-------- fetching latest data from twitter ------`)
	bin.fetchDataAndWriteToDB()
})

module.exports = cron
