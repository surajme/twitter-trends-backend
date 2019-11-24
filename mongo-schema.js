const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const dataSchema = new Schema({
	trends: Array,
	as_of: String,
	created_at: String,
	version: Number,
})

const data = (module.exports = mongoose.model('data', dataSchema))
