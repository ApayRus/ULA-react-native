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
import { colors } from 'react-native-elements'
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

const media = {
	phraseList: {
		phrasesContainer: { marginBottom: 5 },
		// phraseWrapper = avatar + texts
		phraseWrapperContainer: { paddingLeft: 3, paddingRight: 3 },
		// avatar and name of speaker
		voiceContainer: {
			flexDirection: 'row', // for arabic, hebrew: 'row-reverse'
			alignItems: 'center',
			marginTop: 15,
			marginBottom: 2
		},
		avatarProps: {
			rounded: true,
			icon: { name: 'perm-identity', color: 'grey', type: '' },
			containerStyle: {
				backgroundColor: 'lightgrey',
				width: 20,
				height: 20,
				marginRight: 5 // for arabic: marginRight
			},
			size: 'small'
		},
		voiceNameWrapper: { color: 'gray' },
		voiceName: {},
		voiceNameTr: {},
		phraseDefaultContainer: {
			borderColor: 'rgb(242,242,242)',
			borderStyle: 'solid',
			borderRadius: 5,
			borderWidth: 1,
			marginBottom: 6
		},
		phraseActiveContainer: {
			borderColor: colors.primary,
			borderStyle: 'solid',
			borderRadius: 5,
			borderWidth: 1,
			marginBottom: 6
		},
		phraseTextsWrapper: { paddingLeft: 2, paddingRight: 7 }, // for arabic: 7, 2
		phraseText: { ...general.body2 },
		phraseTextTr: {
			...general.body2,
			...general.translation,
			paddingBottom: 4
		},
		phraseNumContainer: { position: 'absolute', right: 2, bottom: 0 }, // for arabic: left:2
		phraseNumText: { color: 'grey', fontSize: 10 }
	}
}

const inText = {
	root: { paddingLeft: 10, paddingRight: 10 },
	paragraphContainer: { marginTop: 10 },
	paragraph: {
		// width: '100%',
		...general.body2
	},
	listContainer: {
		marginTop: 10
		// marginBottom: 10
	},
	list_itemContainer: {
		width: '100%'
	},
	ulBullet: {
		...general.body2,
		color: 'grey'
	},
	olBullet: {
		...general.body2,
		color: colors.primary
	},
	blockquoteContainer: {
		marginTop: 10,
		borderLeftColor: colors.primary,
		borderLeftWidth: 8,
		borderStyle: 'solid',
		paddingLeft: 5,
		marginLeft: 2
	},
	space: {
		height: 0
		// width: 30,
		// height: 30,
		// backgroundColor: 'red'
	},
	image: { width: 24, height: 24, resizeMode: 'contain' }, // inline image
	strong: { fontWeight: 'bold' },

	em: { fontStyle: 'italic' },
	text: {
		flexWrap: 'wrap',
		// borderColor: 'orange',
		// borderWidth: 1,
		// borderStyle: 'solid',
		...general.body2
	},
	blockImageContainer: {
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	soundedWord: {
		...general.body2,
		color: colors.primary
	},
	heading2: {
		...general.h4
	},
	heading3: {
		...general.h5
	}
}

// here you can create custom content type styles using basic ones
// for example words and phrases both are extensions upon basic contentType: oneLineOneFile
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
	},
	media,
	text: {
		...inText
	}
}
