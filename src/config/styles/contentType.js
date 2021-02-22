/* 
here you can customize content type styles, and create new ones, based on existing 
basic content types is oneLineOneFile, inText, phrasalPlayer, exercise (in development). 

For example, you can style phrasalPlayer in different ways for prose, poetry and songs -- 
with different background color/image, font size, alignment etc. 

list:

<container>
	<item>
		<image>
		<text>
		<translation>
	</item>
	(other items...)
</container>
*/

import general from './general'
// BASIC TYPES

const oneLineOneFile = {
	container: { flex: 1, padding: 5 },
	item: { marginBottom: 10 },
	image: {},
	textContainer: {},
	text: { ...general.body1 },
	trText: { ...general.translation }
}
export default {
	words: {
		...oneLineOneFile,
		container: {
			...oneLineOneFile.container,
			alignItems: 'center'
		},
		item: { marginBottom: 20, alignItems: 'center' },
		image: { width: 100, height: 100, resizeMode: 'contain' },
		textContainer: { alignItems: 'center' }
	},
	phrases: {
		...oneLineOneFile
	}
}
