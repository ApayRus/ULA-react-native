/**
 * exercise has its own chapterId/subchapterId,
 * but it is related to source material, like list of words or phrases
 * than we have couples: chapterId and sourceChapterId, subchapterId and sourceSubchapterId
 * for more info please visit: https://hackmd.io/@aparus/exercises-ru
 */

import React from 'react'
import { View, Text } from 'react-native'
import content from '../../../utils/content'
import Exercise from './Single'
import ExercisesClass from '../../../utils/exercises'

const index = props => {
	const randomizer = new ExercisesClass(8)
	const {
		chapterId,
		subchapterId,
		contentTypeDoc: {
			content: exercisesArray,
			param: sourceAddress = '' /* chapterId/subchapterId */
		}
	} = props

	let sourceChapterId, sourceSubchapterId

	if (sourceAddress) {
		const sourceAddressArray = sourceAddress.split('/')
		sourceChapterId = sourceAddressArray[0]
		sourceSubchapterId = sourceAddressArray[1]
	} else {
		const { prevChapterId, prevSubchapterId } = content.getPrevContentItem(
			chapterId,
			subchapterId
		)
		sourceChapterId = prevChapterId
		sourceSubchapterId = prevSubchapterId
	}

	/* 
exercisesArray = [
	{
		activityType: "choose-from-4"
		count: "10"
		givenLang: "original"
		givenType: "audio"
		requiredLang: "original"
		requiredType: "text"
	}
]
*/

	return (
		<View>
			{exercisesArray.map(exercise => {
				const { count, activityType } = exercise

				const variantsCount =
					activityType.match(/choose-from-(.+?)/)?.[1] || '0'

				const randomIndexesArray = randomizer.getIndexes(
					+count,
					+variantsCount - 1
				)

				return randomIndexesArray.map((randomIndexes, index) => (
					<Exercise
						key={`exercise-${index}`}
						phraseIndexes={randomIndexes}
						{...{ sourceChapterId, sourceSubchapterId }}
					/>
				))
			})}
		</View>
	)
}

export default index
