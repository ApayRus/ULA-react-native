import content from '../../utils/content'
import PlayerBasic from './playerBasicClass'
import PlayerPhrasal from './playerPhrasalClass'
import { Audio } from 'expo-av'

const getSourceAndExtensionFromPath = async path => {
	// === is file local and we need require,
	// or it is external and we need uri ?
	// for now we check it by .ext - local files don't have it ===
	const extractFileFromPath = async uri => {
		// 1) it is youtube link
		if (isYoutube(uri)) {
			const youtubeResponse = await fetchYoutubeVideoByUrl(uri) // from direct-link.vercel.app
			const { urlVideo: uriDirect, thumbnails = [] } = youtubeResponse || {}
			const { url: uriPoster } = thumbnails[thumbnails.length - 1] || {}
			const extension = '.mp4' // just guess for small youtube videos
			return { uri: uriDirect, extension, uriPoster }
		}

		const [extension] = uri.match(new RegExp(/(\.mp3)|(\.mp4)$/)) || []
		// 2) it is external file, direct link, we get it as uri param
		if (extension) {
			return { uri, extension }
		} else {
			// 3) it's local file and we get it from assets
			const { file, extension } = content.getFilesByPathString(uri) || {} // file = require(../content/...)
			return { file, extension }
		}
	}
	const { file, uri, extension, uriPoster } =
		(await extractFileFromPath(path)) || {} // file or uri
	const getSource = () => {
		if (file) return file
		if (uri) return { uri }
		else return null
	}
	const source = getSource()

	const videoExtensions = ['.mp4'] // for now just one
	const isVideo = videoExtensions.includes(extension)
	return { source, extension, posterSource: { uri: uriPoster }, isVideo }
}

export const loadDataToPlayer = async ({
	path,
	/* mutable objects */
	player,
	mediaRef,
	mediaSource,
	phrases,
	secondsInterval
}) => {
	const { source, posterSource, isVideo } =
		(await getSourceAndExtensionFromPath(path)) || {}

	if (!isVideo) {
		mediaRef.current = new Audio.Sound()
	}

	if (source) {
		await mediaRef.current.loadAsync(source)
	}

	player.current = phrases.length
		? new PlayerPhrasal({ mediaRef, secondsInterval, phrases })
		: new PlayerBasic({ mediaRef, secondsInterval })
	mediaSource.current = { source, posterSource }
	return { isVideo }
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
const isYoutube = (url = '') => {
	return Boolean(
		url.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)
	)
}

const fetchYoutubeVideoByUrl = async url => {
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
