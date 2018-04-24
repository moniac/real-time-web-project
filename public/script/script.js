const socket = io()
const input = document.querySelector('body form input')
let result

if (input) {
	input.addEventListener('keyup', function(e) {
		console.log(e.target.value)
	})
}

socket.on('connect', () => {
	socket.emit('join')
})

socket.on('disconnect', () => {
	console.log('disconnected')
	socket.emit('quit', 'test', () => {})
})

socket.on('message', message => {
	console.log(message)
})

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

var stream = new EventSource(`/${hashtag}`)

stream.addEventListener(`${hashtag}`, function(event) {
	const text = JSON.parse(event.data)
	// console.log(text)
	const li = document.createElement('li')

	li.className = 'tweet-card'
	li.textContent = text.tweet

	if (trainedNet) {
		// console.log('het komt hier wel')
		result = trainedNet(encode(adjustSize(text.tweet)))
		// console.log(result[`${hashtag}`])
		li.style.backgroundColor = `hsl(${Math.floor(
			result[`${hashtag}`] * 100
		)},100%,30%)`
	}

	const container = document.querySelector('main section ul')

	if (!text.tweet) {
		// console.log('empty')
		return
	}

	if (container.childElementCount > 10) {
		// console.log(container.childNodes[10])
		container.childNodes[10].remove()
	}

	container.prepend(li)
	return
})
