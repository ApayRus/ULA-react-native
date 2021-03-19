import React from 'react'
import {
	View,
	// useWindowDimensions,
	Text
} from 'react-native'
import { Image } from 'react-native-elements'
import SoundedWord from './contentTypes/InText/SoundedWord'
import contentTypeStyles from '../config/styles/contentType'
import { textWithSoundedWordsParser } from './contentTypes/InText/subTypeParsers'
import marked from 'marked'

marked.use({
	gfm: false,
	smartypants: true, // additional typography like long tire -- , etc
	breaks: true
})

const MarkdownRenderer = props => {
	const {
		markdownText = '',
		lexerNodesArray,
		contentType, // - for styling
		chapterId, // - for SoundedWord default files
		subchapterId // - for SounderWord
	} = props
	const contentTypeStyle = contentTypeStyles?.[contentType]

	//we use [0].tokens to avoid wrapping paragraph,
	//which appears by default on marked.lexer('any text')
	let lexerNodesFromText = [...(marked.lexer(markdownText) || [])]
	if (
		lexerNodesFromText.length === 1 &&
		lexerNodesFromText?.[0]?.type === 'paragraph'
	) {
		lexerNodesFromText = lexerNodesFromText[0]?.tokens || []
	}

	const lexerNodes = lexerNodesArray || lexerNodesFromText

	return lexerNodes.map((elem, index) => {
		const { tokens, items, type, text, href, depth = '' } = elem

		/* 
	items - in list 
	href - in image
	depth - in heading 
	*/

		// RENDERERS FOR ORDINARY TEXT
		const inlineWithInlineRenderer = (index, children, type) => {
			return (
				<Text key={`elem${index}`} style={contentTypeStyle[`${type}${depth}`]}>
					<MarkdownRenderer
						lexerNodesArray={children}
						{...{ contentType, chapterId, subchapterId }}
					/>
				</Text>
			)
		}
		const blockWithBlockRenderer = (index, children, type) => (
			<View
				key={`elem${index}`}
				style={contentTypeStyle[`${type}${depth}Container`]}
			>
				<MarkdownRenderer
					lexerNodesArray={children}
					{...{ contentType, chapterId, subchapterId }}
				/>
			</View>
		)
		const blockWithInlineRenderer = (index, children, type) => {
			const listBullet =
				type === 'list_item' ? (
					<Text style={contentTypeStyle.ulBullet}>• </Text>
				) : null

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
						<MarkdownRenderer
							lexerNodesArray={children}
							{...{ contentType, chapterId, subchapterId }}
						/>
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
					// sounded text can be deep in lexer tree, then we render it inside recursion, when we met its sign
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
						<View key={`elem${index}`} style={contentTypeStyle[type]}></View>
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

export default MarkdownRenderer
