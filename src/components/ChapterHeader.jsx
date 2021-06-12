import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Text, Header, Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import content from '../utils/content'
import styles from '../styles'

function ChapterHeader(props) {
	const { navigation, chapterId, subchapterId, hideTitles } = props

	const {
		layout: { screenHeader: layoutStyles }
	} = styles || {} // layout styles

	const { showTranslation, trLang } = useSelector(state => state.translation)

	const { chapterTitle, chapterTitleTr, subchapterTitle, subchapterTitleTr } =
		content.getChapterSubchapterTitlesWithTr(trLang, chapterId, subchapterId)

	const handleNavigateForward = () => {
		content.navigateToNextItem(chapterId, subchapterId, navigation)
	}

	const leftComponent = () => (
		<View style={{ flexDirection: 'row' }}>
			<Icon
				{...{
					name: 'home',
					color: '#fff',
					onPress: () => navigation.navigate('Home')
				}}
				Component={TouchableOpacity}
			/>
			<Icon
				{...{
					name: 'arrow-back',
					color: '#fff',
					onPress: () => navigation.goBack()
				}}
				iconStyle={{ marginLeft: 10 }}
				Component={TouchableOpacity}
			/>
		</View>
	)

	const rightComponent = () => (
		<View style={{ flexDirection: 'row' }}>
			<Icon
				{...{
					name: 'arrow-forward',
					color: '#fff',
					onPress: handleNavigateForward
				}}
				iconStyle={{ marginRight: 10 }}
				Component={TouchableOpacity}
			/>
			<Icon
				{...{
					name: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				Component={TouchableOpacity}
			/>
		</View>
	)

	return (
		<View>
			<StatusBar style='light' />
			<Header {...{ leftComponent, rightComponent }} />
			{!hideTitles && (
				<View style={layoutStyles.container}>
					<Text style={layoutStyles.chapterTitle}>{chapterTitle}</Text>
					{showTranslation && Boolean(chapterTitleTr) && (
						<Text style={layoutStyles.chapterTitleTr}>{chapterTitleTr}</Text>
					)}
					{Boolean(subchapterTitle) && (
						<Text style={layoutStyles.subchapterTitle}>{subchapterTitle}</Text>
					)}
					{showTranslation && Boolean(subchapterTitleTr) && (
						<Text style={layoutStyles.subchapterTitleTr}>
							{subchapterTitleTr}
						</Text>
					)}
				</View>
			)}
		</View>
	)
}

export default ChapterHeader
