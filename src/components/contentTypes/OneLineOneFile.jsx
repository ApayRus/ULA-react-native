import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from 'react-native-elements'
import { objectToArray } from '../../utils/utils'
import { playAudio } from '../../utils/playerShortAudios'

function OneLineOneFile(props) {
	const {
		subchapterDoc,
		subchapterTrDoc,
		contentTypeDoc,
		globalStyles,
		files,
		showTranslation
	} = props

	const { title, content: phrasesObject = {} } = subchapterDoc
	const { content: phrasesTrObject = {} } = subchapterTrDoc
	const { audios = {}, images = {} } = files || {}

	const { style: contentTypeStyle, type: contentType } = contentTypeDoc

	const phrasesArray = objectToArray(phrasesObject) // contentLines (words, phrases, etc)

	const handlePlay = contentLineId => () => {
		playAudio(audios[`${contentLineId}`])
	}

	return (
		<View style={{ paddingLeft: 5, paddingRight: 5 }}>
			<Text h2 h2Style={globalStyles.subchapter}>
				{title}
			</Text>
			<View
				style={[
					{
						flex: 1,
						flexDirection: 'column',
						padding: 10
					},
					globalStyles.align,
					contentTypeStyle.container
				]}
			>
				{phrasesArray.map(elem => {
					const { id: contentLineId } = elem
					const image = images[`${contentLineId}`]
					const { text: trText } = phrasesTrObject[elem.id] || {}
					return (
						<TouchableOpacity
							onPress={handlePlay(contentLineId)}
							key={`${contentType}-${contentLineId}`}
							style={[
								{
									flex: 1
								},
								globalStyles.align,
								contentTypeStyle.item
							]}
						>
							{image && (
								<Image
									source={image}
									style={[
										{ width: 100, height: 100, resizeMode: 'contain' },
										contentTypeStyle.image
									]}
								/>
							)}
							<View style={[{ flex: 1 }]}>
								<Text
									style={[
										{ flex: 1 },
										globalStyles.body1,
										contentTypeStyle.text
									]}
								>
									{elem.text}
								</Text>
								<Text
									style={[
										{ flex: 1 },
										globalStyles.translation,
										contentTypeStyle.translation,
										{ opacity: showTranslation ? 1 : 0 }
									]}
								>
									{trText}
								</Text>
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
		</View>
	)
}

export default OneLineOneFile
