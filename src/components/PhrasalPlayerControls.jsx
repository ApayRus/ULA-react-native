import React from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-elements'

export default function PhrasalPlayerControls(props) {
	const { phrasalPlayer } = props

	const handlePlay = () => {
		phrasalPlayer.play()
	}
	const handlePause = () => {
		phrasalPlayer.pause()
	}
	const handlePlayNextPhrase = () => {
		phrasalPlayer.playNextPhrase()
	}
	const handlePlayPreviousPhrase = () => {
		phrasalPlayer.playPreviousPhrase()
	}
	const handleReplay = () => {
		phrasalPlayer.playCurrentPhrase()
	}

	return (
		<View style={{ flexDirection: 'row', alignSelf: 'center' }}>
			<Button type='clear' icon={{ name: 'settings', color: 'grey' }} />
			<Button type='clear' icon={{ name: 'repeat', color: 'grey' }} />
			<Button
				type='clear'
				// style={{ display: 'none' }}
				icon={{ name: 'pause', color: 'grey' }}
				onPress={handlePause}
			/>
			<Button
				type='clear'
				icon={{ name: 'play-arrow', color: 'grey' }}
				onPress={handlePlay}
			/>
			<Button
				type='clear'
				icon={{ name: 'skip-previous', color: 'grey' }}
				onPress={handlePlayPreviousPhrase}
			/>
			<Button
				type='clear'
				icon={{ name: 'replay', color: 'grey' }}
				onPress={handleReplay}
			/>
			<Button
				type='clear'
				icon={{ name: 'skip-next', color: 'grey' }}
				onPress={handlePlayNextPhrase}
			/>
		</View>
	)
}
