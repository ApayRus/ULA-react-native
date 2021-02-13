import React from 'react'
import { View, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Text } from 'react-native-elements'
import HTML, { defaultHTMLElementModels } from 'react-native-render-html'
import Quiz from '../Quiz'
import Media from '../Media'
import { playAudio } from '../../../utils/playerShortAudios'
import { prefixedIndex } from '../../../utils/utils'
import content from '../../../utils/content'
import globalStyles from '../../../config/globalStyles'

function InText(props) {
	const {
		subchapterDoc,
		subchapterTrDoc,
		chapterId,
		subchapterId,
		showTranslation,
		contentTypeDoc,
		trLang
	} = props

	const {
		title,
		content: subchapterContent // different type of blocks: 'text', 'quiz', 'media'
	} = subchapterDoc

	const contentWidth = useWindowDimensions().width

	const handlePress = (text, path) => () => {
		const filePath = path || `${chapterId}/${subchapterId}/audios/${text}`
		const { file: audioFile } = content.getFilesByPathString(filePath) || {}
		playAudio(audioFile)
	}

	const inTextRenderer = ({ tnode }) => {
		const {
			attributes: { text, path }
		} = tnode
		return (
			<TouchableOpacity
				onPress={handlePress(text, path)}
				key={`intext-${text}`}
			>
				<Text style={[globalStyles.body2, { color: 'darkblue' }]}>{text}</Text>
			</TouchableOpacity>
		)
	}
	inTextRenderer.model = defaultHTMLElementModels.span

	return (
		<View style={{ padding: 5 }}>
			<Text h2 h2Style={globalStyles.subchapter}>
				{title}
			</Text>
			{subchapterContent.map((elem, index) => {
				const { label, text: html, data } = elem
				let quizIndex = 0
				if (label === 'text') {
					return (
						<HTML
							renderers={{
								intext: inTextRenderer
							}}
							key={`${label}-${index}`}
							source={{ html }}
							contentWidth={contentWidth}
						/>
					)
				}
				if (label === 'quiz') {
					quizIndex++
					const quizId = prefixedIndex(quizIndex)
					const quizProps = { chapterId, subchapterId, quizId, data }
					return <Quiz key={`${label}-${index}`} {...quizProps} />
				}
				if (label === 'media') {
					return <Media key={`${label}-${index}`} data={data} />
				}
			})}
		</View>
	)
}

export default InText
