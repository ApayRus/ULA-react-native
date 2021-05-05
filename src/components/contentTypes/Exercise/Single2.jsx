/* 
first task call to action: 
						"read the text"  
						"listen to the audio"
first task source material: 
						playAudioButton 
						readTextButton
second task call to action: 
						"choose the right variant" 
						"write the text"  
						"write the translation"
second task user input: 
						TextInput 
						VariantButtons 
						orderWordsButtons
check the answer button 

show progress (position of this exercise in general count)

redirect to the next exercise 

****
PHRASES MODE
if source material is contentType=fileCard then we play short files
if SM is media (phrasal) then we play phrases from 1 media 
in both cases we work with phrases which have 1) text, 2) translation, 3) sound
and there is many ways to combine them in exercise 

// -- move to separate component --> 
GLOSSARY MODE
if SM is richText then we parse text to Glossary 
	{ 
		title, // term, idiom etc, 
		description // definition/explanation
	}
and there is only one way to use it in exercise: 
1) show description 
2) ask variant from all titles 
*/

import React, { useEffect, useState, useRef } from 'react'
import { View, Image } from 'react-native'
import { Button, Text, Input } from 'react-native-elements'
import content from '../../../utils/content'
import Randomizer from '../../../utils/exercises'
import { prefixedIndex } from '../../../utils/utils'
import ChooseFromVariants from './Variants'
import GiveUpButton from './GiveUpButton'
import Order from './Order'
import { getTaskText, getPlaceholderText } from './utils'
import CheckAnswerButton from '../../CheckAnswersButton'
import { playAudio } from '../../../utils/playerShortAudios'
import { useSelector } from 'react-redux'
import PhrasalPlayer from '../../MediaPlayer'
import { normalizeTextBeforeOrdering } from './utils'

