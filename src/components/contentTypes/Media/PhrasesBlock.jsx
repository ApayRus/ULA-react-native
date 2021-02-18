import React, { useRef, useEffect } from 'react'
import { TouchableOpacity, View, Text, ScrollView } from 'react-native'
import globalStyles from '../../../config/globalStyles'

export default function PhrasesBlock(props) {
	const {
		phrasesArray,
		phrasesTrArray,
		playerRef: { current: phrasalPlayer },
		currentPhraseNum,
		showTranslation,
		trLang
	} = props

	const handlePlayPhrase = phraseNum => () => {
		phrasalPlayer.playPhrase(phraseNum)
	}

	const scrollViewRef = useRef() // we will scroll it scrollTo({y})
	const phrasesPositionYRef = useRef([]) // array of  Y coordinates for scroll to them

	useEffect(() => {
		const y = phrasesPositionYRef.current[currentPhraseNum]
		scrollViewRef.current.scrollTo({
			y,
			animated: true
		})
		return () => {}
	}, [currentPhraseNum])

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
						? { borderStyle: 'solid', borderWidth: 1, borderColor: 'gray' }
						: { borderStyle: 'solid', borderWidth: 1, borderColor: 'white' }
				}
			>
				<View>
					<Text style={globalStyles.body3}>{text}</Text>
					<Text
						style={[
							{ opacity: showTranslation ? 1 : 0 },
							globalStyles.translation(trLang)
						]}
					>
						{trText}
					</Text>
					<Text style={{ color: 'grey', fontSize: 9 }}>{phraseNum}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	const Voice = ({ voiceName, voiceNameTr }) => {
		return (
			<Text style={{ color: 'gray' }}>
				{voiceName}
				{voiceNameTr ? ` (${voiceNameTr})` : ''}
			</Text>
		)
	}

	return (
		<ScrollView ref={scrollViewRef} nestedScrollEnabled>
			<View>
				{phrasesArray.map((elem, index) => {
					const { text, voiceName } = elem
					const { text: trText, voiceName: voiceNameTr } =
						phrasesTrArray[index] || {}
					const phraseNum = index

					return (
						index > 0 && (
							<View
								key={`phrase-${phraseNum}`}
								style={{ paddingLeft: 10, paddingRight: 10 }}
								onLayout={({
									nativeEvent: {
										layout: { /* x, */ y /* width, height */ }
									}
								}) => {
									phrasesPositionYRef.current[index] = y
								}}
							>
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
		</ScrollView>
	)
}
