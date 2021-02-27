import React from 'react'
import {
	ScrollView,
	View,
	useWindowDimensions,
	Text,
	TouchableOpacity
} from 'react-native'
import { Image } from 'react-native-elements'
import marked from 'marked'
import Media from '../Media'
import { playAudio } from '../../../utils/playerShortAudios'
import content from '../../../utils/content'
import contentTypeStyles from '../../../config/styles/contentType'

const mediaRegex = new RegExp(/\[\s*?media\s*?\|\s*?(.+?)\s*\]/)

const mediaParser = mediaText => {
	const mediaMatch = mediaText?.match(mediaRegex)
	const [, paramsString = ''] = mediaMatch || []
	const [path, ...params] = paramsString.split('|')?.map(elem => elem.trim())
	return { path, params }
}

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

	const contentTypeStyle = contentTypeStyles?.[contentType]

	const lexerOutput = marked.lexer(markdownText)

	// console.log('lexerOutput', JSON.stringify(lexerOutput, null, '\t'))
	// console.log('lexerOutput', lexerOutput)

	const handlePressSoundedWord = (text, path) => () => {
		const filePath = path || `${chapterId}/${subchapterId}/audios/${text}`
		const { file: audioFile } = content.getFilesByPathString(filePath) || {}
		playAudio(audioFile)
	}

	const renderLexerNodes = (nodesArray = []) => {
		return nodesArray.map((elem, index) => {
			const { tokens, items, type, text, href, depth = '', raw } = elem
			/* 
		items - in list 
		href - in image
		depth - in heading 
		*/

			// RENDERERS FOR OUR CUSTOM COMPONENTS

			if (raw.match(mediaRegex)) {
				const mediaProps = mediaParser(raw)
				return <Media key={`elem${index}`} data={mediaProps} />
			}

			// if (raw.match(soundedWordRegex)) {
			// 	return (
			// 		<TouchableOpacity
			// 			onPress={handlePressSoundedWord(
			// 				text.replace(/[,\. ]+/g, '_'),
			// 				path
			// 			)}
			// 			key={`intext-${text}`}
			// 		>
			// 			<Text style={[{ color: 'darkblue' }]}>{text}</Text>
			// 		</TouchableOpacity>
			// 	)
			// }

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
					case 'text':
						return text
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
