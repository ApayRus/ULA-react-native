import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, Icon } from 'react-native-elements'
import content from '../../../utils/content'
import { playAudio } from '../../../utils/playerShortAudios'

const Variants = props => {
	const {
		variants = [],
		variantType, // text | audio | image
		setUserAnswer,
		resetUserAnswerCorrectness,
		userAnswerCorrectness,
		chapterId,
		subchapterId
	} = props
	const [selectedIndex, setSelectedIndex] = useState(-1)

	const variantBackground = userAnswerCorrectness => {
		const backgroundMap = {
			correct: { backgroundColor: 'green' },
			incorrect: { backgroundColor: 'red' },
			unknown: { backgroundColor: 'yellow' }
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
		if (variantType === 'audio') {
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
		const { phrase, index, type } = props
		const style = [styles.variant]
		if (selectedIndex === index)
			style.push(variantBackground(userAnswerCorrectness))

		const getVariantIntext = type => {
			if (type === 'text') return <Text>{phrase.text}</Text>
			if (type === 'audio')
				return (
					<Text style={{ textAlign: 'center' }}>
						<Icon name='play-arrow' />
					</Text>
				)
		}

		return (
			<TouchableOpacity
				onPress={handleVariantPress(phrase, index)}
				style={style}
			>
				{getVariantIntext(type)}
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
						type={variantType}
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
		textAlign: 'center',
		width: '49%',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'grey'
	},
	selectedVariant: {
		backgroundColor: 'yellow'
	}
}

export default Variants
