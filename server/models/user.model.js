const mongoose = require('mongoose')

const User = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
	},
	{ collection: 'user-data-kittens' }
)

const model = mongoose.model('userData', User)

module.exports = model