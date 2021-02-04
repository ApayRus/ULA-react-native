import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View } from 'react-native'
import Slider from '@react-native-community/slider'
import PlayerControls from './PlayerControls'
import Player from './playerClass'
import content from '../../../utils/content'

const Media = props => {
	const {
		data: { path }
	} = props

	const [playerState, setPlayerState] = useState({
		isPlaying: false,
		currentTime: 0,
		playingProgressPercent: 0,
		duration: 0,
		isReady: false,
		rate: 1
	})

	const player = useRef()

	useEffect(() => {
		const initMedia = async () => {
			const audioFile = content.getFilesByPathString(path)
			player.current = new Player()
			await player.current.init(audioFile, setPlayerState)
			setPlayerState(prevState => ({ ...prevState, isReady: true }))
		}
		initMedia()
		// on unmount
		return () => {
			player.current.unload()
		}
	}, [])

	const playerProps = { player: player.current, ...playerState, setPlayerState }

	const handleSeek = currentTime => {
		setPlayerState(prevState => ({ ...prevState, currentTime }))
		player.current.setStatus({ positionMillis: currentTime * 1000 })
	}

	const { currentTime, duration, isPlaying, rate } = playerState

	// without useMemo, PlayerControls updated too many times on each currentTime update
	// and buttons not clickable
	const playerControlsMemo = useMemo(
		() => <PlayerControls {...playerProps} />,
		[duration, isPlaying, rate]
	)

	return (
		playerState.isReady && (
			<View
				style={{
					flexDirection: 'row',
					marginTop: 10,
					marginBottom: 10,
					justifyContent: 'center'
				}}
			>
				<View style={{ width: '100%' }}>
					<Slider
						minimumValue={0}
						value={currentTime}
						maximumValue={duration ? duration : 100}
						onSlidingComplete={value => handleSeek(value)}
						style={{
							width: '100%',
							alignSelf: 'center'
						}}
						// minimumTrackTintColor='blue'
						// maximumTrackTintColor='gray'
					/>
					{playerControlsMemo}
				</View>
			</View>
		)
	)
}

export default Media
