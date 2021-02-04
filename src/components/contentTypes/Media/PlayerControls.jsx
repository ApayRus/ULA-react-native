import React, { useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Button, Text, colors } from 'react-native-elements'

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

	// useEffect(() => {
	// 	return () => {
	// 		player.unload()
	// 	}
	// }, [])

	const formatSecondsToTime = inputSeconds => {
		let totalSeconds = +inputSeconds.toFixed(0)
		const hours = Math.floor(totalSeconds / 3600)
		const hoursString = hours ? hours + ':' : ''
		totalSeconds %= 3600
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = totalSeconds % 60
		const secondsString = seconds.toString().padStart(2, '0')
		return `${hoursString}${minutes}:${secondsString}`
	}
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

	const PlayerButtons = (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-around'
			}}
		>
			<Button
				type='clear'
				icon={{ name: 'fast-rewind', color: 'grey' }}
				onPress={handlePlayMinus10}
				buttonStyle={styles.playerButtonStyle}
			/>

			{isPlaying ? (
				<Button
					type='clear'
					icon={{ name: 'pause', color: 'grey' }}
					onPress={handlePause}
					buttonStyle={styles.playerButtonStyle}
				/>
			) : (
				<Button
					type='clear'
					icon={{ name: 'play-arrow', color: 'grey' }}
					onPress={handlePlay}
					buttonStyle={styles.playerButtonStyle}
				/>
			)}
			<Button
				type='clear'
				icon={{ name: 'fast-forward', color: 'grey' }}
				onPress={handlePlayPlus10}
				buttonStyle={styles.playerButtonStyle}
			/>
		</View>
	)

	return (
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
	)
}

const styles = {
	// playerButtonIconContainer: { padding: 2 },
	// playerButtonContainer: { padding: 2, height: 20 },
	playerButtonStyle: { padding: 2 }
}
