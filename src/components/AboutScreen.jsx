import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import { Image, Text, Button, colors } from 'react-native-elements'

function AboutScreen() {
	const website = ''
	return (
		<div>
			<Button
				type='clear'
				onPress={() => Linking.openURL(`https://${website}`)}
				icon={{
					name: 'language',
					size: 15,
					color: colors.primary
				}}
				title='website'
			/>
		</div>
	)
}

export default AboutScreen
