import { Audio } from 'expo-av'
import { Alert } from 'react-native'
import mitt from 'mitt'

class Player {
	constructor(audioFile, phrases) {
		// this.init(audioId, contentType)
	}

	mediaObject = null
	currentPhraseNum = 0
	currentTime = 0
	rate = 1
	events = mitt()

	onPlayAudioUpdate = playbackStatus => {
		const { positionMillis, isPlaying, didJustFinish } = playbackStatus
		const currentTime = positionMillis / 1000
		this.currentTime = currentTime

		this.setPlayerState(prevState => ({
			...prevState,
			isPlaying,
			currentTime
		}))

		if (didJustFinish) {
			this.events.emit('didJustFinish')
		}
	}

	async init(mode, source, setPlayerState, phrases, setPhrasalPlayerState) {
		if (source) {
			let mediaObject = {}
			if (mode === 'audio') {
				mediaObject = new Audio.Sound()
				await mediaObject.loadAsync(source, {
					shouldCorrectPitch: true,
					pitchCorrectionQuality: 'High',
					progressUpdateIntervalMillis: 100
				})
			}
			if (mode === 'video') {
				mediaObject = source // videoRef
			}
			mediaObject.setOnPlaybackStatusUpdate(this.onPlayAudioUpdate)

			this.setPlayerState = setPlayerState

			this.mediaObject = mediaObject
			this.phrases = phrases
			this.setPhrasalPlayerState = setPhrasalPlayerState

			this.events.emit('isReady', this)
			this.updateDuration()
		} else {
			const messages = [`Audio doesn't exist`, `Please, contact the admin`]
			console.log(...messages)
			Alert(...messages)
		}
	}

	async updateDuration() {
		// there isn't event as audioIsReady, that we can get duration
		// therefore we'll be trying until we get it.
		const { durationMillis } = await this.getStatus()
		if (durationMillis) {
			const duration = durationMillis / 1000
			this.duration = duration
			this.setPlayerState(prevState => ({
				...prevState,
				duration
			}))
		} else {
			setTimeout(() => {
				this.updateDuration()
			}, 1000)
		}
	}

	async play() {
		this.mediaObject.playAsync()
		this.events.emit('play')
	}
	async pause() {
		this.mediaObject.pauseAsync()
		this.events.emit('pause')
	}

	playPlus10() {
		this.setStatus({ positionMillis: (this.currentTime + 10) * 1000 })
	}
	playMinus10() {
		this.setStatus({ positionMillis: (this.currentTime - 10) * 1000 })
	}
	seek(time) {
		this.setPlayerState(prevState => ({ ...prevState, time }))
		this.setStatus({ positionMillis: time * 1000 })
	}
	changeRate() {
		this.rate = this.rate + 0.25
		if (this.rate > 2) this.rate = 0.25
		const rate = this.rate
		this.setStatus({
			rate,
			shouldCorrectPitch: true,
			pitchCorrectionQuality: 'Medium'
		})
		this.setPlayerState(prevState => ({ ...prevState, rate }))
	}
	unload() {
		if (this.mediaObject) {
			this.mediaObject.unloadAsync()
			this.mediaObject = null
		}
		this.events.all.clear()
	}

	async setStatus(settings) {
		this.mediaObject.setStatusAsync({ ...settings })
	}
	async getStatus() {
		return this.mediaObject.getStatusAsync()
	}
}

export default Player
