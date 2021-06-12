import React from 'react'
import { useSelector } from 'react-redux'
import content from '../../../utils/content'
import MediaPlayer from '../../MediaPlayer'
// import { parseSecondsInterval } from './utils'

const RichMedia = props => {
	// if richMedia material has param like s12.34-56.789 (interval of seconds),
	// then it reference to another material by params: [title, interval, path]
	// and we should find it in hiddenContent section, or in other places

	// const { contentTypeDoc } = props
	// const { content, params } = contentTypeDoc

	// let sourceMaterialTitle = '',
	// 	sourceMaterialInterval = ''

	// // if  there isn't content, we interpret params in other way
	// if (!content) {
	// 	// eslint-disable-next-line no-extra-semi
	// 	;[sourceMaterialTitle, sourceMaterialInterval] = params || []
	// 	sourceMaterialInterval = parseSecondsInterval(sourceMaterialInterval)
	// }

	const { chapterId, subchapterId } = props
	let { contentTypeDoc = {}, contentTypeTrDoc = {} } = props
	const { trLang } = useSelector(state => state.translation)
	if (chapterId) {
		contentTypeDoc = content.getItem({ chapterId, subchapterId })
		contentTypeTrDoc = content.getItem({
			chapterId,
			subchapterId,
			lang: trLang
		})
	}

	return (
		<MediaPlayer
			{...{
				...props /* sourceMaterialTitle, sourceMaterialInterval  */,
				contentTypeDoc,
				contentTypeTrDoc
			}}
		/>
	)
}

export default RichMedia
