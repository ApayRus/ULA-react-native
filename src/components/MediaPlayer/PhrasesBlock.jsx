import React, { useRef, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import PhraseWrapper from './PhraseWrapper'
import styles from '../../utils/styles'

export default function PhrasesBlock(props) {
	const {
		phrasesArray,
		phrasesTrArray,
		playerRef: { current: phrasalPlayer },
		currentPhraseNum,
		showTranslation
	} = props

	// const { contentType:{richMedia: { phraseList: contentTypeStyle = {} } = {}} = {}} = styles || {} // contentType styles
	const contentTypeStyle = styles?.contentType?.richMedia?.phraseList || {}

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

	const handlePlayPhrase = phraseNum => () => {
		phrasalPlayer.playPhrase(phraseNum)
	}
	const onPhraseLayout =
		index =>
		({
			nativeEvent: {
				layout: { /* x, */ y /* width, height */ }
			}
		}) => {
			phrasesPositionYRef.current[index] = y
		}

	return (
		<ScrollView ref={scrollViewRef} nestedScrollEnabled>
			<View style={contentTypeStyle.phrasesContainer}>
				{phrasesArray.map((elem, index) => {
					const { text, voiceName } = elem
					const { text: trText, voiceName: voiceNameTr } =
						phrasesTrArray[index] || {}
					const phraseNum = index

					return (
						index > 0 && (
							<PhraseWrapper
								key={`phrase-${phraseNum}`}
								{...{
									/* voice:  */
									voiceName,
									voiceNameTr,
									/* phrase: */
									text,
									currentPhraseNum,
									phraseNum,
									trText,
									showTranslation,
									/* event handlers */
									onPhraseLayout,
									handlePlayPhrase
								}}
							/>
						)
					)
				})}
			</View>
		</ScrollView>
	)
}
