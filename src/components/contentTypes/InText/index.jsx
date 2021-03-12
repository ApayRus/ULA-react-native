import React from 'react'
import { View } from 'react-native'
import Media from '../Media'
import { mediaParser, quizParser } from './subTypeParsers'
import Quiz from '../Quiz'
import MarkdownRenderer from '../../MarkdownRenderer'
import marked from 'marked'

// for better understanding what is happening beyond, may be you need to read this resources:
// 1) marked.js lexer https://marked.js.org/using_pro#lexer
// 2) https://github.com/Aparus/frazy-parser/blob/master/parsers/intext.js
// 3) as a playground you can use https://codesandbox.io/s/marked-lexer-to-react-components-6enjk?file=/src/App.js

marked.use({
	gfm: false,
	smartypants: true, // additional typography like long tire -- , etc
	breaks: true
})

const TypographyScreen = props => {
	const {
		contentTypeDoc,
		// contentTypeTrDoc,
		contentType,
		// showTranslation,
		chapterId,
		subchapterId
		// files,
		// navigation,
		// scrollPageTo
	} = props

	const {
		content: { markdownText }
	} = contentTypeDoc

	let quizIndex = 0
	// we need quizIndex to identify quiz answers (right/wrong) and save them to persistent storage (e.g. localStorage)

	const lexerNodesArray = marked.lexer(markdownText)

	return lexerNodesArray.map((elem, index) => {
		const { type, raw: rawText } = elem
		/* 
	items - in list 
	href - in image
	depth - in heading 
	*/
		// RENDERERS FOR OUR CUSTOM COMPONENTS

		// media and quiz - is a first level nodes, we can render it at first level

		// 1. media - takes whole paragraph
		const mediaParams = mediaParser(rawText)
		if (mediaParams) {
			return <Media key={`type-${index}`} {...mediaParams} />
		}
		// 2. quiz
		if (type === 'list') {
			const quizParams = quizParser(rawText)
			if (quizParams) {
				quizIndex++
				return (
					<Quiz
						key={`type-${index}`}
						{...{ chapterId, subchapterId, quizIndex }}
						data={quizParams}
					/>
				)
			}
		}
		// 3. ordinary markdown text
		return (
			<View key={`markdown-${index}`}>
				<MarkdownRenderer
					{...{
						markdownText: rawText,
						lexerNodesArray: [elem],
						contentType,
						chapterId,
						subchapterId
					}}
				/>
			</View>
		)
	})
}

export default TypographyScreen
