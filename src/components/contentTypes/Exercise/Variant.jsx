import React, { useMemo } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { Text, Icon } from 'react-native-elements'
import content from '../../../utils/content'

const Variant = props => {
	const {
		phrase,
		index,
		requiredArray,
		chapterId,
		subchapterId,
		selectedIndex,
		userAnswerCorrectness,
		handleVariantPress
	} = props
	const style = [styles.variant]

	const imagePath = `${chapterId}/${subchapterId}/images/${phrase.id}`
	const { file: imageSource } = content.getFilesByPathString(imagePath) || {}
	const memoImage = useMemo(
		() => <Image source={imageSource} style={{ width: 50, height: 50 }} />,
		[phrase.id]
	)

	if (selectedIndex === index)
		style.push(variantBackground(userAnswerCorrectness))

	return (
		<TouchableOpacity onPress={handleVariantPress(phrase, index)} style={style}>
			{requiredArray.includes('image') && imageSource && memoImage}
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

const variantBackground = userAnswerCorrectness => {
	const backgroundMap = {
		correct: { backgroundColor: 'rgba(0, 255, 0, 0.5)' },
		incorrect: { backgroundColor: 'rgba(255, 0, 0, 0.5)' },
		unknown: { backgroundColor: 'rgba(255, 255, 0, 0.5)' }
	}
	return backgroundMap[userAnswerCorrectness]
}

const styles = {
	variant: {
		marginTop: 5,
		padding: 5,
		alignItems: 'center',
		width: '49%',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'grey'
	}
}

export default Variant
