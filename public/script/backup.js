let net = new brain.NeuralNetwork()
let trainedNet
let longest
let tweets = []

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

var es = new EventSource('/stream')

es.addEventListener('connect', function(event) {
	const text = JSON.parse(event.data)

	if (text.tweet) {
		tweets.push({
			input: text.tweet,
			output: { fortnite: 1 }
		})
	}

	if (tweets.length === 2) {
		console.log(getTrainingData(tweets))
		train(tweets)
	}
	console.log(trainedNet(encode(adjustSize(text.tweet))))
	console.log(trainedNet(encode(adjustSize('the legend of zelda'))))
})
