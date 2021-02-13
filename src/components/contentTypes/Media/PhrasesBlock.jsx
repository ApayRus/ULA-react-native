import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import globalStyles from '../../../config/globalStyles'

export default function PhrasesBlock(props) {
	const {
		phrasesArray,
		phrasesTrArray,
		playerRef: { current: phrasalPlayer },
		currentPhraseNum,
		showTranslation
	} = props

	const handlePlayPhrase = phraseNum => () => {
		phrasalPlayer.playPhrase(phraseNum)
	}

	const Phrase = ({
		text,
		trText,
		currentPhraseNum,
		phraseNum,
		showTranslation
	}) => {
		return (
			<TouchableOpacity
				onPress={handlePlayPhrase(phraseNum)}
				style={
					phraseNum === currentPhraseNum
						? { borderStyle: 'solid', borderWidth: 1, borderColor: 'blue' }
						: { borderStyle: 'solid', borderWidth: 1, borderColor: 'gray' }
				}
			>
				<Text style={globalStyles.body3}>{text}</Text>
				<Text style={{ opacity: showTranslation ? 1 : 0 }}>{trText}</Text>
				<Text>{phraseNum}</Text>
			</TouchableOpacity>
		)
	}

	const Voice = ({ voiceName, voiceNameTr }) => {
		return (
			<Text>
				{voiceName}
				{voiceNameTr ? ` (${voiceNameTr})` : ''}
			</Text>
		)
	}

	return (
		<View>
			{phrasesArray.map((elem, index) => {
				const { text, voiceName } = elem
				const { text: trText, voiceName: voiceNameTr } =
					phrasesTrArray[index] || {}
				const phraseNum = index

				return (
					index > 0 && (
						<View key={`phrase-${phraseNum}`}>
							<Voice voiceName={voiceName} voiceNameTr={voiceNameTr} />
							<Phrase
								{...{
									text,
									trText,
									currentPhraseNum,
									phraseNum,
									showTranslation
								}}
							/>
						</View>
					)
				)
			})}
		</View>
	)
}
