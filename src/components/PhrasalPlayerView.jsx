import React from 'react'
import { View, Text } from 'react-native'

export default function PhrasalPlayerView(props) {
	const {
		subchapterDoc,
		contentType,
		subchapterTrDoc = {},
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const { style: contentTypeStyle } = contentType

	return (
		<View style={contentTypeStyle.container}>
			<Text></Text>
		</View>
	)
}
