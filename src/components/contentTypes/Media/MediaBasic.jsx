import React, { useEffect, useState, useRef } from 'react'
import { Text, View } from 'react-native'
import Slider from '@react-native-community/slider'

import PlayerControls from './PlayerControls'
import Player from './playerClass'

export default function Audio(props) {
	const { chapterId, subchapterId } = props

	const [playerState, setPlayerState] = useState({
		isPlaying: false,
		currentTime: 0,
		playingProgressPercent: 0,
		duration: 0,
		isReady: false
	})

	const player = useRef(null)

	useEffect(() => {
		// const audioId = `${chapterId}-${subchapterId}`
		const initMedia = async () => {
			const audioId = `009-001`
			player.current = new Player()
			await player.current.init(audioId, 'timing', setPlayerState)
			setPlayerState(prevState => ({ ...prevState, isReady: true }))
		}
		initMedia()
	}, [])

	const playerProps = { player: player.current, ...playerState, setPlayerState }

	const handleSeek = currentTime => {
		console.log('currentTime', currentTime)
		setPlayerState(prevState => ({ ...prevState, currentTime }))
		player.current.setStatus({ positionMillis: currentTime * 1000 })
	}

	const {
		currentTime,
		duration,
		isPlaying,
		playingProgressPercent
	} = playerState

	return (
		playerState.isReady && (
			<View>
				<Text>
					{chapterId}-{subchapterId}{' '}
				</Text>
				<Text>Audio!!! </Text>

				<Slider
					minimumValue={0}
					value={currentTime}
					maximumValue={duration ? duration : 100}
					onSlidingComplete={value => handleSeek(value)}
					style={{ width: '80%', height: 40, alignSelf: 'center' }}
					minimumTrackTintColor='blue'
					maximumTrackTintColor='gray'
				/>
				<PlayerControls {...playerProps} />
				<Text>
					{currentTime} {isPlaying}
				</Text>
				<Text>{playingProgressPercent} %</Text>
				<Text>duration: {duration} </Text>
			</View>
		)
	)
}
