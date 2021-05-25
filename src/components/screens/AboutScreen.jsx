import React from 'react'
import { ScrollView, Linking } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, colors, Header } from 'react-native-elements'
import MarkdownRenderer from '../MarkdownRenderer'

function AboutScreen({ navigation }) {
	const markdownText = `### **ULA**
Это приложение сделано на шаблоне ULA (_Universal Learning App_). 

Вы можете создать подобное приложение из своих

- текстов
- картинок
- аудио
- видео

разместив их по несложным правилам. 

Чтобы узнать больше, посетите: 
`

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
			<ScrollView style={{ padding: 20 }}>
				<MarkdownRenderer {...{ markdownText, contentType: 'richText' }} />
				<Button
					type='clear'
					onPress={() => Linking.openURL(`https://github.com/aparus/ula`)}
					icon={{
						name: 'language',
						size: 20,
						color: colors.primary
					}}
					buttonStyle={{ marginTop: 5 }}
					title='ULA - github page'
				/>
			</ScrollView>
		</>
	)
}

export default AboutScreen
