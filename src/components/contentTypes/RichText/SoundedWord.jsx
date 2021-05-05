import React from 'react'
import { Text } from 'react-native'
import { playAudio } from '../../../utils/playerShortAudios'
import content from '../../../utils/content'
import contentTypeStyles from '../../../config/styles/contentType'

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
		<Text
			onPress={handlePressSoundedWord(text.replace(/[,\. ]+/g, '_'), path)}
			style={contentTypeStyles.text.soundedWord}
		>
			{text}
		</Text>
	)
}

export default SoundedWord
