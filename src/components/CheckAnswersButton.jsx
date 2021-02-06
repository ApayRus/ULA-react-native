import React from 'react'
import { View } from 'react-native'
import { Button, colors } from 'react-native-elements'

const CheckAnswersButton = props => {
	const { correctState, handleCheckAnswers } = props

	const stateIconTextColorMap = {
		correct: { name: 'done', color: 'green', title: 'Correct' },
		incorrect: { name: 'clear', color: 'red', title: 'Incorrect' },
		unknown: {
			name: 'help-outline',
			color: colors.primary,
			title: 'Check the answer'
		}
	}

	const { title, color } = stateIconTextColorMap[correctState]

	return (
		<Button
			iconRight
			onPress={handleCheckAnswers}
			icon={stateIconTextColorMap[correctState]}
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
