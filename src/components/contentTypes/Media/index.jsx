import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import PlayerControls from './PlayerBasicControls'
import { loadDataToPlayer } from './utils'

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
		isVideo: true
	})

	const playerRef = useRef()
	const mediaRef = useRef()
	const mediaSourceRef = useRef()

	useEffect(() => {
		const initMedia = async () => {
			const { isVideo } = await loadDataToPlayer(
				path,
				/* mutable objects */
				playerRef,
				mediaRef,
				mediaSourceRef
			)

			setPlayerState(prevState => ({ ...prevState, isVideo }))

			playerRef.current.events.on('*', (eventType, eventValue) => {
				setPlayerState(prevState => ({
					...prevState,
					[eventType]: eventValue
				}))
			})
		}
		initMedia()
		// on unmount
		return () => {
			playerRef.current.unload()
		}
	}, [])

	const playerProps = { player: playerRef.current, ...playerState }

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
						{...mediaSourceRef.current} // source and posterSource
					/>
				)}
				{!isVideo && <View>{playerControlsMemo}</View>}
			</View>
		</View>
	)
}

export default Media
