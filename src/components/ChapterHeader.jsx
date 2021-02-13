import React from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Text, Header, colors } from 'react-native-elements'
import globalStyles from '../config/globalStyles'

function ChapterHeader(props) {
	const { navigation, showTranslation, title, trTitle } = props

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
			<View style={globalStyles?.chapterHeader}>
				<Text style={[globalStyles?.body1, { color: colors.primary }]}>
					{title}
				</Text>

				<Text
					style={[
						globalStyles?.translation,
						{ opacity: showTranslation ? 1 : 0 }
					]}
				>
					{trTitle}
				</Text>
			</View>
		</>
	)
}

export default ChapterHeader
