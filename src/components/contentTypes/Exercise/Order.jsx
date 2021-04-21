/**
 * text --> correctPazzlesArray --> shuffledPuzzlesArray
 * user input/activity:
 * 		clicks on messy array puzzles -->
 * 		they disappears (slice) from shuffledPuzzlesArray
 * 		and appears (push) in userOrderedPuzzlesArray
 * 		checkAnswerButton
 * 		if(userOrderedPuzzlesArray === correctPazzlesArray) well done!! (correct) --> go next
 * 		otherwise incorrect (try again)
 */

import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Randomizer from '../../../utils/exercises'
import { normalizeTextBeforeOrdering } from './utils'

const OrderWords = props => {
	const { text = '', setUserAnswer, resetUserAnswerCorrectness } = props

	const [shuffledArray, setShuffledArray] = useState([])
	const [userOrderedArray, setUserOrderedArray] = useState([])

	useEffect(() => {
		const correctPuzzlesArray = normalizeTextBeforeOrdering(text).split(' ')

		const shuffledPuzzlesArray = Randomizer.shuffle(correctPuzzlesArray)
		setShuffledArray(shuffledPuzzlesArray)
		return () => {
			// cleanup
		}
	}, [text])

	const handlePressPuzzle = (handlerToRemove, handlerToAdd) => (
		puzzleText,
		index
	) => () => {
		handlerToRemove(prevArray =>
			prevArray.filter((elem, index2) => index !== index2)
		)
		handlerToAdd(prevArray => prevArray.concat(puzzleText))

		resetUserAnswerCorrectness()
	}

	useEffect(() => {
		setUserAnswer(userOrderedArray.join(' '))
		return () => {
			// cleanup
		}
	}, [userOrderedArray])

	const Puzzles = props => {
		const { color, onPress, puzzlesArray, name } = props
		return (
			<View
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					minHeight: 30,
					paddingTop: 15,
					paddingLeft: 5,
					paddingRight: 5,
					borderColor: 'skyblue',
					borderWidth: 1,
					borderRadius: 5
				}}
			>
				{puzzlesArray.map((puzzleText, index) => {
					return (
						<TouchableOpacity
							onPress={onPress(puzzleText, index)}
							key={`${name}-puzzle-${index}`}
							style={{ marginRight: 5 }}
						>
							<Text
								style={{
									borderColor: color,
									borderWidth: 1,
									padding: 5
								}}
							>
								{puzzleText}
							</Text>
							<Text> </Text>
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}

	return (
		<View style={{ margin: 30 }}>
			<Text style={{ width: '100%' }}>After your ordering:</Text>

			<Puzzles
				color='gold'
				onPress={handlePressPuzzle(setUserOrderedArray, setShuffledArray)}
				puzzlesArray={userOrderedArray}
				name='user-ordered'
			/>

			<Text style={{ width: '100%' }}>Shuffled elements:</Text>

			<Puzzles
				color='silver'
				onPress={handlePressPuzzle(setShuffledArray, setUserOrderedArray)}
				puzzlesArray={shuffledArray}
				name='shuffled'
			/>
		</View>
	)
}

export default OrderWords
