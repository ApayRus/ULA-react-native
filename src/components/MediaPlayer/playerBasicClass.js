import { Alert } from 'react-native'
import mitt from 'mitt'

class Player {
	constructor(props) {
		const { mediaRef, secondsInterval } = props
		if (mediaRef.current) {
			this.mediaObject = mediaRef.current
			this.updateDuration()
			this.events = mitt()
			this.currentTime = 0
			this.rate = 1
			this.mediaObject.setOnPlaybackStatusUpdate(this.handleOnPlayAudioUpdate)
			if (secondsInterval) {
				this.secondsInterval = secondsInterval
				this.currentTime = secondsInterval.start
				this.mediaObject.setStatusAsync({
					positionMillis: this.currentTime * 1000
				})
				this.mediaObject.setOnPlaybackStatusUpdate(
					this.handleOnPlayAudioUpdateSecondsInterval
				)
			}
		} else {
			const messages = [`Audio doesn't exist`, `Please, contact the admin`]
			console.log(...messages)
			Alert(...messages)
		}
	}

	handleOnPlayAudioUpdate = playbackStatus => {
		const { positionMillis, isPlaying } = playbackStatus
		const currentTime = positionMillis / 1000
		this.currentTime = currentTime
		this.events.emit('isPlaying', isPlaying)
		this.events.emit('currentTime', currentTime)
	}
	// if we have secondsInterval
	handleOnPlayAudioUpdateSecondsInterval = playbackStatus => {
		const { positionMillis, isPlaying } = playbackStatus
		const currentTime = positionMillis / 1000
		this.currentTime = currentTime
		this.events.emit('isPlaying', isPlaying)
		this.events.emit('currentTime', currentTime)
		if (currentTime >= this.secondsInterval.end) {
			this.pause()
			this.events.emit('didJustFinish', true)
		}
	}

	async updateDuration() {
		// there isn't event as audioIsReady, that we can get duration
		// therefore we'll be trying until we get it.
		const { durationMillis } = await this.getStatus()
		if (durationMillis) {
			const duration = durationMillis / 1000
			this.duration = duration
			this.events.emit('duration', duration)
		} else {
			setTimeout(() => {
				this.updateDuration()
			}, 1000)
		}
	}

	async play() {
		this.mediaObject.playAsync()
	}
	async pause() {
		this.mediaObject.pauseAsync()
	}

	playPlus10() {
		this.setStatus({ positionMillis: (this.currentTime + 10) * 1000 })
	}
	playMinus10() {
		this.setStatus({ positionMillis: (this.currentTime - 10) * 1000 })
	}
	seekStart() {
		this.shouldPlay = this.isPlaying
		this.pause()
	}
	seek(time) {
		this.setStatus({ positionMillis: time * 1000 })
		this.events.emit('currentTime', time)
	}
	changeRate() {
		this.rate = this.rate + 0.25
		if (this.rate > 2) this.rate = 0.25
		const rate = this.rate
		this.setStatus({
			rate,
			shouldCorrectPitch: true,
			pitchCorrectionQuality: 'High'
		})
		this.events.emit('rate', rate)
	}
	unload() {
		if (this.mediaObject) {
			this.mediaObject.unloadAsync()
			this.mediaObject = null
			this.events.all.clear()
		}
	}

	async setStatus(settings) {
		this.mediaObject.setStatusAsync({ ...settings })
	}
	async getStatus() {
		return this.mediaObject.getStatusAsync()
	}
}

export default Player
