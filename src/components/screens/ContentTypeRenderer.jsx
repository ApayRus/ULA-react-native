import React, { useRef } from 'react'
import {
	View,
	ScrollView,
	TouchableOpacity,
	useWindowDimensions,
	Platform
} from 'react-native'
import { Text, colors } from 'react-native-elements'
import OneLineOneFile from '../contentTypes/OneLineOneFile'
import InText from '../contentTypes/InText'
import Media from '../contentTypes/Media'
import NotSet from '../contentTypes/NotSet'
import { useSelector } from 'react-redux'
import content from '../../utils/content'
import { getContentType } from '../../utils/contentType'
import globalStyles from '../../config/globalStyles'
import ChapterHeader from '../ChapterHeader'

/* 
	receives a chapterId/subchapterId, and renders proper content type: Cards, Media or Text 
*/

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

const ContentTypeRenderer = props => {
	const {
		route: {
			params: { chapterId, subchapterId }
		},
		navigation
	} = props

	const { height: screenHeight } = useWindowDimensions()

	const { trLang, showTranslation } = useSelector(state => state.translation)

	const pageScrollViewRef = useRef()
	const phrasalPlayerBlockYRef = useRef()

	const scrollPageTo = y => {
		phrasalPlayerBlockYRef.current = y
		// pageScrollViewRef.current.scrollTo({ y, animated: true })
		setTimeout(() => {
			handleScrollPhrasalPlayer()
		}, 1)
	}

	const handleScrollPhrasalPlayer = () => {
		const y = phrasalPlayerBlockYRef.current
		console.log('y', y)
		pageScrollViewRef.current.scrollTo({ y, animated: true })
	}

	// const { height: screenHeight } = useWindowDimensions()

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
		navigation,
		scrollPageTo
	}

	const containerStyle =
		Platform.OS === 'android' || Platform.OS === 'ios'
			? {}
			: { height: screenHeight }

	return (
		<View style={containerStyle}>
			<ScrollView ref={pageScrollViewRef} nestedScrollEnabled>
				<ChapterHeader {...{ navigation }} />
				{interactivity === 'media' && (
					<TouchableOpacity onPress={handleScrollPhrasalPlayer}>
						<Text
							style={{
								color: colors.primary,
								textAlign: 'right',
								marginRight: 5
							}}
						>
							Show phrasal buttons
						</Text>
					</TouchableOpacity>
				)}
				{getComponent(interactivity, subchapterComponentProps)}
			</ScrollView>
		</View>
	)
}

export default ContentTypeRenderer
