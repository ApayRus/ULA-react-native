import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { Video } from 'expo-av'
import PlayerControls from './PlayerBasicControls'
import { loadDataToPlayer } from './utils'
// === for phrasal media:
import { objectToArray } from '../../../utils/utils'
import PhrasalPlayerControls from './PlayerPhrasalControls'
import PhrasesBlock from './PhrasesBlock'

const Media = props => {
	// if siple media, from inText

	const { data: { path } = {} } = props

	// ===== if advanced media, from ChapterScreen/subchapter

	const {
		contentTypeDoc,
		contentTypeTrDoc,
		chapterId,
		subchapterId,
		showTranslation,
		navigation,
		trLang,
		scrollPageTo
	} = props

	const {
		title,
		param, // path/to/media
		content: { phrases = {} } = {}
	} = contentTypeDoc || {}

	const { title: titleTr, content: { phrases: phrasesTr = {} } = {} } =
		contentTypeTrDoc || {}

	const phrasesArray = objectToArray(phrases)
	const phrasesTrArray = objectToArray(phrasesTr)
	const isPhrasalPlayer = Boolean(phrasesArray.length)

	// ==================

	const mediaPath = path || param || `audios/timing/009-001`

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

	const playerRef = useRef()
	const mediaRef = useRef()
	const mediaSourceRef = useRef()
	const phrasesBlockPositionYRef = useRef()

	useEffect(() => {
		const initMedia = async () => {
			const { isVideo } = await loadDataToPlayer(
				mediaPath,
				/* mutable objects */
				playerRef,
				mediaRef,
				mediaSourceRef,
				/* for phrasal  player */
				phrasesArray
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

	const {
		currentTime,
		duration,
		isPlaying,
		rate,
		isVideo,
		currentPhraseNum
	} = playerState

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

	// ====== phrasal player

	const phrasalPlayerControlsMemo = useMemo(
		() => <PhrasalPlayerControls {...{ playerRef, isPlaying }} />,
		[isPlaying, currentPhraseNum, duration]
	)

	const phrasesBlockMemo = useMemo(
		() => (
			<PhrasesBlock
				{...{
					phrasesArray,
					phrasesTrArray,
					currentPhraseNum,
					playerRef,
					showTranslation,
					trLang
				}}
			/>
		),
		[currentPhraseNum, duration, showTranslation]
	)

	// ================

	return isPhrasalPlayer ? (
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
	) : (
		basicPlayer
	)
}

export default Media
