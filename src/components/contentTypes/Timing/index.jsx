import React, { useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import { useSelector } from 'react-redux'
import PhrasalPlayerControls from './PlayerControls'
import Slideshow from './Slideshow'
import PhrasesBlock from './PhrasesBlock'
import { parseSubs } from 'frazy-parser'
import phrasalPlayer from '../../../utils/playerPhrasal'
import { objectToArray } from '../../../utils/utils'

function Timing(props) {
	const {
		subchapterDoc,
		subchapterTrDoc = {},
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const { isPlaying, currentPhraseNum } =
		useSelector(state => state.playerState) || {}

	const { id: subchapterId, title, content } = subchapterDoc
	const { title: titleTr, content: contentTr = '' } = subchapterTrDoc

	const phrases = {
		'000': { start: 0, end: 0, body: [{}] },
		...parseSubs(content)
	}
	const phrasesTr = {
		'000': { start: 0, end: 0, body: [{}] },
		...parseSubs(contentTr)
	}
	const phrasesArray = objectToArray(phrases)
	const phrasesTrArray = objectToArray(phrasesTr)

	useEffect(() => {
		const audioId = `${chapterId}-${subchapterId}`
		phrasalPlayer.init(audioId, 'timing', phrasesArray)
	}, [])

	return (
		<View>
			<Text>
				{chapterId}-{subchapterId}. {title}
			</Text>
			<Text>{titleTr}</Text>
			<Slideshow
				{...{
					phrases,
					phrasesTr,
					globalStyles,
					currentPhraseNum,
					showTranslation
				}}
			/>
			<PhrasalPlayerControls {...{ phrasalPlayer, isPlaying }} />
			<PhrasesBlock
				{...{
					phrasesArray,
					phrasesTrArray,
					globalStyles,
					currentPhraseNum,
					phrasalPlayer,
					showTranslation
				}}
			/>
		</View>
	)
}

export default Timing
