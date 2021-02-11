import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import PlayerControls from './PlayerBasicControls'
import PlayerBasic from './playerBasicClass'
import { getSourceAndExtensionFromPath } from './utils'

import { Audio, Video } from 'expo-av'

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
		isVideo: true
	})

	const player = useRef()
	const mediaRef = useRef()
	const mediaSource = useRef()

	useEffect(() => {
		const initMedia = async () => {
			const {
				source,
				extension,
				posterSource
			} = await getSourceAndExtensionFromPath(path)

			const chooseAndSetVideoOrAudio = async () => {
				const videoExtensions = ['.mp4'] // for now just one
				const isVideo = videoExtensions.includes(extension)
				setPlayerState(prevState => ({ ...prevState, isVideo }))

				if (!isVideo) {
					mediaRef.current = new Audio.Sound()
				}

				await mediaRef.current.loadAsync(source)

				player.current = new PlayerBasic(mediaRef)
				player.current.events.on('*', (eventType, eventValue) => {
					setPlayerState(prevState => ({
						...prevState,
						[eventType]: eventValue
					}))
				})
				mediaSource.current = { source, posterSource }
			}
			await chooseAndSetVideoOrAudio()
		}
		initMedia()
		// on unmount
		return () => {
			player.current.unload()
		}
	}, [])

	const playerProps = { player: player.current, ...playerState, setPlayerState }

	const { currentTime, duration, isPlaying, rate, isVideo } = playerState

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
			<View style={{ width: screenWidth }}>
				{isVideo && (
					<Video
						resizeMode='stretch'
						useNativeControls
						style={{
							width: screenWidth,
							height: (screenWidth * 9) / 16
						}}
						ref={mediaRef}
						{...mediaSource.current}
					/>
				)}
				{!isVideo && <View>{playerControlsMemo}</View>}
			</View>
		</View>
	)
}

export default Media