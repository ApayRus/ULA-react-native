import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, CheckBox } from 'react-native-elements'
import CheckAnswersButton from '../../CheckAnswersButton'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import layoutStylesModule from '../../../config/styles/layout'

const Quiz = props => {
	const {
		chapterId,
		subchapterId,
		quizId,
		data: { type, correctAnswers = [], variants }
	} = props

	const { quiz: layoutStyles } = layoutStylesModule

	const [userAnswers, setUserAnswers] = useState([])
	const [userAnswerCorrectness, setUserAnswerCorrectness] = useState('unknown') // isRight || isWrong
	const [errorCount, setErrorCount] = useState(0)
	// const [stopCounting, setStopCounting] = useState(false)

	const handleCheckAnswer = () => {
		const isCorrect = String(correctAnswers) === String(userAnswers)
		if (isCorrect) {
			setUserAnswerCorrectness('correct')
		} else {
			setUserAnswerCorrectness('incorrect')
			if (userAnswerCorrectness === 'unknown') setErrorCount(errorCount + 1)
			// if user see that answer is correct or incorrect and press the button at the same time, we don't count this clicks
		}
	}

	const handlePressVariant = (variantIndex, type) => () => {
		setUserAnswerCorrectness('unknown') // if user changed something, we know nothing about it
		//if this answer also been set, we remove it
		if (userAnswers.includes(variantIndex)) {
			setUserAnswers(userAnswers.filter(elem => elem !== variantIndex))
			// if there was clear cell -- we add variant to answers
		} else {
			if (type === 'multiple') {
				setUserAnswers([...userAnswers, variantIndex].sort())
			} else if (type === 'single') {
				setUserAnswers([variantIndex])
			}
		}
	}

	const variantsRender = variants.map((elem, variantIndex) => {
		const { text } = elem
		return (
			<CheckBox
				key={`variant-${variantIndex}`}
				{...layoutStyles.checkboxProps}
				{...(type === 'single'
					? { checkedIcon: 'dot-circle-o', uncheckedIcon: 'circle-o' }
					: {})}
				checked={userAnswers.includes(variantIndex)}
				onPress={handlePressVariant(variantIndex, type)}
				title={text}
			/>
		)
	})

	return (
		<View>
			{variantsRender}
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-end'
				}}
			>
				<View>
					<CheckAnswersButton
						{...{ setUserAnswerCorrectness, handleCheckAnswer }}
					/>
				</View>
				<View>
					<Text>{errorCount}</Text>
				</View>
			</View>
		</View>
	)
}

export default Quiz

/* 
const data = {
	label: 'quiz',
	data: {
		variants: [
			{ text: 'variant 1' },
			{ text: 'variant 2' },
			{ text: 'variant 3' },
			{ text: 'variant 4' }
		],
		correctAnswers: ['0', '2'],
		type: 'multiple'
	}
} 
*/

/* 
const incorrectAnswers = {
	[chapterId]:{
		[subchapterId]:{
			quiz: {
				[quizId]: {
					errorCount,
					stopCounting
				}
			}
		}
	}
} 
*/
