import content from '../../utils/content'
import { fetchYoutubeVideoByUrl, isYoutube } from '../../utils/utils'
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

export const loadDataToPlayer = async (
	path,
	/* mutable objects */
	player,
	mediaRef,
	mediaSource,
	phrasesArray
) => {
	const { source, posterSource, isVideo } =
		(await getSourceAndExtensionFromPath(path)) || {}

	if (!isVideo) {
		mediaRef.current = new Audio.Sound()
	}

	if (source) {
		await mediaRef.current.loadAsync(source)
	}

	player.current = phrasesArray.length
		? new PlayerPhrasal(mediaRef, phrasesArray)
		: new PlayerBasic(mediaRef, phrasesArray)
	mediaSource.current = { source, posterSource }
	return { isVideo }
}
