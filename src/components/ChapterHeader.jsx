import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Text, Header, Icon } from 'react-native-elements'
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
					onPress: () => navigation.goBack()
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
		<>
			<StatusBar style='auto' />
			<Header {...{ leftComponent, rightComponent }} />
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
