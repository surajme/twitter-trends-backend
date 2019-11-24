const express = require('express'),
	Router = express.Router(),
	bin = require('../bin')

Router.get('/get', async (req, res) => {
	let data = {},
		status = 500

	const { pageSize, pageNumber } = req.query

	try {
		data = await bin.getDataFromDB()
		status = 200
	} catch (error) {
		data = await bin.getCurrentData()
		status = 200
	}

	if (!!pageSize && !!pageNumber) {
		const startingindex = pageNumber - 1 ? pageSize * (pageNumber - 1) : 0
		const total = new Number(data[0].trends.length)
		data = data.map(entry => ({
			trends: entry.trends.length > pageSize ? entry.trends.splice(startingindex, pageSize) : entry.trends,
			as_of: entry.as_of,
			created_at: entry.created_at,
			total: total,
			count: entry.trends.splice(startingindex, pageSize).length,
		}))
	} else {
		data = data.map(entry => ({
			trends: entry.trends,
			as_of: entry.as_of,
			created_at: entry.created_at,
			total: entry.trends.length,
			count: entry.trends.length,
		}))
	}

	return res.status(status).json(data)
})

Router.get('/get/:number', async (req, res) => {
	const number = req.params.number

	let data = {},
		status = 500
	try {
		data = await bin.getDataFromDB()
		status = 200
	} catch (error) {
		data = await bin.getCurrentData()
		status = 200
	}

	data = data.map(entry => ({
		total: entry.trends.length,
		trends: entry.trends.length > number ? entry.trends.splice(0, number) : entry.trends,
		as_of: entry.as_of,
		created_at: entry.created_at,
		count: number,
	}))

	res.status(status).json(data)
})

Router.get('/get/current', (req, res) => {
	bin.getCurrentData()
		.then(data => res.status(200).json(data))
		.catch(error => res.status(500).json({ error: 1, message: 'Error occured', desc: error }))
})

module.exports = Router
