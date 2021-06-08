import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from 'react-native-elements'
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
		content: { phrases = [] }
	} = contentTypeDoc || {}

	const { content: { phrases: phrasesTrArray = [] } = {} } =
		contentTypeTrDoc || {}

	const { audios = {}, images = {} } = files || {}
	const contentTypeStyle = styles?.contentType?.[contentType] || {} // contentType styles

	const handlePlay = contentLineId => () => {
		const { file } = audios[`${contentLineId}`] || {}
		playAudio(file)
	}

	return (
		/* CONTAINER */
		<View style={contentTypeStyle.container}>
			{phrases.map((elem, index) => {
				const { text, id } = elem
				const { file: image } = images[`${id}`] || {}
				const { text: trText } = phrasesTrArray[index] || {}
				return index === 0 ? null : (
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
