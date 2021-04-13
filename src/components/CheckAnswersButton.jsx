import React from 'react'
import { Button, colors } from 'react-native-elements'

const CheckAnswersButton = props => {
	const { userAnswerCorrectness = 'unknown', handleCheckAnswer } = props

	const stateIconTextColorMap = {
		correct: { name: 'done', color: 'green', title: 'Correct' },
		incorrect: { name: 'clear', color: 'red', title: 'Incorrect' },
		unknown: {
			name: 'help-outline',
			color: colors.primary,
			title: 'Check the answer'
		}
	}

	const { title, color } = stateIconTextColorMap[userAnswerCorrectness]

	return (
		<Button
			iconRight
			onPress={handleCheckAnswer}
			icon={stateIconTextColorMap[userAnswerCorrectness]}
			size='small'
			type='outline'
			title={title}
			containerStyle={{ margin: 5 }}
			buttonStyle={{
				padding: 2,
				paddingLeft: 10,
				borderColor: color
			}}
			titleStyle={{ color, fontSize: 14 }}
		/>
	)
}

export default CheckAnswersButton
