import { Audio } from 'expo-av'
import mitt from 'mitt'
import { setPlayerState } from '../../../store/playerStateActions'
import store from '../../../store/rootReducer'
import contentFiles from '../../../../assets/contentFilesMap'
import PlayerBasic from './playerBasicClass'

const {
	content: { audios }
} = contentFiles

class PlayerPhrasal extends PlayerBasic {
	constructor(phrases, setPhrasalPlayerState) {
		// this.init(audioId, contentType)
		super()
	}

	events = mitt()

	/* 	onPlayAudioUpdate = playbackStatus => {
		const { positionMillis, didJustFinish, isPlaying } = playbackStatus
		// console.log('playbackStatus', playbackStatus)
		const currentTime = positionMillis / 1000
		const phrasesCount = this.phrases.length
		// const { isPlaying } = playbackStatus
		// this.isPlaying = isPlaying
		this.currentTime = currentTime
		const { end: currentPhaseEnd } = this.phrases[this.currentPhraseNum] || {}

		if (
			currentTime > currentPhaseEnd &&
			this.currentPhraseNum < phrasesCount - 1
		) {
			this.events.emit('phrase-out', this.phrases[this.currentPhraseNum])
			this.currentPhraseNum++
			this.events.emit('phrase-in', {
				...this.phrases[this.currentPhraseNum],
				order: this.currentPhraseNum
			})
		}
		if (didJustFinish) {
			this.events.emit('didJustFinish')
		}
		const currentPhraseNum = this.currentPhraseNum
		this.setPhrasalPlayerState(prevState => ({
			...prevState,
			currentPhraseNum,
			isPlaying
		}))
		this.setPlayerState(prevState => ({
			...prevState,
			isPlaying,
			currentTime
		}))
	} */

	/* 	onPlayPhraseAudioUpdate = playbackStatus => {
		const { positionMillis, isPlaying } = playbackStatus
		const currentTime = positionMillis / 1000
		this.currentTime = currentTime
		const { end: currentPhaseEnd } = this.phrases[this.currentPhraseNum] || {}

		if (currentTime >= currentPhaseEnd) {
			this.mediaObject.pauseAsync()
			this.events.emit('pause-phrase', {
				...this.phrases[this.currentPhraseNum],
				order: this.currentPhraseNum
			})
		}
		const currentPhraseNum = this.currentPhraseNum
		this.setPhrasalPlayerState(prevState => ({
			...prevState,
			currentPhraseNum,
			isPlaying
		}))
		this.setPlayerState(prevState => ({
			...prevState,
			isPlaying,
			currentTime
		}))
	} */

	play() {
		// this.mediaObject.setOnPlaybackStatusUpdate(this.onPlayAudioUpdate)
		this.mediaObject.playAsync()
		this.events.emit('play')
	}

	async playPhrase(phraseNum) {
		// this.mediaObject.setOnPlaybackStatusUpdate(this.onPlayPhraseAudioUpdate)
		this.currentPhraseNum = phraseNum
		const eventBody = {
			...this.phrases[this.currentPhraseNum],
			order: this.currentPhraseNum
		}
		this.events.emit('play-phrase', eventBody)
		this.events.emit('phrase-in', eventBody)
		const { start } = this.phrases[phraseNum]
		await this.mediaObject.setStatusAsync({ positionMillis: start * 1000 })
		this.mediaObject.playAsync()
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
}

export default PlayerPhrasal
