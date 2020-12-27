import React, { useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import { useSelector } from 'react-redux'
import PhrasalPlayerControls from './PlayerControls'
import Slideshow from './Slideshow'
import PhrasesBlock from './PhrasesBlock'
import phrasalPlayer from '../../../utils/playerPhrasal'
import { objectToArray } from '../../../utils/utils'
import content from '../../../utils/content'

function Timing(props) {
	const {
		trLang,
		globalStyles,
		chapterId,
		subchapterId,
		showTranslation
	} = props

	const { isPlaying, currentPhraseNum } =
		useSelector(state => state.playerState) || {}

	const subchapterDoc = content.getSubchapter(chapterId, subchapterId)
	const subchapterTrDoc = content.getSubchapterTr(
		trLang,
		chapterId,
		subchapterId
	)

	const { title, content: phrases } = subchapterDoc
	const { title: titleTr, content: phrasesTr } = subchapterTrDoc

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
