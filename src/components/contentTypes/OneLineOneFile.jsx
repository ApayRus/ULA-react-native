import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from 'react-native-elements'
import { objectToArray, prefixedIndex } from '../../utils/utils'
import images from '../../../assets/images'
import { playAudio } from '../../utils/playerShortAudios'
import marked from 'marked'

function OneLineOneFile(props) {
	const {
		subchapterDoc,
		contentTypeDoc,
		subchapterTrDoc = {},
		globalStyles,
		chapterId,
		showTranslation
	} = props

	marked.use({
		renderer: {
			paragraph: text => text //by default renderer returns <p></p> for any text line
		},
		smartypants: true // additional typography like long tire -- , etc
	})

	const parseContent = pText => {
		if (!pText) return {}
		const rowsArray = pText.split('\n')
		const info = rowsArray.reduce((prev, item, index) => {
			const rowIndex = prefixedIndex(index + 1)
			const text = marked(item.trim())
			return { ...prev, [rowIndex]: { text } }
		}, {})
		return info
	}

	const { title, content: rawContent } = subchapterDoc
	const { style: contentTypeStyle, type: contentType } = contentTypeDoc
	const { content: rawContentTr } = subchapterTrDoc
	const phrasesObject = parseContent(rawContent)
	const phrasesTrObject = parseContent(rawContentTr)

	const phrasesArray = objectToArray(phrasesObject) // contentLines (words, phrases, etc)
	const contentTypeImages = images[contentType] || {}

	console.log('phrases', phrasesArray)

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
					const trText = subchapterTrDoc ? phrasesTrObject[elem.id]?.text : ''
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
