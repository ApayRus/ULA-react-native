/*
we can use Media component is 3 ways: 
1) <MediaPlayer pathToMedia='path/to/file' /> 
where pathToMedia is one of: 
	1) uri, 
	2) local file system path in /content or 
	3) youtube link
It is simplest player with basic controls
2) <MediaPlayer chapterId='002' subchapterId='003' /> 
This component loads every related to media info from contentType=richMedia material:
	phrases (captions + subtitles), avatars, quizzes, 
we can use it as a basic player, but with subtitles and phrasal playback in compact way (e.g. inside contentType=richText)
3) <MediaPlayer {...props} /> -- from contentType=richMedia page

*/

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, useWindowDimensions, Platform } from 'react-native'
import { Video } from 'expo-av'
import { useNavigation } from '@react-navigation/native'
import PlayerControls from './PlayerBasicControls'
import { loadDataToPlayer } from './utils'
// === for phrasal media:
import PhrasalPlayerControls from './PlayerPhrasalControls'
import PhrasesBlock from './PhrasesBlock'

const Media = props => {
	const {
		//
		// for simplest media player
		pathToMedia,
		// for advanced (phrasal) player
		contentTypeDoc = {},
		contentTypeTrDoc = {},
		scrollPageTo = () => {}
	} = props

	const navigation = useNavigation()

	const {
		title,
		params = [], // path/to/media
		content: { phrases = {} } = {}
	} = contentTypeDoc || {}

	const { title: titleTr, content: { phrases: phrasesTr = {} } = {} } =
		contentTypeTrDoc || {}

	const isPhrasalPlayer = Boolean(phrases.length)

	// ==================

	const mediaPath = pathToMedia || params?.[0]

	const { width: screenWidth, height: screenHeight } = useWindowDimensions()

	const [playerState, setPlayerState] = useState({
		isPlaying: false,
		currentTime: 0,
		playingProgressPercent: 0,
		duration: 0,
		isReady: false,
		rate: 1,
		isVideo: true,
		currentPhraseNum: 0
	})

	const mediaRef = useRef() // expo media object instance (expo-av, new Sound(), loadAsync)
	const playerRef = props.playerRef || useRef() // our playerClass instance
	const mediaSourceRef = useRef() // uri or required , for media and poster
	const phrasesBlockPositionYRef = useRef() // coordinates of each phrase, so we can scroll screen to them

	useEffect(() => {
		const initMedia = async () => {
			const { isVideo } = await loadDataToPlayer(
				mediaPath,
				/* mutable objects */
				playerRef,
				mediaRef,
				mediaSourceRef,
				/* for phrasal  player */
				phrases
			)

			setPlayerState(prevState => ({ ...prevState, isVideo }))

			playerRef.current.events.on('*', (eventType, eventValue) => {
				// console.log(eventType, eventValue)
				setPlayerState(prevState => ({
					...prevState,
					[eventType]: eventValue
				}))
			})
		}
		initMedia()

		// on unmount
		return () => {
			playerRef?.current?.unload()
		}
	}, [])

	useEffect(() => {
		if (phrasesBlockPositionYRef.current) {
			scrollPageTo(phrasesBlockPositionYRef.current)
		}
	}, [phrasesBlockPositionYRef.current])

	useEffect(() => {
		return () => {
			playerRef?.current?.unload()
		}
	}, [navigation])

	const playerProps = { player: playerRef.current, ...playerState }

	const { currentTime, duration, isPlaying, rate, isVideo, currentPhraseNum } =
		playerState

	// without useMemo, PlayerControls updated too many times on each currentTime update
	// and buttons not clickable
	const playerControlsMemo = useMemo(
		() => <PlayerControls {...playerProps} />,
		[duration, isPlaying, rate, currentTime]
	)

	const basicPlayer = (
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
						// useNativeControls
						usePoster
						// poster doesn't disappear after video is loaded
						// and I can't use default controls
						style={{
							width: screenWidth,
							height: (screenWidth * 9) / 16
						}}
						ref={mediaRef}
						{...Platform.select({
							native: { posterSource: mediaSourceRef?.current?.posterSource },
							default: mediaSourceRef.current
						})} // source and posterSource
					/>
				)}
				<View>{playerControlsMemo}</View>
			</View>
		</View>
	)

	// ====== phrasal player

	const phrasalPlayerControlsMemo = useMemo(
		() => <PhrasalPlayerControls {...{ playerRef, isPlaying }} />,
		[isPlaying, currentPhraseNum, duration]
	)

	const phrasesBlockMemo = useMemo(
		() => (
			<PhrasesBlock
				{...{
					phrases,
					phrasesTr,
					currentPhraseNum,
					playerRef
				}}
			/>
		),
		[currentPhraseNum, duration]
	)

	// ================

	if (props.playerRef) {
		return null // hidden player, for play phrases in exercises
	} else {
		if (isPhrasalPlayer) {
			return (
				<View
					style={{ height: screenHeight }}
					onLayout={({
						nativeEvent: {
							layout: { /* x, */ y /* width, height */ }
						}
					}) => {
						phrasesBlockPositionYRef.current = y
					}}
				>
					<View>{basicPlayer}</View>
					{phrasesBlockMemo}
					<View>{phrasalPlayerControlsMemo}</View>
				</View>
			)
		} else {
			return basicPlayer
		}
	}
}

export default Media
