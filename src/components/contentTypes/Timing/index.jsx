import React, { useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import { useSelector } from 'react-redux'
import PhrasalPlayerControls from './PlayerControls'
import Slideshow from './Slideshow'
import PhrasesBlock from './PhrasesBlock'
import { parseSubs as frazyParseSubs } from 'frazy-parser'
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

	const parseSubs = subsText => {
		// frazyParseSubs extracts text of phrase into tricky object {start, end, body:[{voice}]} for support multiple voices
		// we don't need many voices (it's hard to handle this nested array of objects)
		// then we extract it into plain object {start, end, text, voiceName}

		const parsedSubs = frazyParseSubs(subsText)
		if (!parsedSubs) return {}
		const phrasesObject = {}

		for (let key in parsedSubs) {
			const { start, end, body = [] } = parsedSubs[key] || {}
			const [bodyFirstObject] = body
			const { voice: { name: voiceName } = {}, text = '' } =
				bodyFirstObject || {}
			phrasesObject[key] = { start, end, text, voiceName }
		}

		const emptyPhrase = { start: 0, end: 0, text: '' } // for add empty space before 1-st phrase
		phrasesObject['000'] = emptyPhrase // empty phrase

		return phrasesObject
	}

	const phrases = parseSubs(content)
	const phrasesTr = parseSubs(contentTr)

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
