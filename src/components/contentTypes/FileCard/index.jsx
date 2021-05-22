import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from 'react-native-elements'
import { objectToArray } from '../../../utils/utils'
import styles from '../../../utils/styles'
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
		content: { phrases: phrasesObject = {} }
	} = contentTypeDoc
	const { content: { phrases: phrasesTrObject = {} } = {} } =
		contentTypeTrDoc || {}

	const { audios = {}, images = {} } = files || {}
	const phrasesArray = objectToArray(phrasesObject) // contentLines (words, phrases, etc)

	const contentTypeStyle = styles?.contentType?.[contentType] || {} // contentType styles

	const handlePlay = contentLineId => () => {
		const { file } = audios[`${contentLineId}`] || {}
		playAudio(file)
	}

	return (
		/* CONTAINER */
		<View style={contentTypeStyle.container}>
			{phrasesArray.map(elem => {
				const { id, text } = elem
				const { file: image } = images[`${id}`] || {}
				const { text: trText } = phrasesTrObject[elem.id] || {}
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