const Single2 = props => {
	// const exerciseInfo = {
	// 	givenType: ['image', 'text-original'],
	// 	required: ['text-translation'],
	// 	activityType: 'choose-from-4',
	// 	count: '10',
	// 	chapterId: '001',
	// 	subchapterId: '001',
	// 	phraseIndexes: ['003', '008', '001', '002']
	// }

	const {
		activityType,
		given: givenArray = [],
		required: requiredArray = [],
		sourceChapterId: chapterId,
		sourceSubchapterId: subchapterId,
		sourceInteractivity,
		phraseIndexes = [],
		//
		userAnswerCorrectness,
		setUserAnswerCorrectness, // unknown | correct | incorrect
		giveUp,
		setGiveUp
	} = props

	// console.log('props')
	// console.log(props)

	const [phrases, setPhrases] = useState([])
	const [userAnswer, setUserAnswer] = useState('')
	const { trLang } = useSelector(state => state.translation)
	const playerRef = useRef() // phrasal player

	const [, givenLang] = givenArray
		.find(elem => elem.startsWith('text-'))
		?.split('-') || ['', 'original']
	const [, requiredLang] = requiredArray
		.find(elem => elem.startsWith('text-'))
		?.split('-') || ['', 'original']

	useEffect(() => {
		const correctPhraseId = prefixedIndex(phraseIndexes?.[0])
		const shuffledIndexes = Randomizer.shuffle(phraseIndexes)

		const original = content.getPhrases(
			chapterId,
			subchapterId,
			shuffledIndexes
		)

		const translation = content.getPhrasesTr(
			chapterId,
			subchapterId,
			shuffledIndexes
		)

		const phrases0 = { original, translation }

		const { text: correctPhraseText } =
			phrases0[requiredLang]?.find(elem => elem.id === correctPhraseId) || {}

		setPhrases({
			...phrases0,
			correctPhraseId,
			correctPhraseText
		})
	}, [trLang])

	const taskText = getTaskText(givenArray, requiredArray, activityType)

	const placeholderText = getPlaceholderText(requiredLang)

	const checkUserAnswerCorrectness = () => {
		let correctAnswer = ''
		if (activityType === 'write') {
			correctAnswer = phrases.correctPhraseText
		} else if (activityType.match(/choose-from-/i)) {
			correctAnswer = phrases.correctPhraseId
		} else if (activityType === 'order') {
			correctAnswer = normalizeTextBeforeOrdering(phrases.correctPhraseText)
		}

		if (correctAnswer === userAnswer) {
			setUserAnswerCorrectness('correct')
		} else {
			setUserAnswerCorrectness('incorrect')
		}
	}

	const resetUserAnswerCorrectness = () => {
		setUserAnswerCorrectness('unknown')
	}

	const handleTextInputChange = text => {
		resetUserAnswerCorrectness()
		setUserAnswer(text)
	}

	const handleGiveUp = () => {
		setGiveUp(true)
	}

	const handlePlayAudio = () => {
		if (sourceInteractivity === 'fileCard') {
			const filePath = `${chapterId}/${subchapterId}/audios/${phrases.correctPhraseId}`
			const { file: audioFile } = content.getFilesByPathString(filePath) || {}
			playAudio(audioFile, filePath)
		} else {
			// media (phrasal)
			playerRef.current.playPhrase(+phrases.correctPhraseId)
		}
	}

	const imagePath = `${chapterId}/${subchapterId}/images/${phrases.correctPhraseId}`
	const { file: imageSource } = content.getFilesByPathString(imagePath) || {}

	const given = () => {
		return (
			<>
				{givenArray.includes('image') && imageSource && (
					<Image
						source={imageSource}
						style={{ width: 100, height: 100, resizeMode: 'contain' }}
					/>
				)}
				{givenArray.find(elem => elem.startsWith('text-')) && (
					<Button
						title={
							phrases?.[givenLang]?.find(
								phrase => phrase.id === phrases.correctPhraseId
							)?.text
						}
					/>
				)}
				{givenArray.includes('audio') && (
					<Button
						icon={{ name: 'play-arrow', color: 'white' }}
						onPress={handlePlayAudio}
					/>
				)}
			</>
		)
	}

	const getUserInput = (activityType = '') => {
		if (activityType.match(/write/i)) {
			return (
				<Input
					inputStyle={{ textAlign: 'center' }}
					containerStyle={{ alignSelf: 'center' }}
					placeholder={placeholderText} // translation of the word
					onChangeText={handleTextInputChange}
				/>
			)
		} else if (activityType.match(/choose/i)) {
			return (
				<ChooseFromVariants
					requiredArray={requiredArray}
					variants={phrases[requiredLang]}
					setUserAnswer={setUserAnswer}
					resetUserAnswerCorrectness={resetUserAnswerCorrectness}
					correctPhraseId={phrases.correctPhraseId}
					userAnswerCorrectness={userAnswerCorrectness}
					chapterId={chapterId}
					subchapterId={subchapterId}
				/>
			)
		} else if (activityType.match(/order/i)) {
			return (
				<Order
					text={phrases.correctPhraseText}
					setUserAnswer={setUserAnswer}
					resetUserAnswerCorrectness={resetUserAnswerCorrectness}
				/>
			)
		} else {
			return null
		}
	}

	const userInput = getUserInput(activityType)

	return (
		<>
			<View style={styles.exerciseInstructionContainer}>
				{sourceInteractivity === 'media' && (
					<PhrasalPlayer
						chapterId={chapterId}
						subchapterId={subchapterId}
						playerRef={playerRef}
					/>
				)}
				<Text>{taskText}</Text>
			</View>
			{given()}
			<View style={styles.inputContainer}>{userInput}</View>
			<CheckAnswerButton
				userAnswerCorrectness={userAnswerCorrectness}
				handleCheckAnswer={checkUserAnswerCorrectness}
			/>
			<GiveUpButton onPress={handleGiveUp} />
			<View style={styles.giveUpAnswerContainer}>
				{giveUp && (
					<Text style={styles.giveUpText}>{phrases.correctPhraseText}</Text>
				)}
			</View>
		</>
	)
}

const styles = {
	exerciseInstructionContainer: {
		margin: 20,
		marginLeft: 5,
		marginRight: 5,
		textAlign: 'center'
	},
	inputContainer: {
		margin: 20,
		width: '100%'
	},
	giveUpAnswerContainer: {
		height: 20,
		justifyContent: 'center'
	},

	giveUpText: { borderWidth: 0.5, borderColor: 'red', padding: 5 }
}

export default Single2
