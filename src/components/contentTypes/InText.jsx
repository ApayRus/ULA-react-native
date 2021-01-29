import React from 'react'
import { View, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Text, CheckBox } from 'react-native-elements'
import HTML from 'react-native-render-html'
import { playAudio } from '../../utils/playerShortAudios'

function InText(props) {
	const {
		subchapterDoc,
		subchapterTrDoc,
		globalStyles,
		chapterId,
		subchapterId,
		showTranslation,
		contentTypeDoc,
		trLang
	} = props

	const {
		title,
		content: { html, quizKeys }
	} = subchapterDoc

	console.log('quizKeys', quizKeys)

	const contentWidth = useWindowDimensions().width

	const handlePress = (text, path) => () => {
		const fileName = path || text
		playAudio(fileName, 'intext')
	}

	const handlePressQuizVariant = (quizId, variantId) => () => {
		console.log('quizId', chapterId, subchapterId, quizId, variantId)
	}

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

	const quizRenderer = (htmlAttribs, children) => {
		const { type, quizid: quizId } = htmlAttribs
		return <View key={`quiz-${quizId}`}>{children}</View>
	}

	const variantRenderer = (htmlAttribs, children) => {
		const { quizid: quizId, variantid: variantId, type } = htmlAttribs

		return (
			<TouchableOpacity
				key={`variant-${quizId}-${variantId}`}
				onPress={handlePressQuizVariant(quizId, variantId)}
			>
				<Text>
					<CheckBox size={18} containerStyle={{ margin: 0, padding: 0 }} />{' '}
					{children}
				</Text>
			</TouchableOpacity>
		)
	}

	return (
		<View style={{ padding: 5 }}>
			<Text h2 h2Style={globalStyles.subchapter}>
				{title}
			</Text>
			<HTML
				renderers={{
					intext: { renderer: inTextRenderer, wrapper: 'Text' },
					quiz: { renderer: quizRenderer, wrapper: 'View' },
					variant: { renderer: variantRenderer, wrapper: 'Text' }
				}}
				html={html}
				contentWidth={contentWidth}
			/>
		</View>
	)
}

export default InText
