import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import OneLineOneFile from '../contentTypes/OneLineOneFile'
import InText from '../contentTypes/InText'
import Media from '../contentTypes/Media'
import NotSet from '../contentTypes/NotSet'
import { useSelector } from 'react-redux'
import content from '../../utils/content'
import { getContentType } from '../../utils/contentType'
import globalStyles from '../../config/globalStyles'
import ChapterHeader from '../ChapterHeader'

// interactivity ==> component
const getComponent = (interactivity, props) => {
	switch (interactivity) {
		case 'oneLineOneFile':
			return <OneLineOneFile {...props} />
		case 'inText':
			return <InText {...props} />
		case 'media':
			return <Media {...props} />
		default:
			return <NotSet {...props} />
	}
}

const SubChapterScreen = props => {
	const {
		route: {
			params: { chapterId, subchapterId }
		},
		navigation
	} = props

	const { trLang, showTranslation } = useSelector(state => state.translation)

	const subchapterDoc = content.getSubchapter(chapterId, subchapterId)
	const { title, type: typeRaw } = subchapterDoc
	const type = typeRaw ? typeRaw : title
	const contentTypeDoc = getContentType(type)
	const { interactivity } = contentTypeDoc || {}

	const subchapterTrDoc = content.getSubchapterTr(
		trLang,
		chapterId,
		subchapterId
	)

	const files = content.getFilesByPathArray([
		'content',
		chapterId,
		subchapterId
	])

	const subchapterComponentProps = {
		subchapterDoc,
		subchapterTrDoc,
		contentTypeDoc,
		showTranslation,
		chapterId,
		subchapterId,
		files,
		globalStyles,
		trLang,
		navigation
	}

	return (
		<ScrollView nestedScrollEnabled>
			<ChapterHeader {...{ navigation }} />
			{getComponent(interactivity, subchapterComponentProps)}
		</ScrollView>
	)
}

export default SubChapterScreen
