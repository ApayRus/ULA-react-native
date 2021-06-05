import React, { useState } from 'react'
import { View } from 'react-native'
import content from '../../../utils/content'
import { playAudio } from '../../../utils/playerShortAudios'
import { prefixedIndex } from '../../../utils/utils'
import Variant from './Variant'

const Variants = props => {
	const {
		variants = [],
		requiredArray, // ['text-original' , 'audio' , 'image']
		setUserAnswer,
		resetUserAnswerCorrectness,
		userAnswerCorrectness,
		chapterId,
		subchapterId
	} = props
	const [selectedIndex, setSelectedIndex] = useState(-1)

	const playPhraseAudio = phraseId => {
		const filePath = `${prefixedIndex(+chapterId + 1)}/${prefixedIndex(
			+subchapterId + 1
		)}/audios/${prefixedIndex(phraseId)}`
		const { file: audioFile } = content.getFilesByPathString(filePath) || {}
		playAudio(audioFile, filePath)
	}

	const handleVariantPress = (phrase, index) => () => {
		resetUserAnswerCorrectness()
		if (requiredArray.includes('audio')) {
			playPhraseAudio(phrase.id)
		}
		if (selectedIndex === index) {
			setSelectedIndex(-1)
			setUserAnswer('')
		} else {
			setUserAnswer(variants[index].id)
			setSelectedIndex(index)
		}
	}

	return (
		<View style={styles.root}>
			{variants.map((phrase, index) => {
				const variantProps = {
					phrase,
					index,
					requiredArray,
					chapterId,
					subchapterId,
					selectedIndex,
					userAnswerCorrectness,
					handleVariantPress
				}

				return <Variant key={`variant-${index}`} {...variantProps} />
			})}
		</View>
	)
}

const styles = {
	root: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		margin: 5
	}
}

export default Variants
