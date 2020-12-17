import React, { useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import { useSelector } from 'react-redux'
import PhrasalPlayerControls from '../PhrasalPlayerControls'
import { parseSubs, checkSubsType } from 'frazy-parser'
import phrasalPlayer from '../../utils/playerPhrasal'
import { objectToArray } from '../../utils/utils'

function Timing(props) {
	const {
		subchapterDoc,
		subchapterTrDoc = {},
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const { isPlaying } = useSelector(state => state.playerState) || {}

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
			<PhrasalPlayerControls
				phrasalPlayer={phrasalPlayer}
				isPlaying={isPlaying}
			/>
			<Text>{JSON.stringify(subchapterDoc, null, '\t')}</Text>
			<Text>{JSON.stringify(phrases, null, '\t')}</Text>
		</View>
	)
}

export default Timing
