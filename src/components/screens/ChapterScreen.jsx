import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSelector } from 'react-redux'

import { objectToArray } from '../../utils/utils'
import TranslationOnOffSwitcher from '../TranslationShowSwitcher'
import ChapterHeader from '../ChapterHeader'
import { getContentType } from '../../utils/getContentType'
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
	const { title: trTitle, content: chapterContentTr = {} } = chapterTrDoc

	const subchapters = objectToArray(chapterContent)

	// set proper component by subchapter type
	const interactiveSubchapter = subchapterDoc => {
		const { id, title, type } = subchapterDoc
		const contentTypeDoc = getContentType(type ? type : title) // if type not set, it is the same as title
		const { interactivity } = contentTypeDoc || {}
		const subchapterTrDoc = chapterContentTr[id] || {}

		const key = `subchapter-${id}`

		const subchapterComponentProps = {
			key,
			subchapterDoc,
			contentTypeDoc,
			subchapterTrDoc,
			showTranslation,
			chapterId,
			globalStyles
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
		subchapters.map(elem => interactiveSubchapter(elem))

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
