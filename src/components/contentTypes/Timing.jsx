import React, { useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import PhrasalPlayerControls from '../PhrasalPlayerControls'
import { parseSubs, checkSubsType } from 'frazy-parser'
import PhrasalPlayer from '../../utils/playerPhrasal'
import { objectToArray } from '../../utils/utils'
import { setPlayerState } from '../../store/playerStateActions'

function Timing(props) {
	const {
		subchapterDoc,
		subchapterTrDoc = {},
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const phrasalPlayer = new PhrasalPlayer()

	phrasalPlayer.events.on('play', () => {
		console.log('play clicked!!!')
	})

	phrasalPlayer.events.on('pause', () => {
		console.log('pause clicked!!!')
	})

	phrasalPlayer.events.on('phrase-in', phrase => {
		console.log('phrase-in', phrase)

		const isPlaying = async () => {
			return await phrasalPlayer.getStatus()
		}

		console.log('phrasalPlayer.getStatus()', isPlaying())
	})

	const { id: subchapterId, title, content } = subchapterDoc

	const phrases = parseSubs(content)

	useEffect(() => {
		const audioId = `${chapterId}-${subchapterId}`
		phrasalPlayer.init(audioId, 'timing', objectToArray(phrases))
	}, [])

	return (
		<View>
			<Text>
				{title}, {chapterId}-{subchapterId}
			</Text>
			<PhrasalPlayerControls phrasalPlayer={phrasalPlayer} />
			<Text>{JSON.stringify(subchapterDoc, null, '\t')}</Text>
			<Text>{JSON.stringify(phrases, null, '\t')}</Text>
		</View>
	)
}

export default Timing
