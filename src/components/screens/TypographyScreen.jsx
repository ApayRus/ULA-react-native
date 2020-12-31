import React from 'react'
import { ScrollView, View, useWindowDimensions } from 'react-native'
import { Text } from 'react-native-elements'
import HTML from 'react-native-render-html'
import { styles as globalStyles } from '../../config/globalStyles'
import marked from 'marked'
import ChapterHeader from '../ChapterHeader'

import { Content } from '../../utils/content'

const TypographyScreen = ({ navigation }) => {
	const contentWidth = useWindowDimensions().width

	const markdownText = `*** 

markdown:

It's some **bold** text. And some *italic*. 

Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est, quas.

![image](https://i2.wp.com/www.brainpickings.org/wp-content/uploads/2011/08/typographie1.png?w=500&ssl=1)

#### Header 4 

Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Dignissimos veniam id tempora blanditiis incidunt dolores alias ullam quae. 
Sint, iure unde cumque vero dolorem exercitationem?

- list item 1
- list item 2
- list item 3

#### Header 5

Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor, deserunt.. 

Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit ipsum expedita distinctio vel..

> Blockquote line1 
> Blockquote line2 
> Blockquote line3 
> -- *Author Name* 
`

	const jsxText = (
		<>
			<Text style={globalStyles.h4}>body1 (h4)</Text>
			<Text style={globalStyles.body1}>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
				nihil similique pariatur vel facere id, doloribus ullam maxime illum!
				Esse dignissimos ea nisi quaerat? Nihil.
			</Text>
			<Text style={globalStyles.h5}>body2 (h5)</Text>
			<Text style={globalStyles.body2}>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores,
				blanditiis ea minus totam incidunt quam dolores impedit eum ad et,
				officia vitae. Temporibus, maiores quia!
			</Text>
			<Text style={globalStyles.h6}>body3 (h6)</Text>
			<Text style={globalStyles.body3}>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores,
				blanditiis ea minus totam incidunt quam dolores impedit eum ad et,
				officia vitae. Temporibus, maiores quia!
			</Text>
		</>
	)

	const html = Content.parseTypeInText(markdownText)

	const html2 = `<blockquote>
<p>Blockquote line1 </p>
<p>Blockquote line2 </p>
<p>Blockquote line3 </p>
<p>– <em>Author Name</em> </p>
</blockquote>`

	const markedHtml = marked(markdownText, { breaks: true })

	console.log('html', html)
	console.log('markedHtml', markedHtml)

	const chapterHeaderProps = {
		navigation,
		globalStyles,
		title: 'Typography',
		trTitle: ' typo examples',
		showTranslation: true
	}

	const brRenderer = (htmlAttribs, children, passProps) => {
		console.log('XXXXXXXXXXXXXX', htmlAttribs)
		return <View style={{ height: 1, width: 1 }}>&nbsp;</View>
	}

	// const pRenderer = (htmlAttribs, children) => {
	// 	console.log('XXXXXXXXXXXXXX')
	// 	return <Text>{children}</Text>
	// }

	const tagsStyles = {
		p: {
			...globalStyles.body2,
			marginTop: 5,
			marginBottom: 5
		},
		h4: globalStyles.h4,
		h5: globalStyles.h5,
		li: globalStyles.body2,
		small: globalStyles.body3,
		ul: { marginTop: 10, marginBottom: 0 },
		img: { width: '100%', marginTop: 10, alignSelf: 'center' },
		hr: {
			marginTop: 10,
			marginBottom: 10,
			borderStyle: 'solid',
			borderColor: 'lightgray',
			borderWidth: 1,
			width: '95%',
			alignSelf: 'center'
		},
		blockquote: {
			borderLeftWidth: 10,
			borderStyle: 'solid',
			borderLeftColor: '#dfe2e5',
			padding: 12,
			paddingBottom: 0,
			marginTop: 6,
			marginLeft: 6
		}
	}

	return (
		<ScrollView>
			<ChapterHeader {...chapterHeaderProps} />
			<View>
				<HTML
					tagsStyles={tagsStyles}
					contentWidth={contentWidth}
					renderers={{
						br: { renderer: brRenderer, wrapper: 'View' }
						// p: { renderer: pRenderer, wrapper: 'View' }
					}}
					html={html}
				/>
			</View>
		</ScrollView>
	)
}

export default TypographyScreen
