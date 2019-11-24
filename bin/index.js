const axios = require('axios')
const Data = require('../mongo-schema')

const fetchTrendsData = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { data } = await axios.get('/trends/place.json?id=3534')
			if (!data) return reject()
			resolve(data[0])
		} catch (error) {
			return reject(error)
		}
	})
}

const writeToDatabase = data => {
	return new Promise((resolve, reject) => {
		Data.findOneAndUpdate({}, data, { upsert: true }, function(err, doc) {
			if (err) return reject(error)
			return resolve(doc)
		})
	})
}

const fetchDataAndWriteToDB = () => {
	fetchTrendsData()
		.then(data => {
			writeToDatabase(data)
				.then(data => console.log(`data updated in db at ${require('moment')()}`))
				.catch(error => {
					console.log(error)
				})
		})
		.catch(error => console.log(`failed to fetch data ${error}`))
}

const getCurrentData = () => {
	return new Promise((resolve, reject) => {
		axios
			.get('/trends/place.json?id=3534')
			.then(response => resolve(response.data))
			.catch(err => reject())
	})
}

const getDataFromDB = () => {
	return new Promise((resolve, reject) => {
		Data.find()
			.then(doc => {
				if (!doc || !doc.length) return reject()
				return resolve(doc)
			})
			.catch(error => reject(error))
	})
}

module.exports = {
	fetchTrendsData,
	writeToDatabase,
	fetchDataAndWriteToDB,
	getCurrentData,
	getDataFromDB,
}
