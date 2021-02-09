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
	const { text, voiceName = '' } = phrases[id] || {}
	const { text: trText, voiceName: voiceNameTr = '' } = phrasesTr[id] || {}

	const { style: contentTypeStyle } = contentType || {}
	return (
		<View /* style={contentTypeStyle.container} */>
			<Text>
				{voiceName}
				{voiceNameTr ? ` (${voiceNameTr})` : ''}
			</Text>

			<Text style={globalStyles.body1}>{text}</Text>
			<Text style={{ opacity: showTranslation ? 1 : 0 }}>{trText}</Text>
			<Text>
				{currentPhraseNum}/{phrasesCount}
			</Text>
		</View>
	)
}
