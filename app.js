const Twitter = require('twitter')
const dotenv = require('dotenv').config()
const brain = require('brain.js')
const { client, tokens } = require('./utils/twitter')
const socketIO = require('socket.io')
const http = require('http')
const path = require('path')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const SSE = require('express-sse')
const sse = new SSE([])

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, './public')))

io.on('connection', socket => {
	socket.on('join', () => {
		console.log('working')
	})
	socket.on('disconnect', message => {
		console.log('woop', message)
	})
	socket.on('quit', message => {
		console.log(message)
	})
})

app.get('/', (req, res) => {
	sse.send({ wow: false }, 'connect')
	res.render('index')
})

app.get('/stream', (req, res) => {
	sse.init(req, res)
	sse.send({ hoi: true }, 'connect')
})

function makeStream(hashtag) {
	app.get(`/${hashtag}`, (req, res) => {
		sse.init(req, res)
		sse.send({ hoi: true }, `${hashtag}`)
		console.log(sse)
	})

	client.stream(
		'statuses/filter',
		{ track: `${hashtag}`, tweet_mode: 'extended', language: 'en' },
		function(stream) {
			// stream.destroy()
			stream.on('data', function(tweet) {
				if (tweet.extended_tweet) {
					const { full_text } = tweet.extended_tweet
					sse.send(
						{ tweet: full_text.split('https://t.co')[0] },
						`${hashtag}`
					)
				} else if (!tweet.text.includes('RT')) {
					sse.send(
						{ tweet: tweet.text.split('https://t.co')[0] },
						`${hashtag}`
					)
				}
			})

			stream.on('error', function(error) {
				console.log(error)
			})
		}
	)
}

app.get('/hashtag', (req, res) => {
	const { hashtag } = req.query
	makeStream(hashtag)

	res.render('./realtime/realtime')
})

server.listen(port, () => {
	console.log(`Server is running ${port}`)
})
