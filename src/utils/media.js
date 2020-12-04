import { Audio } from 'expo-av'

const onAudioUpdate = soundObject => playbackStatus => {
    if (!playbackStatus.isPlaying && playbackStatus.positionMillis > 0)
        soundObject.unloadAsync()
}

export const playAudio = async(id, contentType) => {
    if (contentType[id]) {
        const soundObject = new Audio.Sound()
        await soundObject.loadAsync(contentType[id])
        soundObject.setOnPlaybackStatusUpdate(onAudioUpdate(soundObject))
        await soundObject.playAsync()
    } else {
        console.log(
            `Audio for ${contentType} ${id} doesn't exist`,
            `Please, contact the admin`
        )
    }
}