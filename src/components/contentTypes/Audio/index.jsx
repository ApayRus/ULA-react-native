import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { Slider, Icon } from 'react-native-elements'
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
				animateTransitions
				animationType='timing'
				maximumTrackTintColor='#ccc'
				minimumValue={0}
				value={currentTime}
				maximumValue={duration}
				minimumTrackTintColor='#222'
				onSlidingComplete={() => console.log('onSlidingComplete()')}
				onSlidingStart={() => console.log('onSlidingStart()')}
				onValueChange={value => handleSeek(value)}
				orientation='horizontal'
				step={0.1}
				style={{ width: '80%', height: 200, alignSelf: 'center' }}
				thumbStyle={{ height: 20, width: 20 }}
				thumbProps={{
					children: (
						<Icon
							name='heartbeat'
							type='font-awesome'
							size={20}
							reverse
							containerStyle={{ bottom: 20, right: 20 }}
							color='#f50'
						/>
					)
				}}
				thumbTintColor='#0c0'
				thumbTouchSize={{ width: 40, height: 40 }}
				trackStyle={{ height: 10, borderRadius: 20 }}
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
