import React, { useRef, useEffect } from 'react'
import { TouchableOpacity, View, Text, ScrollView } from 'react-native'
import { Avatar, colors } from 'react-native-elements'
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
		const isActivePhrase = phraseNum === currentPhraseNum
		const phraseStyle = isActivePhrase
			? styles.phraseActive
			: styles.phraseDefault

		return (
			<TouchableOpacity
				onPress={handlePlayPhrase(phraseNum)}
				style={phraseStyle}
			>
				<View style={{ paddingLeft: 2, paddingRight: 7 }}>
					<Text style={globalStyles.body3}>{text}</Text>
					{showTranslation && (
						<Text style={[globalStyles.translation(trLang)]}>{trText}</Text>
					)}
					<Text style={{ color: 'grey', fontSize: 9 }}>{phraseNum}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	const Voice = ({ voiceName, voiceNameTr }) => {
		return (
			<View
				style={{
					// writingDirection: 'rtl',
					flexDirection: 'row-reverse',
					alignItems: 'center',
					marginTop: 4,
					marginBottom: 2
				}}
			>
				<Avatar
					rounded
					icon={{ name: 'perm-identity', color: 'grey', type: '' }}
					containerStyle={{
						backgroundColor: 'lightgrey',
						width: 20,
						height: 20,
						marginLeft: 5 // should be related to writing direction
					}}
					size='small'
				/>
				<Text style={{ color: 'gray' }}>
					{voiceName}
					{voiceNameTr && showTranslation ? ` (${voiceNameTr})` : ''}
				</Text>
			</View>
		)
	}

	return (
		<ScrollView ref={scrollViewRef} nestedScrollEnabled>
			<View style={{ marginBottom: 5 }}>
				{phrasesArray.map((elem, index) => {
					const { text, voiceName } = elem
					const { text: trText, voiceName: voiceNameTr } =
						phrasesTrArray[index] || {}
					const phraseNum = index

					return (
						index > 0 && (
							<View
								key={`phrase-${phraseNum}`}
								style={{ paddingLeft: 3, paddingRight: 3 }}
								onLayout={({
									nativeEvent: {
										layout: { /* x, */ y /* width, height */ }
									}
								}) => {
									phrasesPositionYRef.current[index] = y
								}}
							>
								{voiceName && (
									<Voice voiceName={voiceName} voiceNameTr={voiceNameTr} />
								)}
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

const border = color => ({
	borderColor: color,
	borderStyle: 'solid',
	borderRadius: 5,
	borderWidth: 1
})

const styles = {
	phraseActive: { ...border(colors.primary) },
	phraseDefault: { ...border('rgb(242,242,242)') }
}
