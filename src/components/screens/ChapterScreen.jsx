import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSelector } from 'react-redux'
import { objectToArray } from '../../utils/utils'
import TranslationOnOffSwitcher from '../TranslationShowSwitcher'
import ChapterHeader from '../ChapterHeader'
import OneLineOneFile from '../contentTypes/OneLineOneFile'
import InText from '../contentTypes/InText'
import Timing from '../contentTypes/Timing'
import Audio from '../contentTypes/Audio'
import NotSet from '../contentTypes/NotSet'
import content from '../../utils/content'

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
	const interactiveSubchapter = subchapterId => {
		const contentTypeDoc = content.getContentType(chapterId, subchapterId)
		const { interactivity } = contentTypeDoc || {}

		const key = `subchapter-${subchapterId}`

		const subchapterComponentProps = {
			key,
			contentTypeDoc,
			showTranslation,
			chapterId,
			subchapterId,
			globalStyles,
			trLang
		}

		// interactivity ==> component
		const contentTypeComponents = {
			oneLineOneFile: <OneLineOneFile {...subchapterComponentProps} />,
			inText: <InText {...subchapterComponentProps} />,
			timing: <Timing {...subchapterComponentProps} />,
			audio: <Audio {...subchapterComponentProps} />,
			default: <NotSet {...subchapterComponentProps} />
		}

		return (
			contentTypeComponents[interactivity] || contentTypeComponents['default']
		)
	}

	const InteractiveSubchapters = () =>
		subchapters.map(elem => {
			const { id: subchapterId } = elem
			return interactiveSubchapter(subchapterId)
		})

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
				<InteractiveSubchapters />
			</ScrollView>
			<TranslationOnOffSwitcher />
		</View>
	)
}
