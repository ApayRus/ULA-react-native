import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from 'react-native-elements'
import { objectToArray } from '../../utils/utils'
import { playAudio } from '../../utils/playerShortAudios'
import contentTypeStyles from '../../config/styles/contentType'

function OneLineOneFile(props) {
	const {
		contentTypeDoc,
		subchapterTrDoc,
		contentType,
		files,
		showTranslation
	} = props

	const { content: phrasesObject = {} } = contentTypeDoc
	const { content: phrasesTrObject = {} } = subchapterTrDoc

	const { audios = {}, images = {} } = files || {}
	const phrasesArray = objectToArray(phrasesObject) // contentLines (words, phrases, etc)

	const contentTypeStyle = contentTypeStyles[contentType] || {}

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

export default OneLineOneFile
