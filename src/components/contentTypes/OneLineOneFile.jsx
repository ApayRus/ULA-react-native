import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, Image } from 'react-native-elements'
import { objectToArray, prefixedIndex } from '../../utils/utils'
import audios from '../../../assets/audios'
import images from '../../../assets/images'
import { playAudio } from '../../utils/media'
import marked from 'marked'

function OneLineOneFile(props) {
	const {
		subchapterDoc,
		contentType,
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
	const { style: contentTypeStyle, type } = contentType
	const { content: rawContentTr } = subchapterTrDoc
	const content = parseContent(rawContent)
	const contentTr = parseContent(rawContentTr)

	const contentLines = objectToArray(content)
	const contentTypeAudios = audios[type] || {}
	const contentTypeImages = images[type] || {}

	const handlePlay = contentLineId => e =>
		playAudio(contentLineId, contentTypeAudios)

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
				{contentLines.map(elem => {
					const contentLineId = chapterId + '-' + elem.id
					const image = contentTypeImages[contentLineId]
					const trText = subchapterTrDoc ? contentTr[elem.id]?.text : ''
					return (
						<TouchableOpacity
							onPress={handlePlay(contentLineId)}
							key={`${type}-${contentLineId}`}
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
