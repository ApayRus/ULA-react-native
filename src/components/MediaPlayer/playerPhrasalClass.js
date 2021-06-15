import PlayerBasic from './playerBasicClass'

class PlayerPhrasal extends PlayerBasic {
	constructor(props) {
		super(props)
		const { phrases } = props
		this.currentPhraseNum = 0
		this.phrases = phrases
		this.phrasesCount = phrases.length
		if (this.secondsInterval) {
			const zeroPhrase = { start: 0, end: 0, text: '' }
			const { start, end } = this.secondsInterval
			this.phrases = [
				zeroPhrase,
				...this.phrases.filter(elem => elem.start >= start && elem.end <= end)
			]
		}
		this.setStatus({ progressUpdateIntervalMillis: 100 })
	}

	onPlayAudioUpdate = playbackStatus => {
		const { positionMillis, didJustFinish, isPlaying } = playbackStatus
		const currentTime = positionMillis / 1000
		this.isPlaying = isPlaying
		this.currentTime = currentTime
		const { end: currentPhaseEnd } = this.phrases[this.currentPhraseNum] || {}

		if (
			currentTime > currentPhaseEnd &&
			this.currentPhraseNum < this.phrasesCount - 1
		) {
			this.currentPhraseNum++
		}

		this.events.emit('isPlaying', isPlaying)
		this.events.emit('currentTime', currentTime)
		this.events.emit('currentPhraseNum', this.currentPhraseNum)
		this.events.emit('didJustFinish', didJustFinish)
	}

	onPlayAudioUpdateSecondsInterval = async playbackStatus => {
		const { positionMillis, didJustFinish, isPlaying } = playbackStatus
		const currentTime = positionMillis / 1000
		this.isPlaying = isPlaying
		this.currentTime = currentTime
		const { end: currentPhaseEnd } = this.phrases[this.currentPhraseNum] || {}

		if (
			currentTime > currentPhaseEnd &&
			this.currentPhraseNum < this.phrasesCount - 1
		) {
			this.currentPhraseNum++
		}
		if (currentTime >= this.secondsInterval.end) {
			await this.pause()
			this.mediaObject.setOnPlaybackStatusUpdate(() => {})
			this.events.emit('isPlaying', false)
			this.events.emit('didJustFinished', true)
		}
		this.events.emit('isPlaying', isPlaying)
		this.events.emit('currentTime', currentTime)
		this.events.emit('currentPhraseNum', this.currentPhraseNum)
		this.events.emit('didJustFinish', didJustFinish)
	}

	onPlayPhraseAudioUpdate = async playbackStatus => {
		const { positionMillis, isPlaying } = playbackStatus
		const currentTime = positionMillis / 1000
		this.currentTime = currentTime
		const { end: currentPhaseEnd } = this.phrases[this.currentPhraseNum] || {}

		this.events.emit('isPlaying', isPlaying)
		this.events.emit('currentTime', currentTime)
		this.events.emit('currentPhraseNum', this.currentPhraseNum)

		if (currentTime >= currentPhaseEnd) {
			await this.pause()
			this.mediaObject.setOnPlaybackStatusUpdate(() => {})
			this.events.emit('isPlaying', false)
		}
	}

	play() {
		if (this.secondsInterval) {
			this.mediaObject.setOnPlaybackStatusUpdate(
				this.onPlayAudioUpdateSecondsInterval
			)
		} else {
			this.mediaObject.setOnPlaybackStatusUpdate(this.onPlayAudioUpdate)
		}
		this.mediaObject.playAsync()
		this.events.emit('play')
	}

	async playPhrase(phraseNum) {
		this.currentPhraseNum = phraseNum
		const { start } = this.phrases[phraseNum]
		this.currentTime = start
		await this.mediaObject.setStatusAsync({
			positionMillis: start * 1000,
			shouldPlay: true
		})
		this.mediaObject.setOnPlaybackStatusUpdate(this.onPlayPhraseAudioUpdate)
	}

	async playNextPhrase() {
		this.currentPhraseNum++
		if (this.currentPhraseNum > this.phrases.length - 1) {
			this.currentPhraseNum = this.phrases.length - 1
			return
		}
		if (this.currentTime === 0) {
			this.playPhrase(0)
		}
		this.playPhrase(this.currentPhraseNum)
	}
	async playPreviousPhrase() {
		this.currentPhraseNum--
		if (this.currentPhraseNum < 0) {
			this.currentPhraseNum = 0
			return
		}
		this.playPhrase(this.currentPhraseNum)
	}
	async playCurrentPhrase() {
		// replay
		this.playPhrase(this.currentPhraseNum)
	}

	seek(time) {
		this.setStatus({ positionMillis: time * 1000, shouldPlay: this.shouldPlay })
		this.events.emit('currentTime', time)
		this.currentPhraseNum = this.findCurrentPhraseNum(time)
		this.events.emit('currentPhraseNum', this.currentPhraseNum)
	}
	findCurrentPhraseNum(time) {
		const findIndex = (array, time) => {
			return (
				array.findIndex((elem, index, array) => {
					const { end: thisEnd } = elem
					const { end: nextEnd } = array[index + 1] || 100000000
					return time >= thisEnd && time <= nextEnd
				}) + 1
			)
		}
		const findedIndex = findIndex(this.phrases, time)

		return findedIndex ? findedIndex : this.phrases.length - 1
	}
}

export default PlayerPhrasal
