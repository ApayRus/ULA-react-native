import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSelector } from 'react-redux'
import { objectToArray } from '../../utils/utils'
import TranslationOnOffSwitcher from '../TranslationShowSwitcher'
import ChapterHeader from '../ChapterHeader'
import OneLineOneFile from '../contentTypes/OneLineOneFile'
import InText from '../contentTypes/InText'
import Media from '../contentTypes/Media'
import NotSet from '../contentTypes/NotSet'
import content from '../../utils/content'
import { getContentType } from '../../utils/contentType'

export default function LessonScreen({ navigation, route }) {
	const {
		params: { chapterId, globalStyles }
	} = route

	const { trLang, showTranslation } = useSelector(state => state.translation)
	const chapterDoc = content.getChapter(chapterId)
	const chapterTrDoc = content.getChapterTr(trLang, chapterId)
	const { title, content: chapterContent = {} } = chapterDoc
	const { title: trTitle } = chapterTrDoc

	const subchapters = objectToArray(chapterContent)

	// set proper component by subchapter type
	const interactiveSubchapter = (chapterId, subchapterId) => {
		const subchapterDoc = content.getSubchapter(chapterId, subchapterId)
		const { title, type: typeRaw } = subchapterDoc
		const type = typeRaw ? typeRaw : title
		const contentTypeDoc = getContentType(type)
		const { interactivity } = contentTypeDoc || {}

		const key = `subchapter-${subchapterId}`

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
			key,
			subchapterDoc,
			subchapterTrDoc,
			contentTypeDoc,
			showTranslation,
			chapterId,
			subchapterId,
			files,
			globalStyles,
			trLang
		}

		// interactivity ==> component
		const contentTypeComponents = {
			oneLineOneFile: <OneLineOneFile {...subchapterComponentProps} />,
			inText: <InText {...subchapterComponentProps} />,
			media: <Media {...subchapterComponentProps} />,
			default: <NotSet {...subchapterComponentProps} />
		}

		return (
			contentTypeComponents[interactivity] || contentTypeComponents['default']
		)
	}

	const chapterHeaderProps = {
		navigation,
		globalStyles,
		title,
		trTitle,
		showTranslation
	}

	return (
		<View style={{ flex: 1 }}>
			<ScrollView>
				<ChapterHeader {...chapterHeaderProps} />
				{subchapters.map(elem => {
					const { id: subchapterId } = elem
					return interactiveSubchapter(chapterId, subchapterId)
				})}
			</ScrollView>
			<TranslationOnOffSwitcher />
		</View>
	)
}
