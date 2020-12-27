import React from 'react'
import { View, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Text } from 'react-native-elements'
import HTML from 'react-native-render-html'
import { playAudio } from '../../utils/playerShortAudios'
import content from '../../utils/content'

function InText(props) {
	const {
		globalStyles,
		chapterId,
		subchapterId,
		showTranslation,
		contentTypeDoc,
		trLang
	} = props

	const subchapterDoc = content.getSubchapter(chapterId, subchapterId)

	const { title, content: html } = subchapterDoc

	const contentWidth = useWindowDimensions().width

	const handlePress = (text, path) => () => {
		const fileName = path || text
		playAudio(fileName, 'intext')
	}

	const inTextRenderer = htmlAttribs => {
		const { text, path } = htmlAttribs
		return (
			<TouchableOpacity
				onPress={handlePress(text, path)}
				key={`intext-${text}`}
			>
				<Text style={[globalStyles.body2, { color: 'darkblue' }]}>{text}</Text>
			</TouchableOpacity>
		)
	}

	return (
		<View style={{ padding: 5 }}>
			<Text h2 h2Style={globalStyles.subchapter}>
				{title}
			</Text>
			<HTML
				renderers={{ intext: { renderer: inTextRenderer, wrapper: 'Text' } }}
				html={html}
				contentWidth={contentWidth}
			/>
		</View>
	)
}

export default InText
