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
import NotSet from '../contentTypes/NotSet'
import { getChapter, getTrChapter } from '../../utils/manageTextContent'

export default function LessonScreen({ navigation, route }) {
	const {
		params: { chapterId, globalStyles }
	} = route

	const { trLang, showTranslation } = useSelector(state => state.translation)
	const chapterDoc = getChapter(chapterId)
	const chapterTrDoc = getTrChapter(trLang, chapterId)
	const { title } = chapterDoc
	const { title: trTitle } = chapterTrDoc

	const subchapters = objectToArray(chapterDoc?.content)

	// set proper component by subchapter type
	const interactiveSubchapter = subchapterDoc => {
		const { id, title, type } = subchapterDoc
		const contentTypeDoc = getContentType(type ? type : title) // if type not set, it is the same as title
		const { interactivity } = contentTypeDoc
		const subchapterTrDoc = chapterTrDoc['content'][id]

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
