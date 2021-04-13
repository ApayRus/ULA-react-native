import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

const Variants = props => {
	const {
		variants = [],
		setUserAnswer,
		resetUserAnswerCorrectness,
		userAnswerCorrectness
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

	const handleVariantPress = index => () => {
		resetUserAnswerCorrectness()
		if (selectedIndex === index) {
			setSelectedIndex(-1)
			setUserAnswer('')
		} else {
			setUserAnswer(variants[index].id)
			setSelectedIndex(index)
		}
	}

	const Variant = ({ title, index }) => {
		const style = [styles.variant]
		if (selectedIndex === index)
			style.push(variantBackground(userAnswerCorrectness))

		return (
			<TouchableOpacity onPress={handleVariantPress(index)} style={style}>
				<Text>{title}</Text>
			</TouchableOpacity>
		)
	}

	return (
		<View style={styles.root}>
			{variants.map((phrase, index) => {
				return (
					<Variant key={`variant-${index}`} title={phrase.text} index={index} />
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
