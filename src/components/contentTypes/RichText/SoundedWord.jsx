import React from 'react'
import { Text } from 'react-native'
import { playAudio } from '../../../utils/playerShortAudios'
import content from '../../../utils/content'
import styles from '../../../styles'

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
			style={styles?.contentType?.richText?.soundedWord} // contentType styles
		>
			{text}
		</Text>
	)
}

export default SoundedWord
