import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import content from '../../../utils/content'

const GiveUpButton = props => {
	const { onPress } = props
	return (
		<TouchableOpacity {...{ onPress }}>
			<View
				style={{
					marginTop: 20,
					marginBottom: 20,
					borderColor: 'grey',
					borderWidth: 0.3,
					borderRadius: 5,
					flexDirection: 'row',
					alignItems: 'center',
					padding: 3,
					paddingLeft: 7,
					paddingRight: 7
					// justifyContent: 'center'
				}}
			>
				<Text style={{ color: 'grey' }}>give up (show the answer) </Text>
				<Image
					source={content.getFilesByPathString('images/dont_know').file}
					style={{ width: 24, height: 24 }}
				/>
			</View>
		</TouchableOpacity>
	)
}

export default GiveUpButton
