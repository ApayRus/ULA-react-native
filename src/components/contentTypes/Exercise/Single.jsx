import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import Randomizer from '../../../utils/exercises'
import content from '../../../utils/content'
import { playAudio } from '../../../utils/playerShortAudios'
import { prefixedIndex } from '../../../utils/utils'

const Exercise = props => {
	const {
		sourceChapterId: chapterId,
		sourceSubchapterId: subchapterId,
		type
		// phraseIndexes = []
	} = props // phraseIndexes - [8, 20, 2, 15]

	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [randomPhrases, setRandomPhrases] = useState({})
	const [checked, setChecked] = useState(false) // check your answer right or not

	useEffect(() => {
		const randomizer = new Randomizer(0) // random-js
		const { phraseIndexes = [] } = props
		const [correctIndex] = phraseIndexes
		const [correctPhrase] = content.getPhrases(chapterId, subchapterId, [
			correctIndex
		])

		const [correctPhraseTr] = content.getPhrasesTr(chapterId, subchapterId, [
			correctIndex
		])

		const phrases = content.getPhrases(
			chapterId,
			subchapterId,
			randomizer.shuffle(phraseIndexes)
		)

		const phrasesTr = content.getPhrasesTr(
			chapterId,
			subchapterId,
			randomizer.shuffle(phraseIndexes)
		)

		setRandomPhrases({
			phrases,
			phrasesTr,
			correctPhrase,
			correctPhraseTr,
			correctIndex
		})
	}, [])

	const {
		phrases = [],
		phrasesTr = [],
		correctPhrase,
		correctPhraseTr
	} = randomPhrases

	const handleVariantPress = index => () => {
		setSelectedIndex(index)
		setChecked(false)
	}

	const handleCheck = () => {
		setChecked(true)
	}

	const handlePlay = () => {
		const audioId = prefixedIndex(randomPhrases.correctIndex)
		const filePath = `${chapterId}/${subchapterId}/audios/${audioId}`
		const { file: audioFile } = content.getFilesByPathString(filePath) || {}
		playAudio(audioFile, filePath)
	}

	const Variant = ({ title, index }) => {
		const style = [styles.variant]
		if (selectedIndex === index) style.push(checkedBackground(checked))

		return (
			<TouchableOpacity onPress={handleVariantPress(index)} style={style}>
				<Text>{title}</Text>
			</TouchableOpacity>
		)
	}

	const isAnswerRight = selectedIndex =>
		phrases[selectedIndex]?.text === correctPhrase?.text

	const checkedIconMap = {
		isRight: { name: 'done', color: 'green' },
		isWrong: { name: 'clear', color: 'red' },
		isUnknown: { name: 'help-outline', color: 'grey' }
	}
	const checkedBackgroundMap = {
		isRight: { backgroundColor: 'green' },
		isWrong: { backgroundColor: 'red' },
		isUnknown: { backgroundColor: 'yellow' }
	}
	const checkedIcon = checked => {
		if (!checked) {
			return checkedIconMap['isUnknown']
		} else {
			return isAnswerRight(selectedIndex)
				? checkedIconMap['isRight']
				: checkedIconMap['isWrong']
		}
	}
	const checkedBackground = checked => {
		if (!checked) {
			return checkedBackgroundMap['isUnknown']
		} else {
			return isAnswerRight(selectedIndex)
				? checkedBackgroundMap['isRight']
				: checkedBackgroundMap['isWrong']
		}
	}

	return (
		<View>
			<View style={[styles.container]}>
				<View style={[styles.playButtonContainer]}>
					<TouchableOpacity style={[styles.playButton]} onPress={handlePlay}>
						<Icon name='play-arrow' color='red' size={24} />
					</TouchableOpacity>
				</View>
				<View style={[styles.variantsRow]}>
					{phrases.map((phrase, index) => (
						<Variant
							key={`variant-${index}`}
							title={phrase.text}
							index={index}
						/>
					))}
				</View>
			</View>
			<View>
				{/* <View style={{ height: 5 }} /> */}
				<Button
					style={{ alignSelf: 'flex-end' }}
					iconRight
					onPress={handleCheck}
					icon={checkedIcon(checked)}
					size='small'
					type='outline'
					title='Check'
					containerStyle={{ margin: 5 }}
				/>
			</View>
		</View>
	)
}

const styles = {
	container: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		paddingRight: 5
	},
	playButtonContainer: {
		flex: 1,
		flexDirection: 'column'
	},
	playButton: {
		borderWidth: 3,
		borderColor: 'red',
		borderStyle: 'solid',
		borderRadius: 20,
		alignSelf: 'center'
	},
	variantsRow: {
		flex: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
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

export default Exercise
