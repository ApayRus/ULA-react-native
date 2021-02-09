import React, { useEffect, useRef, useState, useMemo } from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import PhrasalPlayerControls from './PlayerControls'
import PhrasesBlock from './PhrasesBlock'
import { objectToArray } from '../../../utils/utils'
import MediaBasic from '../Media/MediaBasic'

function SuperMedia(props) {
	const {
		subchapterDoc,
		subchapterTrDoc,
		globalStyles,
		chapterId,
		subchapterId,
		showTranslation
	} = props

	const phrasalPlayerRef = useRef()

	const setPhrasalPlayerRef = ref => {
		phrasalPlayerRef.current = ref
	}

	const [phrasalPlayerState, setPhrasalPlayerState] = useState({
		isPlaying: false,
		currentPhraseNum: 0
	})

	const {
		title,
		param, // path/to/media
		content: { phrases = {} }
	} = subchapterDoc

	const mediaPath = param || `audios/timing/009-001`

	const { title: titleTr, content: { phrases: phrasesTr = {} } = {} } =
		subchapterTrDoc || {}

	const phrasesArray = objectToArray(phrases)
	const phrasesTrArray = objectToArray(phrasesTr)

	const { currentPhraseNum, isPlaying } = phrasalPlayerState
	const phrasalPlayer = phrasalPlayerRef.current

	const phrasalPlayerMemo = useMemo(
		() => (
			<View>
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
		),
		[isPlaying, currentPhraseNum, phrasesTrArray]
	)

	return (
		<View>
			<Text>
				{chapterId}-{subchapterId}. {title}
			</Text>
			<Text>{titleTr}</Text>
			<MediaBasic
				data={{ path: mediaPath }}
				phrases={phrasesArray}
				setPhrasalPlayerState={setPhrasalPlayerState}
				setPhrasalPlayerRef={setPhrasalPlayerRef}
			/>
			{phrasalPlayerMemo}
		</View>
	)
}

export default SuperMedia
