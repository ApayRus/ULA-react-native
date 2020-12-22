import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'

export default function PhrasesBlock(props) {
	const {
		phrasesArray,
		phrasesTrArray,
		phrasalPlayer,
		currentPhraseNum,
		globalStyles,
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

	const Voice = ({ voiceName }) => {
		return <Text>{voiceName}</Text>
	}

	return (
		<View>
			{phrasesArray.map((elem, index) => {
				const { text } = elem.body[0]
				const { voice: { name: voiceName = '' } = {} } = elem.body[0] || {}
				const { text: trText } = phrasesTrArray[index]['body'][0]
				const phraseNum = index

				return (
					index > 0 && (
						<View key={`phrase-${phraseNum}`}>
							<Voice voiceName={voiceName} />
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
