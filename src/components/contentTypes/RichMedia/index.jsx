import React from 'react'
import { useSelector } from 'react-redux'
import content from '../../../utils/content'
import MediaPlayer from '../../MediaPlayer'
import { parseSecondsInterval } from './utils'

const RichMedia = props => {
	// if richMedia material has param like s12.34-56.789 (interval of seconds),
	// then it reference to another material by params: [title, interval, path]
	// and we should find it in hiddenContent section, or in other places
	const { chapterId, subchapterId, pathToMedia } = props
	const { trLang } = useSelector(state => state.translation)

	let { contentTypeDoc = {}, contentTypeTrDoc = {} } = props
	const { content: materialContent, params } = contentTypeDoc
	let playerProps = { ...props }
	if (!materialContent && !pathToMedia) {
		// it is reference to other material
		// so we redirect to it and calculate params in other way
		const [sourceMaterialPath = '', sourceMaterialInterval] = params || []
		const secondsInterval = parseSecondsInterval(sourceMaterialInterval)
		const [source, chapterId] = sourceMaterialPath.split('/')
		contentTypeDoc = content.getItem({ source, chapterId })
		contentTypeTrDoc = content.getItem({
			source: 'hiddenContent',
			chapterId,
			lang: trLang
		})

		playerProps = {
			...playerProps,
			contentTypeDoc,
			contentTypeTrDoc,
			secondsInterval
		}
	}

	if (chapterId) {
		contentTypeDoc = content.getItem({ chapterId, subchapterId })
		contentTypeTrDoc = content.getItem({
			chapterId,
			subchapterId,
			lang: trLang
		})
	}

	return <MediaPlayer {...playerProps} />
}

export default RichMedia
