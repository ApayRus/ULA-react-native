import { Audio } from 'expo-av'
import mitt from 'mitt'
import audios from '../../assets/audios'
import { dispatch } from 'redux'
import { setPlayerState } from '../store/playerStateActions'
import store from '../store/rootReducer'

class PhrasalPlayer {
    constructor(audioId, contentType, phrases) {
        // this.init(audioId, contentType)
    }

    mediaObject = null
    currentPhraseNum = 0
    currentTime = 0
    events = mitt()
    phrases = []

    onPlayAudioUpdate = playbackStatus => {
        const { positionMillis } = playbackStatus
        const currentTime = positionMillis / 1000
            // const { isPlaying } = playbackStatus
            // this.isPlaying = isPlaying
        this.currentTime = currentTime
        const { end: currentPhaseEnd } = this.phrases[this.currentPhraseNum] || {}

        if (currentTime > currentPhaseEnd) {
            this.events.emit('phrase-out', this.phrases[this.currentPhraseNum])
            this.currentPhraseNum++
                this.events.emit('phrase-in', {
                    ...this.phrases[this.currentPhraseNum],
                    order: this.currentPhraseNum
                })
        }
    }

    onPlayPhraseAudioUpdate = playbackStatus => {
        const { positionMillis } = playbackStatus
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
    }

    async init(mediaId, contentType, phrases) {
        const audioAsset = audios[contentType][mediaId]
        const mediaObject = new Audio.Sound()
        await mediaObject.loadAsync(audioAsset)

        await mediaObject.setStatusAsync({
            shouldCorrectPitch: true,
            pitchCorrectionQuality: 'High',
            progressUpdateIntervalMillis: 10
        })

        this.mediaObject = mediaObject
        this.phrases = phrases
        this.contentType = contentType
        this.mediaId = mediaId
        this.events.emit('isReady', this)
        console.log('phrasalPlayer initialized', this)
    }

    async play() {
        this.mediaObject.setOnPlaybackStatusUpdate(this.onPlayAudioUpdate)
        this.mediaObject.playAsync()
        this.events.emit('play')
    }
    async pause() {
        this.mediaObject.pauseAsync()
        this.events.emit('pause')
    }
    async setStatus(settings) {
        this.mediaObject.setStatusAsync({...settings })
    }
    async getStatus() {
        return this.mediaObject.getStatusAsync()
    }
    async playPhrase(phraseNum) {
        this.mediaObject.setOnPlaybackStatusUpdate(this.onPlayPhraseAudioUpdate)
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

const phrasalPlayer = new PhrasalPlayer()

phrasalPlayer.events.on('*', (type, event) => {
    const playEvents = ['play', 'play-phrase']
    const pauseEvents = ['pause', 'pause-phrase']
    if (playEvents.includes(type)) {
        store.dispatch(setPlayerState({ isPlaying: true }))
    }
    if (pauseEvents.includes(type)) {
        store.dispatch(setPlayerState({ isPlaying: false }))
    }
    if (type === 'phrase-in') {
        const { currentPhraseNum } = phrasalPlayer
        store.dispatch(setPlayerState({ currentPhraseNum }))
    }
})

export default phrasalPlayer