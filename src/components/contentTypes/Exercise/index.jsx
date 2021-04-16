/**
 * exercise has its own chapterId/subchapterId,
 * but it is related to source material, like list of words or phrases
 * than we have couples: chapterId and sourceChapterId, subchapterId and sourceSubchapterId
 * for more info please visit: https://hackmd.io/@aparus/exercises-ru
 */

import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'
import content from '../../../utils/content'
import Exercise from './Single2'
import ExercisesClass from '../../../utils/exercises'

const index = props => {
	const randomizer = new ExercisesClass(8)
	const {
		chapterId,
		subchapterId,
		contentTypeDoc: {
			content: exerciseBlocksArray,
			param: sourceAddress = '' /* chapterId/subchapterId */
		}
	} = props

	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
	const [plainExercisesInfoArray, setPlainExercisesInfoArray] = useState([])
	const [userAnswerCorrectness, setUserAnswerCorrectness] = useState('unknown') // correct | incorrect

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
	Exercise typedContent consists from blocks with similar type of exercises, like this: 
	
	exerciseBlocksArray = [
		{
			activityType: "choose-from-4"
			count: "10"
			givenLang: "original"
			givenType: "audio"
			requiredLang: "original"
			requiredType: "text"
		}
	]

	they are produced from text in content like this:

	audio-original --> text-original choose-from-4 12
	audio-original --> text-translation choose-from-4 6
	text-translation --> text-original write 3

	now we need to generate from each block in array another array, with particular phrases, 
	must info in exercise is from block, the addition is only phraseIndexes
	*/

	useEffect(() => {
		// 3 level nested array like: [[[3,7,6,1],[5,7,6,4],[6,3,2,1]],[[5,6,8,7],[3,5,8,2]],[[8]]]
		const randomIndexesArray = exerciseBlocksArray.map(exercisesBlock => {
			const { count, activityType } = exercisesBlock
			const variantsCount = activityType.match(/choose-from-(.+?)/)?.[1] || '1'
			const randomIndexesArray = randomizer.getIndexes(
				+count,
				+variantsCount - 1
			)
			return randomIndexesArray
		})
		/* 1 level array like: [ {"blockIndex":0,"phraseIndex":[4,5,3,6]}, ...*/
		const plainExercisesArray = randomIndexesArray.reduce(
			(prev, item, index) => {
				return [
					...prev,
					...item.map(elem => ({ blockIndex: index, phraseIndexes: elem }))
				]
			},
			[]
		)

		setPlainExercisesInfoArray(plainExercisesArray)

		return () => {}
	}, [])

	// joins block info with particular exercise indexes
	const getCurrentExerciseProps = index => {
		const { blockIndex, phraseIndexes } = plainExercisesInfoArray[index] || {}
		const blockInfo = exerciseBlocksArray[blockIndex] // type of exercise
		return {
			...blockInfo,
			phraseIndexes,
			sourceChapterId,
			sourceSubchapterId,
			userAnswerCorrectness,
			setUserAnswerCorrectness
		}
	}

	const currentExerciseProps = getCurrentExerciseProps(currentExerciseIndex)

	const handlePressNextButton = () => {
		setCurrentExerciseIndex(prev => prev + 1)
		setUserAnswerCorrectness('unknown')
	}

	return (
		plainExercisesInfoArray.length > 0 && (
			<View
				style={{
					flex: 1,
					justifyContent: 'center'
				}}
			>
				<View style={{ marginBottom: 40, alignItems: 'center' }}>
					<Exercise
						key={`ex-${currentExerciseIndex}`}
						{...currentExerciseProps}
					/>
				</View>
				<View style={styles.progressCounter}>
					<Button
						title={`${currentExerciseIndex + 1}/${
							plainExercisesInfoArray.length
						}`}
					/>
				</View>
				{userAnswerCorrectness === 'correct' && (
					<View style={styles.nextButton}>
						<Button
							title='Go Next'
							icon={{ name: 'chevron-right', color: 'white' }}
							iconRight
							iconContainerStyle={{ marginRight: 0 }}
							onPress={handlePressNextButton}
							buttonStyle={{ paddingRight: 0 }}
						/>
					</View>
				)}
			</View>
		)
	)
}

const styles = {
	nextButton: {
		position: 'absolute',
		bottom: 2,
		right: 2
	},
	progressCounter: {
		position: 'absolute',
		bottom: 2,
		left: 2
	}
}

export default index
