import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { prefixedIndex } from '../../../utils/utils'

export default function PhrasalPlayerView(props) {
	const {
		phrases = {},
		phrasesTr = {},
		contentType,
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const { currentPhraseNum } = useSelector(state => state.playerState)
	const id = prefixedIndex(currentPhraseNum + 1)
	const phrasesCount = Object.keys(phrases).length
	const { text, voice: { name: voiceName } = {} } = phrases[id]?.body[0] || {}
	const { text: trText } = phrasesTr[id]?.body[0] || {}

	const { style: contentTypeStyle } = contentType || {}

	return (
		<View /* style={contentTypeStyle.container} */>
			<Text>{voiceName}</Text>
			<Text style={globalStyles.body1}>{text}</Text>
			<Text>{trText}</Text>
			<Text>
				{currentPhraseNum + 1}/{phrasesCount}
			</Text>
		</View>
	)
}
