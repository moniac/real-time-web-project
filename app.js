const Twitter = require('twitter')
const dotenv = require('dotenv').config()

const tokens = {
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_key: process.env.access_token_key,
	access_token_secret: process.env.access_token_secret
}

const client = new Twitter(tokens)

client.stream('statuses/filter', { track: 'twitter' }, function(stream) {
	stream.on('data', function(tweet) {
		console.log(tweet.text)
	})

	stream.on('error', function(error) {
		console.log(error)
	})
})
