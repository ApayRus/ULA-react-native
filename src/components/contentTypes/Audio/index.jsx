import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import Slider from '@react-native-community/slider'

import { useSelector, useDispatch } from 'react-redux'
import { setPlayerState } from '../../../store/playerStateActions'
import PlayerControls from './PlayerControls'
import player from './playerClass'

export default function Audio(props) {
	const { chapterId, subchapterId } = props

	const dispatch = useDispatch()

	const {
		isPlaying,
		currentTime = 0,
		playingProgressPercent = 0,
		duration = 0
	} = useSelector(state => state.playerState)

	useEffect(() => {
		const audioId = `${chapterId}-${subchapterId}`
		player.init(audioId, 'audios')
	}, [])

	const playerProps = { player, isPlaying, currentTime, playingProgressPercent }

	const handleSeek = currentTime => {
		dispatch(setPlayerState({ currentTime }))
		player.setStatus({ positionMillis: currentTime * 1000 })
	}

	return (
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
}
