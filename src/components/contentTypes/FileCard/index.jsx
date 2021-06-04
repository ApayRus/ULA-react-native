import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from 'react-native-elements'
import { prefixedIndex } from '../../../utils/utils'
import styles from '../../../styles'
import { playAudio } from '../../../utils/playerShortAudios'

function fileCard(props) {
	const {
		contentTypeDoc,
		contentTypeTrDoc,
		contentType,
		files,
		showTranslation
	} = props

	const {
		content: { phrases: phrasesArray = [] }
	} = contentTypeDoc || {}

	const { content: { phrases: phrasesTrArray = [] } = {} } =
		contentTypeTrDoc || {}

	const { audios = {}, images = {} } = files || {}
	// const phrasesArray = objectToArray(phrasesObject) // contentLines (words, phrases, etc)
	console.log('audios')
	console.log(audios)

	const contentTypeStyle = styles?.contentType?.[contentType] || {} // contentType styles

	const handlePlay = contentLineId => () => {
		const { file } = audios[`${contentLineId}`] || {}
		playAudio(file)
	}
	phrasesArray.shift()
	phrasesTrArray.shift()
	return (
		/* CONTAINER */
		<View style={contentTypeStyle.container}>
			{phrasesArray.map((elem, index) => {
				const { text } = elem
				const id = prefixedIndex(index + 1)
				const { file: image } = images[`${id}`] || {}
				const { text: trText } = phrasesTrArray[index] || {}
				return (
					<TouchableOpacity onPress={handlePlay(id)} key={`item-${id}`}>
						{/* ITEM */}
						<View style={contentTypeStyle.item}>
							{/* IMAGE */}
							{image && <Image source={image} style={contentTypeStyle.image} />}
							{/* textContainer */}
							<View style={contentTypeStyle.textContainer}>
								{/* TEXT */}
								<Text style={contentTypeStyle.text}>{text}</Text>
								{showTranslation && (
									/* trText */
									<Text style={contentTypeStyle.trText}>{trText}</Text>
								)}
							</View>
						</View>
					</TouchableOpacity>
				)
			})}
		</View>
	)
}

export default fileCard
