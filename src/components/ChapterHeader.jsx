import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { Text, Header, colors } from 'react-native-elements'

function ChapterHeader(props) {
	const { navigation, globalStyles, showTranslation, title, trTitle } = props

	return (
		<>
			<StatusBar style='auto' />
			<Header
				rightComponent={{
					icon: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				leftComponent={{
					icon: 'home',
					color: '#fff',
					onPress: () => navigation.navigate('Home')
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
