import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import PlayerControls from './PlayerControls'
import Player from './playerClass'
import { getSourceAndExtensionFromPath } from './utils'

import { Video } from 'expo-av'

const Media = props => {
	const {
		data: { path }
	} = props

	const { width: screenWidth } = useWindowDimensions()

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
	const videoRef = useRef()
	const videoSources = useRef()

	const handleVideoIsReady = () => {
		player.current = new Player()
		player.current.init('video', videoRef.current, setPlayerState)
	}

	useEffect(() => {
		const initMedia = async () => {
			const {
				source,
				extension,
				posterSource
			} = await getSourceAndExtensionFromPath(path)

			const chooseAndSetVideoOrAudio = async (source, extension) => {
				const videoExtensions = ['.mp4'] // for now just one
				const isVideo = videoExtensions.includes(extension)
				const isAudio = !isVideo
				if (isAudio) {
					player.current = new Player()
					await player.current.init('audio', source, setPlayerState)
					setPlayerState(prevState => ({ ...prevState, isReady: true }))
				}
				if (isVideo) {
					videoSources.current = { source, posterSource }
					// console.log('videoSources.current', videoSources.current)
					setPlayerState(prevState => ({ ...prevState, isVideo: true }))
				}
			}
			chooseAndSetVideoOrAudio(source, extension)
		}
		initMedia()
		// on unmount
		return () => {
			player.current.unload()
		}
	}, [])

	const playerProps = { player: player.current, ...playerState, setPlayerState }

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
						onReadyForDisplay={handleVideoIsReady}
						ref={videoRef}
						{...videoSources.current} // {source, posterSource}
					/>
					<View>{playerControlsMemo}</View>
				</View>
			)}
			{playerState.isReady && (
				<View style={{ width: '100%' }}>{playerControlsMemo}</View>
			)}
		</View>
	)
}

export default Media
