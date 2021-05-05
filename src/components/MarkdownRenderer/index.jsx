import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, Text, Image, useWindowDimensions } from 'react-native'
import SoundedWord from '../contentTypes/RichText/SoundedWord'
import contentTypeStyles from '../../config/styles/contentType'
import { getImageSize } from './utils'
import { textWithSoundedWordsParser } from '../contentTypes/RichText/subTypeParsers'
import content from '../../utils/content'

import marked from 'marked'

marked.use({
	gfm: false,
	smartypants: true, // additional typography like long tire -- , etc
	breaks: true
})

const MarkdownRenderer = props => {
	const {
		markdownText = '',
		parentNodeProps,
		lexerNodesArray,
		contentType, // - for styling
		chapterId, // - for SoundedWord default files
		subchapterId // - for SounderWord
	} = props

	const {
		width: windowWidth /* height: windowHeight  */
	} = useWindowDimensions()

	const contentTypeStyle = contentTypeStyles?.[contentType]

	// this is work around (i hope temporary code)
	// because selectable don't set without it
	const [selectable, setSelectable] = useState(false)
	const [imageOriginalSize, setImageOriginalSize] = useState({
		width: 0,
		height: 0
	})

	const imageRef = useRef()

	useEffect(() => {
		if (imageRef.current) {
			const getAndSetImageSize = async href => {
				const size = await getImageSize(href)
				setImageOriginalSize(size)
			}
			getAndSetImageSize(imageRef.current)
		}
		return () => {
			// cleanup
		}
	}, [imageRef])

	useEffect(() => {
		setSelectable(true)
	}, [])

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

	return lexerNodes.map((elem, index, array) => {
		const { tokens, items, type, text, href, depth = '', ordered } = elem

		const children = tokens || items

		const hasLeftNeighbor = Boolean(array?.[index - 1])
		const hasRightNeighbor = Boolean(array?.[index + 1])

		/* 
	items - in list 
	href - in image
	depth - in heading 
	*/

		const InlineWithInlineRenderer = () => (
			<Text
				key={`elem${index}`}
				style={contentTypeStyle[`${type}${depth}`]}
				{...{ selectable }}
			>
				<MarkdownRenderer
					lexerNodesArray={children}
					{...{ contentType, chapterId, subchapterId }}
				/>
			</Text>
		)

		const BlockWithBlockRenderer = () => (
			<View
				key={`elem${index}`}
				style={contentTypeStyle[`${type}${depth}Container`]}
			>
				<MarkdownRenderer
					lexerNodesArray={children}
					parentNodeProps={{ type, ordered }}
					{...{ contentType, chapterId, subchapterId }}
				/>
			</View>
		)

		const listBullet = index => {
			if (type === 'list_item' && parentNodeProps.ordered) {
				return <Text style={contentTypeStyle.olBullet}>{index + 1}. </Text>
			}
			if (type === 'list_item') {
				return <Text style={contentTypeStyle.ulBullet}>• </Text>
			}
			return null
		}

		const BlockWithInlineRenderer = () => (
			<View
				key={`elem${index}`}
				style={contentTypeStyle[`${type}${depth}Container`]}
			>
				<Text style={contentTypeStyle[`${type}${depth}`]} {...{ selectable }}>
					{listBullet(index)}
					<MarkdownRenderer
						lexerNodesArray={children}
						{...{ contentType, chapterId, subchapterId }}
					/>
				</Text>
			</View>
		)

		const BlockWithImage = () => (
			<View
				key={`elem${index}`}
				style={contentTypeStyle[`blockImageContainer`]}
			>
				<MarkdownRenderer
					lexerNodesArray={children}
					{...{ contentType, chapterId, subchapterId }}
				/>
			</View>
		)

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
				case 'image': {
					return useMemo(() => {
						const isFileLocal = Boolean(!href.match(/^http/i))
						const isBlockImage = !(hasLeftNeighbor || hasRightNeighbor) // takes all paragraph, hasn't neighbors

						imageRef.current = href

						const blockImageSize = {
							width: windowWidth,
							height:
								windowWidth *
								(imageOriginalSize.height / imageOriginalSize.width),
							resizeMode: 'contain'
							// eslint-disable-next-line no-mixed-spaces-and-tabs
						}

						return (
							<Image
								key={`elem${index}`}
								style={[
									contentTypeStyle[type],
									/* imageSize, */
									isBlockImage &&
									imageOriginalSize.width > 0 &&
									imageOriginalSize.height > 0
										? blockImageSize
										: { width: 24, height: 24 }
								]}
								source={
									isFileLocal
										? content.getFilesByPathString(href)?.file
										: { uri: href }
								}
							/>
						)
					}, [href, imageOriginalSize.width, imageOriginalSize.height])
				}
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
			const inlineElements = ['strong', 'em', 'text']
			const blockElements = ['list', 'blockquote']
			const isImageParagraph =
				type === 'paragraph' &&
				tokens.length === 1 &&
				tokens[0].type === 'image'

			if (inlineElements.includes(type)) return InlineWithInlineRenderer()
			if (blockElements.includes(type)) return BlockWithBlockRenderer()
			if (isImageParagraph) return BlockWithImage()
			// paragraph
			return BlockWithInlineRenderer()
		}
	})
}

export default MarkdownRenderer
