import React from 'react'
import { View, Text } from 'react-native'
import { prefixedIndex } from '../../../utils/utils'

export default function PhrasalPlayerView(props) {
	const {
		phrases = {},
		phrasesTr = {},
		contentType,
		globalStyles,
		chapterId,
		showTranslation,
		currentPhraseNum
	} = props

	const id = prefixedIndex(currentPhraseNum)
	const phrasesCount = Object.keys(phrases).length
	const { text, voice: { name: voiceName } = {} } = phrases[id]?.body[0] || {}
	const { text: trText } = phrasesTr[id]?.body[0] || {}

	const { style: contentTypeStyle } = contentType || {}

	return (
		<View /* style={contentTypeStyle.container} */>
			<Text>{voiceName}</Text>
			<Text style={globalStyles.body1}>{text}</Text>
			<Text style={{ opacity: showTranslation ? 1 : 0 }}>{trText}</Text>
			<Text>
				{currentPhraseNum}/{phrasesCount}
			</Text>
		</View>
	)
}
