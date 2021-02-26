import React, { useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Button, Text, colors } from 'react-native-elements'
import Slider from '@react-native-community/slider'
import { formatSecondsToTime } from '../../../utils/utils'

export default function PhrasalPlayerControls(props) {
	const { player, isPlaying, currentTime, duration, rate } = props

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
	const handleChangeRate = () => {
		player.changeRate()
	}
	const handleSeekStart = () => {
		player.seekStart()
	}
	const handleSeek = time => {
		player.seek(time)
	}

	// useEffect(() => {
	// 	return () => {
	// 		player.unload()
	// 	}
	// }, [])

	const currentTimeFormatted = formatSecondsToTime(currentTime)
	const durationFormatted = duration ? formatSecondsToTime(duration) : ''

	const TimeIndicator = (
		<View>
			<Text style={{ color: colors.grey2 }}>
				{currentTimeFormatted} / {durationFormatted}
			</Text>
		</View>
	)

	const SpeedChangeButton = (
		<TouchableOpacity onPress={handleChangeRate}>
			<Text style={{ color: colors.grey2, textAlign: 'right' }}>x{rate}</Text>
		</TouchableOpacity>
	)

	const playerButton = (iconName, onPressHandler) => (
		<Button
			type='clear'
			icon={{ name: iconName, color: 'grey' }}
			onPress={onPressHandler}
			buttonStyle={styles.playerButton}
		/>
	)

	const PlayerButtons = (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-around'
			}}
		>
			{playerButton('fast-rewind', handlePlayMinus10)}

			{isPlaying
				? playerButton('pause', handlePause)
				: playerButton('play-arrow', handlePlay)}

			{playerButton('fast-forward', handlePlayPlus10)}
		</View>
	)

	return (
		<View>
			<Slider
				minimumValue={0}
				value={currentTime}
				maximumValue={duration ? duration : 100}
				onSlidingStart={() => handleSeekStart()}
				onSlidingComplete={value => handleSeek(value)}
				style={styles.slider}
				// minimumTrackTintColor='blue'
				// maximumTrackTintColor='gray'
			/>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingLeft: 10
					// paddingRight: 10
				}}
			>
				<View style={{ flex: 1 }}>{TimeIndicator}</View>
				<View style={{ flex: 2 }}>{PlayerButtons}</View>
				<View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
					{SpeedChangeButton}
				</View>
			</View>
		</View>
	)
}

const styles = {
	playerButton: { padding: 2 },
	slider: {
		paddingLeft: 4,
		paddingRight: 4,
		width: '100%',
		alignSelf: 'center'
	}
}
