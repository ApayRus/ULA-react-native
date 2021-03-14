import lodash from 'lodash'
const { map, orderBy } = lodash
/**
 * 
 * @param {Object} object 
 * @example 
 objectToArray( { 01:{ text:'bla1' }, 02:{ text:'bla2' }} ) 
 // [{ id:'01', text:'bla1' }, { id:'02', text:'bla2' }]
 */
export const objectToArray = object => {
	const array = map(object, (elem, key) => ({ id: key, ...elem }))
	return orderBy(array, 'id')
}

export const arrayToObject = array => {
	const isNotObject = typeof array !== 'object' // and not array
	if (isNotObject) return null

	const isNotArray = !Array.isArray(array)
	if (isNotArray) return array

	return array.reduce((prev, item, index) => {
		const id = prefixedIndex(index + 1)
		return { ...prev, [id]: item }
	}, {})
}

/**
 *
 * @param {number} index
 * @returns {string}
 * @example
 * prefixedIndex(1) // '001'
 * prefixedIndex(45) // '045'
 * prefixedIndex(123) // '123'
 */
export const prefixedIndex = index => {
	return index.toString().padStart(3, '0')
}

export const getNextPrefixedIndex = stringIndex => {
	const nextNumberIndex = Number(stringIndex) + 1
	return prefixedIndex(nextNumberIndex)
}

/**
 *
 * @param {string} inputSeconds
 * @example
 * formatSecondsToTime(225) // "3:45"
 */
export const formatSecondsToTime = inputSeconds => {
	let totalSeconds = +inputSeconds.toFixed(0)
	const hours = Math.floor(totalSeconds / 3600)
	const hoursString = hours ? hours + ':' : ''
	totalSeconds %= 3600
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	const secondsString = seconds.toString().padStart(2, '0')
	return `${hoursString}${minutes}:${secondsString}`
}

/**
 * extracts videoId from youtube url
 * @param {string} url
 */
const getYoutubeId = url => {
	var id = ''
	url = url
		.replace(/(>|<)/gi, '')
		.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
	if (url[2] !== undefined) {
		id = url[2].split(/[^0-9a-z_\-]/i)
		id = id[0]
	} else {
		id = url
	}
	return id
}

/**
 * Checks is url from youtube or not
 * @param {string} url
 */
export const isYoutube = url => {
	return Boolean(
		url.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)
	)
}

export const fetchYoutubeVideoByUrl = async url => {
	const youtubeId = getYoutubeId(url)
	let response = null
	try {
		response = await fetch(
			`https://direct-link.vercel.app/api/video/${youtubeId}`,
			//http://192.168.0.189:3000
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		)
		response = await response.json()
	} catch (err) {
		console.log('TRY/CATCH ERROR', err)
	}
	return response
}

export const splitMarkdownIntoPartsByTemplate = (text, template) => {
	const matches = text.matchAll(template)
	if (!text.match(template)) return [{ content: text }]
	return [...matches].map((elem, index, array) => {
		const nextElem = array[index + 1] || {}
		const nextIndex = nextElem.index || text.length
		const [headerText, title = '', , typeString = ''] = elem
		const [type, param] = typeString.split('|').map(elem => elem.trim())
		const { index: curIndex, input } = elem
		return {
			title,
			type,
			param,
			content: input.slice(curIndex, nextIndex).replace(headerText, '').trim()
		}
	})
}
