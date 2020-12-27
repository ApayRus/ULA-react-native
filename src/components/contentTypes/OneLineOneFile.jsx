import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from 'react-native-elements'
import { objectToArray } from '../../utils/utils'
import images from '../../../assets/images'
import { playAudio } from '../../utils/playerShortAudios'
import content from '../../utils/content'

function OneLineOneFile(props) {
	const {
		contentTypeDoc,
		globalStyles,
		chapterId,
		subchapterId,
		trLang,
		showTranslation
	} = props

	const subchapterDoc = content.getSubchapter(chapterId, subchapterId)
	const subchapterTrDoc = content.getSubchapterTr(
		trLang,
		chapterId,
		subchapterId
	)

	const { title, content: phrasesObject = {} } = subchapterDoc
	const { content: phrasesTrObject = {} } = subchapterTrDoc

	const { style: contentTypeStyle, type: contentType } = contentTypeDoc

	const phrasesArray = objectToArray(phrasesObject) // contentLines (words, phrases, etc)
	const contentTypeImages = images[contentType] || {}

	const handlePlay = contentLineId => e => playAudio(contentLineId, contentType)

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
					const contentLineId = chapterId + '-' + elem.id
					const image = contentTypeImages[contentLineId]
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
