import React, { useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import { useSelector } from 'react-redux'
import PhrasalPlayerControls from './PlayerControls'
import Slideshow from './Slideshow'
import { parseSubs, checkSubsType } from 'frazy-parser'
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

	const phrases = parseSubs(content)
	const phrasesTr = parseSubs(contentTr)
	const phrasesArray = objectToArray(phrases)

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
			<Slideshow {...{ phrases, phrasesTr, globalStyles }} />
			<PhrasalPlayerControls
				phrasalPlayer={phrasalPlayer}
				isPlaying={isPlaying}
			/>
			{/* <Text>{JSON.stringify(phrasesArray[currentPhraseNum])}</Text>
			<Text>{JSON.stringify(subchapterDoc, null, '\t')}</Text>
			<Text>{JSON.stringify(phrases, null, '\t')}</Text> */}
		</View>
	)
}

export default Timing
