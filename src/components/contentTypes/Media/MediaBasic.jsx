import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import Slider from '@react-native-community/slider'
import PlayerControls from './PlayerControls'
import Player from './playerClass'
import content from '../../../utils/content'
import { Video } from 'expo-av'

const Media = props => {
	const {
		data: { path }
	} = props

	const { width: screenWidth, height: screenHeight } = useWindowDimensions()

	const [playerState, setPlayerState] = useState({
		isPlaying: false,
		currentTime: 0,
		playingProgressPercent: 0,
		duration: 0,
		isReady: false,
		rate: 1,
		isVideo: false
	})

	const player = useRef()
	const videoSource = useRef()

	useEffect(() => {
		const initMedia = async () => {
			const { file: source, extension } = content.getFilesByPathString(path) // file or uri
			const videoExtensions = ['.mp4']
			const isVideo = videoExtensions.includes(extension)
			const isAudio = !isVideo
			if (isAudio) {
				player.current = new Player()
				await player.current.init(source, setPlayerState)
				setPlayerState(prevState => ({ ...prevState, isReady: true }))
			}
			if (isVideo) {
				videoSource.current = source
				setPlayerState(prevState => ({ ...prevState, isVideo: true }))
			}
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
		[duration, isPlaying, rate, currentTime]
	)

	return (
		<View
			style={{
				flexDirection: 'row',
				marginTop: 10,
				marginBottom: 10,
				justifyContent: 'center',
				flexWrap: 'wrap'
			}}
		>
			{playerState.isVideo && (
				<View>
					<Video
						resizeMode='stretch'
						useNativeControls
						style={{
							width: screenWidth,
							height: (screenWidth * 9) / 16
						}}
						// ref={player}
						// source={require('../../../../content/audios/words/005-001.mp3')}
						source={videoSource.current}
					/>
				</View>
			)}
			{playerState.isReady && (
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
			)}
		</View>
	)
}

export default Media
