require('dotenv').config()
require('./cron')
const express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	PORT = process.env.PORT || 3001,
	axios = require('axios'),
	moment = require('moment')

axios.defaults.headers.common['User-Agent'] = 'twitter-places-service'
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.ACCESS_TOKEN}`
axios.defaults.baseURL = 'https://api.twitter.com/1.1'

mongoose
	.connect(process.env.MongoDBURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Connected to DB'))
	.catch(err => console.log(`Error connecting to DB ${err}`))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
	const { method, originalUrl, protocol } = req
	console.log(`Request [${method}] - [${originalUrl}] - [${protocol}] - [${moment().format()}]`)
	next()
})

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	next()
})

app.use('/api', require('./api'))

app.listen(PORT, err => {
	if (!!err) return console.log(`Error starting server :: ${err}`)
	console.log(`Server running on PORT ${PORT}`)
})
