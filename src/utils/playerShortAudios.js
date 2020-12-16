import { Audio } from 'expo-av'
import audios from '../../assets/audios'
import { Alert } from 'react-native'

const onAudioUpdate = soundObject => playbackStatus => {
	if (!playbackStatus.isPlaying && playbackStatus.positionMillis > 0)
		if (!playbackStatus.isPlaying && playbackStatus.positionMillis > 0) {
			soundObject.unloadAsync()
		}
}

export const playAudio = async (id, contentType) => {
	const contentTypeAudios = audios[contentType] || {}

	if (contentTypeAudios[id]) {
		const soundObject = new Audio.Sound()
		await soundObject.loadAsync(contentTypeAudios[id])
		soundObject.setOnPlaybackStatusUpdate(onAudioUpdate(soundObject))
		await soundObject.playAsync()
	} else {
		const messages = [
			`Audio for ${contentType} ${id} doesn't exist`,
			`Please, contact the admin`
		]
		console.log(...messages)

		Alert(...messages)
	}
}
