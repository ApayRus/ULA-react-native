import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import Slider from '@react-native-community/slider'
import PlayerControls from './PlayerControls'
import Player from './playerClass'
import content from '../../../utils/content'
import { getYoutubeVideoByUrl, isYoutube } from '../../../utils/utils'
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
	const videoSources = useRef()

	useEffect(() => {
		const initMedia = async () => {
			const getSourceAndExtensionFromPath = async path => {
				// === is file local and we need require,
				// or it is external and we need uri ?
				// for now we check it by .ext - local files don't have it ===
				const extractFileFromPath = async uri => {
					if (isYoutube(uri)) {
						const {
							data: { urlVideo: uriDirect, thumbnails = [] }
						} = await getYoutubeVideoByUrl(uri)
						const uriPoster = thumbnails[thumbnails.length - 1]
						// console.log(uriDirect)

						const extension = '.mp4' // just guess for small youtube videos
						return { uri: uriDirect, extension, uriPoster }
					}
					const [extension] = uri.match(new RegExp(/(\.mp3)|(\.mp4)$/)) || []
					if (extension) {
						// it is external file, direct link, we get from it uri param
						return { uri, extension }
					} else {
						//it's local file and we get it from assets
						const { file, extension } = content.getFilesByPathString(uri) || {} // file = require(../content/...)
						return { file, extension }
					}
				}
				const { file, uri, extension, uriPoster } =
					(await extractFileFromPath(path)) || {} // file or uri
				const source = file ? file : { uri }
				return { source, extension, posterSource: { uri: uriPoster } }
			}
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
					await player.current.init(source, setPlayerState)
					setPlayerState(prevState => ({ ...prevState, isReady: true }))
				}
				if (isVideo) {
					videoSources.current = { source, posterSource }
					console.log('videoSources.current', videoSources.current)
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
						{...videoSources.current} // {source, posterSource}
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
