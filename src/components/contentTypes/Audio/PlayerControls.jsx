import React from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-elements'

export default function PhrasalPlayerControls(props) {
	const { player, isPlaying, playingProgressPercent } = props

	const handlePlay = () => {
		player.play()
	}
	const handlePause = () => {
		player.pause()
	}
	const handlePlayPlus10 = () => {
		player.playPlus10()
	}
	const handlePlayMinus10 = () => {
		player.playMinus10()
	}

	return (
		<View style={{ flexDirection: 'row', alignSelf: 'center' }}>
			<Button
				type='outline'
				// style={{ display: 'none' }}
				// icon={{ name: 'pause', color: 'grey' }}
				onPress={handlePlayMinus10}
				title='-10'
			/>

			{isPlaying ? (
				<Button
					type='clear'
					// style={{ display: 'none' }}
					icon={{ name: 'pause', color: 'grey' }}
					onPress={handlePause}
				/>
			) : (
				<Button
					type='clear'
					icon={{ name: 'play-arrow', color: 'grey' }}
					onPress={handlePlay}
				/>
			)}
			<Button
				type='outline'
				// style={{ display: 'none' }}
				// icon={{ name: 'pause', color: 'grey' }}
				onPress={handlePlayPlus10}
				title='+10'
			/>
		</View>
	)
}
