import lodash from 'lodash'
const { map, orderBy } = lodash
import axios from 'axios'
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
	return url.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)
}

/**
 *
 * @param {string} youtubeId
 * @returns {promise} - with direct link to mp4 file from youtube
 */
const getYoutubeVideoById = youtubeId => {
	return axios({
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		method: 'get',
		url: `https://direct-link.vercel.app/api/video/${youtubeId}`
	})
}

export const getYoutubeVideoByUrl = url => {
	const youtubeId = getYoutubeId(url)
	return getYoutubeVideoById(youtubeId)
}
