# Real Time Web Project

## Buzzword alert, using ML

![Robot AI](https://media.giphy.com/media/CVtNe84hhYF9u/giphy.gif)

[This project is available here](https://real-time-web-project-rolwcddjdk.now.sh/hashtag?hashtag=trump)

## Table of Contents

*   [Introduction](#introduction)
*   [Getting Started](#getting-started)
*   [Flowchart](#flowchart)
*   [Data](#data)
*   [Checklist](#checklist)
*   [Kudos](#kudos)
*   [Licensing](#licensing)

---

## Introduction

This project is a tool that can stream tweets filtered on a hashtag in real-time, while analyzing the tweets and comparing new tweets to the old tweets.

In short, it looks at new tweets and can analyse if the tweets are spam or not.

## Flowchart

![Chart describing the flow](chart.jpg)

![Robot & Human high five](https://media.giphy.com/media/14cHY86AYr24o0/giphy.gif)

---

## Data

Hashtags get sent through a form, where Node.js will get the value from the url.

```javascript
app.get('/hashtag', (req, res) => {
	const { hashtag } = req.query
	makeStream(hashtag)

	res.render('./realtime/realtime')
})
```

With this function, a path will be made where Node.js will send Server Sent Events to.

```javascript
function makeStream(hashtag) {
	app.get(`/${hashtag}`, (req, res) => {
		sse.init(req, res)
		console.log(sse)
	})
```

On the client side, the data will be subscribed to so the data can get passed to the client.

This ensures that people will only see the content that is meant for them.

```javascript
const stream = new EventSource(`${hashtag}`)
```

The data will get parsed and then sent to Brain.js, where the data will get analyzed and the result will output the color.

```javascript
stream.addEventListener(`${hashtag}`, function(event) {
	const text = JSON.parse(event.data)

	const li = document.createElement('li')

	li.className = 'tweet-card'
	li.textContent = text.tweet

	if (trainedNet) {
		result = trainedNet(encode(adjustSize(text.tweet)))

		li.style.backgroundColor = `hsl(${Math.floor(
			result[`${hashtag}`] * 100
		)},100%,30%)`
	}

	const container = document.querySelector('main section ul')

	if (!text.tweet) {
		return
	}

	if (container.childElementCount > 10) {
		container.childNodes[10].remove()
	}

	container.prepend(li)
	return
})
```

---

## Getting started

To install this project, please do the usual git cloning and then;

```sh
yarn install
```

To run the app:

```sh
yarn run start
```

To start developing the app:

```sh
yarn run dev
```

The data comes straight from the Twitter api. The tweets are being sent to the client using Server Sent Events.

This project does not use a database, the server is only used to manipulate and send data to the clients. In a future installment the analysing done by the clients can be sent back to the server as a JSON, so that the data can be trained heavily.

## Checklist

*   [x] Have this actually work
*   [x] Add gifs to the readme
*   [ ] Add styling (I'm sorry)
*   [ ] Move intense functions to separate threads using web workers (need help on this one)
*   [ ] Have a decent way to stop Twitter streams
*   [ ] Decent way to stop SSE streams
*   [x] Add another marked checkbox to feel better about myself
*   [ ] Save brain.js state

## Kudos

Special thanks to the people that helped me out:

[Brain.js issue](https://github.com/BrainJS/brain.js/issues/188)

[Servin](https://www.github.com/servinlp)

## Licensing

This project uses the MIT license.
