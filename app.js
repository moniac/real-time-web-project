const Twitter = require('twitter')
const dotenv = require('dotenv').config()
const { client, tokens } = require('./utils/twitter')
const socketIO = require('socket.io')
const http = require('http')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

console.log(tokens)

app.get('/', (req, res) => {
	res.send('test')
})

app.listen(port, () => {
	console.log(`Server is running ${port}`)
})

client.stream(
	'statuses/filter',
	{ track: 'fortnite', tweet_mode: 'extended', language: 'en' },
	function(stream) {
		stream.on('data', function(tweet) {
			// console.log(tweet)

			if (tweet.extended_tweet) {
				const { full_text } = tweet.extended_tweet
				console.log(full_text.split('https://t.co')[0], 1)
				console.log('WOOOOOOOP')
			} else if (!tweet.extended_tweet) {
				console.log(tweet.text, 2)
			}
			// console.log(tweet)

			// stream.destroy()
		})

		stream.on('error', function(error) {
			console.log(error)
		})
	}
)
