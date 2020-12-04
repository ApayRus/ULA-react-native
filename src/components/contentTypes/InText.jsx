import React from 'react'
import {
	ScrollView,
	View,
	TouchableOpacity,
	Alert,
	useWindowDimensions
} from 'react-native'
import { Image, Header, colors, Text } from 'react-native-elements'
import marked from 'marked'
import HTML from 'react-native-render-html'
import audios from '../../../assets/audios'
import { playAudio } from '../../utils/media'
import { convertInTextShortcutIntoTags } from '../../utils/manageTextContent'

function InText(props) {
	const {
		subchapterDoc,
		subchapterTrDoc = {},
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const { title, content } = subchapterDoc

	let html = marked(content)
	const contentWidth = useWindowDimensions().width

	const handlePress = (text, path) => () => {
		const fileName = path || text
		playAudio(fileName, audios['intext'])
	}

	html = convertInTextShortcutIntoTags(html)

	const inTextRenderer = htmlAttribs => {
		const { text, path } = htmlAttribs
		return (
			<TouchableOpacity
				onPress={handlePress(text, path)}
				key={`intext-${text}`}
			>
				<Text style={[globalStyles.body2, { color: 'darkblue' }]}>{text}</Text>
			</TouchableOpacity>
		)
	}

	return (
		<View style={{ padding: 5 }}>
			<Text h2 h2Style={globalStyles.subchapter}>
				{title}
			</Text>
			<HTML
				renderers={{ intext: { renderer: inTextRenderer, wrapper: 'Text' } }}
				html={html}
				contentWidth={contentWidth}
			/>
		</View>
	)
}

export default InText
