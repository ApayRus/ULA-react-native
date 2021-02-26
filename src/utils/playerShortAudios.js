import { Audio } from 'expo-av'
import { Alert } from 'react-native'

const onAudioUpdate = soundObject => playbackStatus => {
	if (!playbackStatus.isPlaying && playbackStatus.positionMillis > 0) {
		soundObject.unloadAsync()
	}
}

/**
 *
 * @param {*} audioFile - require('../file.mp3')
 * @param {string[]} pathArray - [chapterId, subchapterId, lineId]
 */
export const playAudio = async (audioFile, pathArray) => {
	if (audioFile) {
		const soundObject = new Audio.Sound()
		await soundObject.loadAsync(audioFile)
		soundObject.setOnPlaybackStatusUpdate(onAudioUpdate(soundObject))
		await soundObject.playAsync()
	} else {
		const messages = [
			`Audio for ${pathArray} doesn't exist`,
			`Please, contact the admin`
		]
		console.log(...messages)
		Alert(...messages)
	}
}
