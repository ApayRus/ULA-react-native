import React from 'react'
import {
	View,
	// useWindowDimensions,
	Text
} from 'react-native'
import { Image } from 'react-native-elements'
import marked from 'marked'
import Media from '../Media'
import SoundedWord from './SoundedWord'
import contentTypeStyles from '../../../config/styles/contentType'
import {
	mediaParser,
	textWithSoundedWordsParser,
	quizParser
} from './subTypeParsers'
import Quiz from '../Quiz'

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
		contentTypeTrDoc,
		contentType,
		showTranslation,
		chapterId,
		subchapterId,
		files,
		navigation,
		scrollPageTo
	} = props

	const {
		content: { markdownText }
	} = contentTypeDoc

	let quizIndex = 0
	// we need quizIndex to identify quiz answers (right/wrong) and save them to persistent storage (e.g. localStorage)

	const contentTypeStyle = contentTypeStyles?.[contentType]

	const lexerOutput = marked.lexer(markdownText)

	// console.log('lexerOutput', JSON.stringify(lexerOutput, null, '\t'))
	// console.log('lexerOutput', lexerOutput)

	const renderLexerNodes = (nodesArray = []) => {
		return nodesArray.map((elem, index) => {
			const { tokens, items, type, text, href, depth = '', raw: rawText } = elem
			/* 
		items - in list 
		href - in image
		depth - in heading 
		*/

			// RENDERERS FOR OUR CUSTOM COMPONENTS

			// media and quiz - is a first level nodes, we can render it at first level
			// sounded text can be deep in lexer tree, then we render it inside recursion, when we met its sign

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

			// RENDERERS FOR ORDINARY TEXT
			const inlineWithInlineRenderer = (index, children, type) => {
				return (
					<Text
						key={`elem${index}`}
						style={contentTypeStyle[`${type}${depth}`]}
					>
						{renderLexerNodes(children)}
					</Text>
				)
			}
			const blockWithBlockRenderer = (index, children, type) => (
				<View
					key={`elem${index}`}
					style={contentTypeStyle[`${type}${depth}Container`]}
				>
					{renderLexerNodes(children)}
				</View>
			)
			const blockWithInlineRenderer = (index, children, type) => {
				const listBullet =
					type === 'list_item' ? (
						<Text style={contentTypeStyle.ulBullet}>•</Text>
					) : (
						''
					)

				return (
					<View
						key={`elem${index}`}
						style={contentTypeStyle[`${type}${depth}Container`]}
					>
						<Text
							key={`elem${index}`}
							style={contentTypeStyle[`${type}${depth}`]}
						>
							{listBullet}
							{renderLexerNodes(children)}
						</Text>
					</View>
				)
			}

			const children = tokens || items
			// at the end of lexer tree (no more children) can be 1) text; 2) space; 3) image
			// if lexer node hasn't children we just render this node
			if (!children) {
				switch (type) {
					case 'text': {
						const arrayOfTextBlocks = textWithSoundedWordsParser(text)
						// contains ordinaryText and soundedWords in it
						// [{label: 'ordinaryText', data:{text}}, {label: 'soundedText, data:{text, path, params}}]
						return arrayOfTextBlocks.map((elem, index2) => {
							const {
								label,
								data: { text, path, params }
							} = elem
							if (label === 'ordinaryText') {
								return text
							} else if (label === 'soundedText') {
								return (
									<SoundedWord
										key={`type-${index}-${index2}`}
										{...{ text, path, params, chapterId, subchapterId }}
									/>
								)
							}
						})
					}
					case 'image':
						return (
							<Image
								key={`elem${index}`}
								style={contentTypeStyle[type]}
								source={{ uri: href }}
							/>
						)
					case 'space':
						return (
							<Text key={`elem${index}`} style={contentTypeStyle[type]}></Text>
						)
					default:
						console.log('unexpected thing in marked.lexer')
				}
			}
			// if node has children then we run recursion
			else {
				switch (type) {
					case 'strong':
					case 'em':
					case 'text':
						// case 'list_item':
						return inlineWithInlineRenderer(index, children, type)
					case 'list':
					case 'blockquote':
						return blockWithBlockRenderer(index, children, type)
					default:
						return blockWithInlineRenderer(index, children, type)
				}
			}
		})
	}

	const lexerJsx = renderLexerNodes(lexerOutput)

	return <View>{lexerJsx}</View>
}

export default TypographyScreen
