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
check the answer button 

show progress (position of this exercise in general count)

redirect to the next exercise
*/

import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Text, Input } from 'react-native-elements'
import content from '../../../utils/content'
import Randomizer from '../../../utils/exercises'
import { prefixedIndex } from '../../../utils/utils'
import ChooseFromVariants from './Variants'
import { getTaskText, getPlaceholderText } from './utils'
import CheckAnswerButton from '../../CheckAnswersButton'

const Single2 = props => {
	const exerciseInfo = {
		givenType: 'audio',
		givenLang: 'original',
		requiredType: 'text',
		requiredLang: 'translation',
		activityType: 'choose-from-4',
		count: '10',
		chapterId: '001',
		subchapterId: '001',
		phraseIndexes: ['001', '002', '003', '004']
	}

	const {
		activityType,
		givenLang,
		givenType,
		requiredLang,
		requiredType,
		chapterId,
		subchapterId,
		phraseIndexes
	} = exerciseInfo

	const [phrases, setPhrases] = useState({})
	const [userAnswerCorrectness, setUserAnswerCorrectness] = useState('unknown') // correct | wrong
	const [userAnswer, setUserAnswer] = useState('')

	useEffect(() => {
		const randomizer = new Randomizer(0) // random-js
		// const { phraseIndexes = [] } = props
		const correctPhraseId = prefixedIndex(phraseIndexes[0])
		const shuffledIndexes = randomizer.shuffle(phraseIndexes)

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

		setPhrases({
			original,
			translation,
			correctPhraseId
		})
	}, [])

	const taskText = getTaskText(
		givenType,
		givenLang,
		requiredType,
		requiredLang,
		activityType
	)

	const placeholderText = getPlaceholderText(requiredLang)

	const TextInput = () => (
		<Input
			inputStyle={{ textAlign: 'center' }}
			containerStyle={{ alignSelf: 'center' }}
			placeholder={placeholderText} // translation of the word
		/>
	)

	const checkUserAnswerCorrectness = () => {
		if (phrases.correctPhraseId === userAnswer) {
			setUserAnswerCorrectness('correct')
		} else {
			setUserAnswerCorrectness('incorrect')
		}
	}

	const resetUserAnswerCorrectness = () => {
		setUserAnswerCorrectness('unknown')
	}

	const userInput =
		activityType === 'write' ? (
			<TextInput />
		) : (
			<ChooseFromVariants
				variants={phrases.original}
				setUserAnswer={setUserAnswer}
				correctPhraseId={phrases.correctPhraseId}
				userAnswerCorrectness={userAnswerCorrectness}
				resetUserAnswerCorrectness={resetUserAnswerCorrectness}
			/>
		)

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<View style={styles.exerciseInstructionContainer}>
				<Text>{taskText}</Text>
			</View>
			<Button icon={{ name: 'play-arrow', color: 'white' }} />
			<View style={styles.inputContainer}>{userInput}</View>
			<Text>{userAnswer}</Text>
			<Text>{userAnswerCorrectness}</Text>
			<CheckAnswerButton
				userAnswerCorrectness={userAnswerCorrectness}
				handleCheckAnswer={checkUserAnswerCorrectness}
			/>
		</View>
	)
}

const styles = {
	exerciseInstructionContainer: {
		margin: 20
	},
	inputContainer: {
		margin: 20,
		width: '100%'
	}
}

export default Single2
