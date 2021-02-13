import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { Video } from 'expo-av'
import PlayerControls from './PlayerBasicControls'
import { loadDataToPlayer } from './utils'
// === for phrasal media:
import { objectToArray } from '../../../utils/utils'
import PhrasalPlayerControls from './PlayerPhrasalControls'
import PhrasesBlock from './PhrasesBlock'
import globalStyles from '../../../config/globalStyles'

const Media = props => {
	// if siple media, from inText

	const { data: { path } = {} } = props

	// ===== if advanced media, from ChapterScreen/subchapter

	const {
		subchapterDoc,
		subchapterTrDoc,
		chapterId,
		subchapterId,
		showTranslation,
		navigation
	} = props

	const {
		title,
		param, // path/to/media
		content: { phrases = {} } = {}
	} = subchapterDoc || {}

	const { title: titleTr, content: { phrases: phrasesTr = {} } = {} } =
		subchapterTrDoc || {}

	const phrasesArray = objectToArray(phrases)
	const phrasesTrArray = objectToArray(phrasesTr)

	// ==================

	const mediaPath = path || param || `audios/timing/009-001`

	const { width: screenWidth } = useWindowDimensions()

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
			playerRef.current.unload()
		}
	}, [])

	useEffect(() => {
		return () => {
			playerRef.current.unload()
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
					globalStyles,
					currentPhraseNum,
					playerRef,
					showTranslation
				}}
			/>
		),
		[currentPhraseNum, duration, showTranslation]
	)

	// ================

	return (
		<View>
			{basicPlayer}
			{phrasesArray.length ? (
				<>
					<>{phrasalPlayerControlsMemo}</>
					<>{phrasesBlockMemo}</>
				</>
			) : null}
		</View>
	)
}

export default Media
