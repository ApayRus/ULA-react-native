import React from 'react'
import { View, Text } from 'react-native'
import Exercise from './Single'
import ExercisesClass from '../../../utils/exercises'

const index = () => {
	const randomizer = new ExercisesClass(8)

	const randomIndexesArray = randomizer.getIndexes(8, 3)

	return (
		<View>
			{randomIndexesArray.map((randomIndexes, index) => (
				<Exercise key={`exercise-${index}`} phraseIndexes={randomIndexes} />
			))}
		</View>
	)
}

export default index
