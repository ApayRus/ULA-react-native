import { Audio } from 'expo-av'
import mitt from 'mitt'
import audios from '../../../../assets/audios'
import { setPlayerState } from '../../../store/playerStateActions'
import store from '../../../store/rootReducer'

class Player {
    constructor(audioId, contentType, phrases) {
        // this.init(audioId, contentType)
    }

    mediaObject = null
    currentPhraseNum = 0
    currentTime = 0
    events = mitt()

    onPlayAudioUpdate = playbackStatus => {
        const {
            positionMillis,
            durationMillis,
            isPlaying,
            didJustFinish
        } = playbackStatus
        // console.log('playbackStatus', playbackStatus)
        const currentTime = positionMillis / 1000
        const playingProgressPercent = (positionMillis / durationMillis) * 100
            // const { isPlaying } = playbackStatus
            // this.isPlaying = isPlaying
        this.currentTime = currentTime

        store.dispatch(
            setPlayerState({ isPlaying, currentTime, playingProgressPercent })
        )

        if (didJustFinish) {
            this.events.emit('didJustFinish')
        }
    }

    async init(mediaId, contentType) {
        const audioAsset = audios[contentType][mediaId]
        const mediaObject = new Audio.Sound()
        await mediaObject.loadAsync(audioAsset, {
            shouldCorrectPitch: true,
            pitchCorrectionQuality: 'High',
            progressUpdateIntervalMillis: 100
        })

        this.mediaObject = mediaObject
        this.contentType = contentType
        this.mediaId = mediaId
        this.events.emit('isReady', this)
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

    playPlus10() {
        this.setStatus({ positionMillis: (this.currentTime + 10) * 1000 })
    }
    playMinus10() {
        this.setStatus({ positionMillis: (this.currentTime - 10) * 1000 })
    }

    async setStatus(settings) {
        this.mediaObject.setStatusAsync({...settings })
    }
    async getStatus() {
        return this.mediaObject.getStatusAsync()
    }
}

const player = new Player()

player.events.on('isReady', () => {
    setTimeout(() => {
        player.getStatus().then(status => {
            const { durationMillis } = status
            const duration = durationMillis / 1000
            store.dispatch(setPlayerState({ duration }))
        })
    }, 1000)
})

export default player