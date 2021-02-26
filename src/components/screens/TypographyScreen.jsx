import React from 'react'
import { ScrollView, View, useWindowDimensions, Text } from 'react-native'
import { Image } from 'react-native-elements'
// import globalStyles from '../../config/globalStyles'
import marked from 'marked'
import ChapterHeader from '../ChapterHeader'
const globalStyles = {}

marked.use({
	gfm: false,
	smartypants: true, // additional typography like long tire -- , etc
	breaks: true
})

const TypographyScreen = ({ navigation }) => {
	const markdownText = `# Header 
  
Paragraph1 with nested **bold**, *italic*, and double nested **bold _italic_**. А также русский текст. 
	
- list item 1
- list item 2 
- list item 3

paragraph 2

> blockquote line 1
> blockquote line 2
> blockquote line 3
> 
> -- *Mark Awreliy* 

А ещё параграф с русским текстом مَعَ كلمات عَرَبِيَّةٍ أيضا чтобы совсем интересно было. **أخرى عربية** И немного *русского курсива* и **жирного русского**. 


![some image](https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png)
  `

	const lexerOutput = marked.lexer(markdownText)

	// console.log('lexerOutput', JSON.stringify(lexerOutput, null, '\t'))
	console.log('lexerOutput', lexerOutput)

	const foldLexerNodes = (nodesArray = [], parrentType) => {
		return nodesArray.map((elem, index) => {
			const { tokens, items, type, text, href, depth = '' } = elem
			/* 
		items - in list 
		href - in image
		depth - in heading 
		*/
			const children = tokens || items
			// at the end of lexer tree (no more children) can be 1) text; 2) space; 3) image
			if (!children) {
				switch (type) {
					case 'text':
						return text
					case 'image':
						return (
							<Image
								key={`elem${index}`}
								style={styles[type]}
								source={{ uri: href }}
							/>
						)
					case 'space':
						return parrentType !== 'list_item' ? (
							<Text key={`elem${index}`} style={styles[type]}></Text>
						) : null // we don't need "space" in last list_item
					default:
						console.log('unexpected thing in marked.lexer')
				}
			}
			// if node has children then we run recursion
			else {
				// inline elements:
				if (type === 'strong' || type === 'em' || type === 'text') {
					return (
						<Text key={`elem${index}`} style={styles[`${type}${depth}`]}>
							{foldLexerNodes(children, type)}
						</Text>
					)
				}
				// Block elements with Block elements:
				else if (type === 'list' || type === 'blockquote') {
					return (
						<View
							key={`elem${index}`}
							style={styles[`${type}${depth}Container`]}
						>
							{foldLexerNodes(children, type)}
						</View>
					)
				}
				// Block elements with Inline elements
				else {
					return (
						<View
							key={`elem${index}`}
							style={styles[`${type}${depth}Container`]}
						>
							<Text key={`elem${index}`} style={styles[`${type}${depth}`]}>
								{foldLexerNodes(children, type)}
							</Text>
						</View>
					)
				}
			}
		})
	}

	const lexerJsx = foldLexerNodes(lexerOutput)

	return (
		<ScrollView>
			<ChapterHeader {...{ navigation }} />
			<View>{lexerJsx}</View>
		</ScrollView>
	)
}

const styles = {
	paragraphContainer: {
		borderStyle: 'solid',
		borderColor: 'green',
		borderWidth: 1
	},
	paragraph: {
		...globalStyles.body3,
		width: '100%'
	},
	listContainer: {
		borderStyle: 'solid',
		borderColor: 'blue',
		borderWidth: 1,
		marginBottom: 10
	},
	list_itemContainer: {
		borderStyle: 'solid',
		borderColor: 'red',
		borderWidth: 1,
		width: '100%'
	},
	blockquoteContainer: {
		borderLeftColor: 'grey',
		borderLeftWidth: 5,
		borderStyle: 'solid',
		paddingLeft: 10
	},
	space: {
		width: 50,
		height: 50,
		backgroundColor: 'red'
	},
	image: { width: 100, height: 100 },
	strong: { fontWeight: 'bold' },
	em: { fontStyle: 'italic' },
	text: {
		borderStyle: 'solid',
		borderColor: 'orange',
		borderWidth: 1,
		flexWrap: 'wrap'
	},
	heading1: {
		color: 'red'
	}
}

export default TypographyScreen
