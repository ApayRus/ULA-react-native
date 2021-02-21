import React from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Text, Header } from 'react-native-elements'
import { useSelector } from 'react-redux'
import layoutStylesModule from '../config/styles/layout'
import content from '../utils/content'

function ChapterHeader(props) {
	const { navigation, chapterId, subchapterId } = props

	const { screenHeader: layoutStyles } = layoutStylesModule

	const { showTranslation } = useSelector(state => state.translation)

	const {
		chapterTitle,
		chapterTitleTr,
		subchapterTitle,
		subchapterTitleTr
	} = content.getChapterSubchapterTitlesWithTr(chapterId, subchapterId)

	console.log({
		chapterTitle,
		chapterTitleTr,
		subchapterTitle,
		subchapterTitleTr
	})

	return (
		<>
			<StatusBar style='auto' />
			<Header
				leftComponent={{
					icon: 'home',
					color: '#fff',
					onPress: () => navigation.navigate('Home')
				}}
				rightComponent={{
					icon: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
			/>
			<View style={layoutStyles.container}>
				<Text style={layoutStyles.chapterTitle}>{chapterTitle}</Text>
				{showTranslation && (
					<Text style={layoutStyles.chapterTitleTr}>{chapterTitleTr}</Text>
				)}
				<Text style={layoutStyles.subchapterTitle}>{subchapterTitle}</Text>
				{showTranslation && (
					<Text style={layoutStyles.subchapterTitleTr}>
						{subchapterTitleTr}
					</Text>
				)}
			</View>
		</>
	)
}

export default ChapterHeader
