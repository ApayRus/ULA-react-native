import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { playAudio } from '../../../utils/playerShortAudios'
import content from '../../../utils/content'

const SoundedWord = props => {
	const { text = '', path, /* params */ chapterId, subchapterId } = props

	const handlePressSoundedWord = (text, path) => () => {
		const defaultPath = subchapterId
			? `${chapterId}/${subchapterId}/audios/${text}`
			: `${chapterId}/audios/${text}`
		const filePath = path || defaultPath
		const { file: audioFile } = content.getFilesByPathString(filePath) || {}
		playAudio(audioFile)
	}

	return (
		<TouchableOpacity
			onPress={handlePressSoundedWord(text.replace(/[,\. ]+/g, '_'), path)}
		>
			<Text style={[{ color: 'darkblue' }]}>{text}</Text>
		</TouchableOpacity>
	)
}

export default SoundedWord
