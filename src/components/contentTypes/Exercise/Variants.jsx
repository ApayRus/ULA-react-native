import React, { useState } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text, Icon } from 'react-native-elements'
import content from '../../../utils/content'
import { playAudio } from '../../../utils/playerShortAudios'

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

	const variantBackground = userAnswerCorrectness => {
		const backgroundMap = {
			correct: { backgroundColor: 'rgba(0, 255, 0, 0.5)' },
			incorrect: { backgroundColor: 'rgba(255, 0, 0, 0.5)' },
			unknown: { backgroundColor: 'rgba(255, 255, 0, 0.5)' }
		}
		return backgroundMap[userAnswerCorrectness]
	}

	const playPhraseAudio = phraseId => {
		const filePath = `${chapterId}/${subchapterId}/audios/${phraseId}`
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

	const Variant = props => {
		const { phrase, index, requiredArray } = props
		const style = [styles.variant]

		const imagePath = `${chapterId}/${subchapterId}/images/${phrase.id}`
		const { file: imageSource } = content.getFilesByPathString(imagePath) || {}

		if (selectedIndex === index)
			style.push(variantBackground(userAnswerCorrectness))

		return (
			<TouchableOpacity
				onPress={handleVariantPress(phrase, index)}
				style={style}
			>
				{requiredArray.includes('image') && imageSource && (
					<Image source={imageSource} style={{ width: 50, height: 50 }} />
				)}
				{requiredArray.find(elem => elem.startsWith('text-')) && (
					<Text>{phrase.text}</Text>
				)}
				{requiredArray.includes('audio') && (
					<Text style={{ textAlign: 'center' }}>
						<Icon name='play-arrow' />
					</Text>
				)}
			</TouchableOpacity>
		)
	}

	return (
		<View style={styles.root}>
			{variants.map((phrase, index) => {
				return (
					<Variant
						key={`variant-${index}`}
						phrase={phrase}
						requiredArray={requiredArray}
						index={index}
					/>
				)
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
	},
	variant: {
		marginTop: 5,
		padding: 5,
		alignItems: 'center',
		width: '49%',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'grey'
	},
	selectedVariant: {
		// backgroundColor: 'yellow'
	}
}

export default Variants
