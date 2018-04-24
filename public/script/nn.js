let net = new brain.NeuralNetwork()
let trainedNet
let longest
let tweets = []
let h = 0
let o = 0

function getAllUrlParams(url) {
	// get query string from url (optional) or window
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1)

	// we'll store the parameters here
	var obj = {}

	// if query string exists
	if (queryString) {
		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0]

		// split our query string into its component parts
		var arr = queryString.split('&')

		for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=')

			// in case params look like: list[]=thing1&list[]=thing2
			var paramNum = undefined
			var paramName = a[0].replace(/\[\d*\]/, function(v) {
				paramNum = v.slice(1, -1)
				return ''
			})

			// set parameter value (use 'true' if empty)
			var paramValue = typeof a[1] === 'undefined' ? true : a[1]

			// (optional) keep case consistent
			paramName = paramName.toLowerCase()
			paramValue = paramValue.toLowerCase()

			// if parameter name already exists
			if (obj[paramName]) {
				// convert value to array (if still string)
				if (typeof obj[paramName] === 'string') {
					obj[paramName] = [obj[paramName]]
				}
				// if no array index number specified...
				if (typeof paramNum === 'undefined') {
					// put the value on the end of the array
					obj[paramName].push(paramValue)
				}
				// if array index number specified...
				else {
					// put the value at that index number
					obj[paramName][paramNum] = paramValue
				}
			}
			// if param name doesn't exist yet, set it
			else {
				obj[paramName] = paramValue
			}
		}
	}

	return obj
}

var hashtag = getAllUrlParams(window.location.href).hashtag

function train(data) {
	net.train(processTrainingData(data), {
		iterations: 2000,
		log: true,
		learningRate: 0.1,
		timeout: 4000
	})
	trainedNet = net.toFunction()
}

function encode(arg) {
	return arg.split('').map(x => x.charCodeAt(0) / 400)
}

function processTrainingData(data) {
	const processedValues = data.map(d => {
		return {
			input: encode(d.input),
			output: d.output
		}
	})
	console.log(processedValues)
	return processedValues
}

function getTrainingData(data) {
	const trainingData = data
	longest = trainingData.reduce(
		(a, b) => (a.input.length > b.input.length ? a : b)
	).input.length
	for (let i = 0; i < trainingData.length; i++) {
		trainingData[i].input = adjustSize(trainingData[i].input)
	}
	return trainingData
}

function adjustSize(string) {
	while (string.length < longest) {
		string += ' '
	}
	return string
}

var es = new EventSource(`${hashtag}`)

es.addEventListener(`${hashtag}`, function(event) {
	const text = JSON.parse(event.data.toLowerCase())
	if (text.tweet === '' || !text.tweet) {
		return
	}
	if (text.tweet.includes(`${hashtag}`)) {
		const obj = {
			input: text.tweet,
			output: {
				[hashtag]: 1
			}
		}

		tweets.push(obj)
		h += 1
		console.log(h)
	} else {
		tweets.push({
			input: text.tweet,
			output: { other: 1 }
		})
		o += 1
		console.log(o)
	}

	if (o >= 1 && h >= 1) {
		if (trainedNet) {
			return
		}
		console.log(tweets)
		train(getTrainingData(tweets))
		console.log(trainedNet(encode(adjustSize('the legend of zelda'))))
	}
})
