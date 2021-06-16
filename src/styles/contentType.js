import lodash from 'lodash'
import general from './general.js'
import customStyles from '../../content/styles/contentType.js'
// BASIC MATERIAL TYPES
const { merge } = lodash

const defaultStyles = {
	default: 'richText',
	// fileCard
	fileCard: {
		parent: 'fileCard',
		container: { alignItems: 'center', flex: 1, padding: 5 },
		item: { marginBottom: 20, alignItems: 'center' },
		image: { width: 100, height: 100, resizeMode: 'contain' },
		textContainer: { alignItems: 'center' },
		text: { ...general.body1 },
		trText: { ...general.translation.default }
	},

	// richMedia
	richMedia: {
		parent: 'richMedia',
		phraseList: {
			phrasesContainer: { marginBottom: 5 },
			// phraseWrapper = avatar + texts
			phraseWrapperContainer: { paddingLeft: 3, paddingRight: 3 },
			// avatar and name of speaker
			voiceContainer: {
				flexDirection: 'row', // for arabic, hebrew: 'row-reverse'
				alignItems: 'center',
				marginTop: 15,
				marginBottom: 2,
				borderColor: 'grey',
				borderWidth: 0.5,
				borderRadius: 10
			},
			avatarProps: {
				rounded: true,
				icon: { name: 'perm-identity', color: 'grey', type: '' },
				containerStyle: {
					backgroundColor: 'lightgrey',
					marginRight: 5 // for arabic: marginRight
				},
				size: 'small',
				flex: 1,
				flexShrink: 0
			},
			voiceNameWrapper: { flex: 10 },
			voiceNameContainer: {},
			voiceNameTrContainer: {},
			voiceName: { ...general.body3, color: general.colors.primary },
			voiceNameTr: { ...general.translation.default },
			phraseDefaultContainer: {
				borderColor: 'rgb(242,242,242)',
				borderStyle: 'solid',
				borderRadius: 5,
				borderWidth: 1,
				marginBottom: 6
			},
			phraseActiveContainer: {
				borderColor: general.colors.primary,
				borderStyle: 'solid',
				borderRadius: 5,
				borderWidth: 1,
				marginBottom: 6
			},
			phraseTextsWrapper: { paddingLeft: 2, paddingRight: 7 }, // for arabic: 7, 2
			phraseText: { ...general.body2 },
			phraseTextTr: {
				...general.body2,
				...general.translation.default,
				paddingBottom: 4
			},
			phraseNumContainer: { position: 'absolute', right: 2, bottom: 0 }, // for arabic: left:2
			phraseNumText: { color: 'grey', fontSize: 10 }
		}
	},

	// richText
	richText: {
		parent: 'richText',
		root: { paddingLeft: 10, paddingRight: 10 },
		paragraphContainer: { marginTop: 10 },
		paragraph: {
			...general.body2
		},
		listContainer: {
			marginTop: 10
		},
		list_itemContainer: {
			width: '100%'
		},
		ulBullet: {
			...general.body2,
			color: general.colors.primary
		},
		olBullet: {
			...general.body2,
			color: general.colors.primary
		},
		blockquoteContainer: {
			marginTop: 10,
			borderLeftColor: general.colors.primary,
			borderLeftWidth: 8,
			borderStyle: 'solid',
			paddingLeft: 5,
			marginLeft: 2
		},
		space: {
			height: 0
		},
		image: { width: 24, height: 24, resizeMode: 'contain' }, // inline image
		strong: { fontWeight: 'bold' },

		em: { fontStyle: 'italic' },
		text: {
			flexWrap: 'wrap',
			...general.body2
		},
		blockImageContainer: {
			marginTop: 10,
			justifyContent: 'center',
			alignItems: 'center'
		},
		soundedWord: {
			...general.body2,
			color: general.colors.primary
		},
		heading2: {
			...general.h4
		},
		heading3: {
			...general.h5
		}
	},
	exercise: {
		parent: 'exercise'
	}
}

const fillCustomTypesWithDefaultStyles = () => {
	const defaultContentTypes = Object.keys(defaultStyles)

	const customContentTypes = Object.keys(customStyles).filter(
		type => !defaultContentTypes.includes(type)
	)

	customContentTypes.forEach(customType => {
		const { parent } = customStyles[customType]
		defaultStyles[customType] = defaultStyles[parent]
	})
}

fillCustomTypesWithDefaultStyles()

export const getInteractivity = type => {
	if (!type) {
		return defaultStyles.default
	}
	// return customStyles?.[type]?.parent || type
	return (
		customStyles?.[type]?.parent ||
		defaultStyles?.[type]?.parent ||
		customStyles?.default ||
		defaultStyles?.default
	)
}

const styles = merge({}, defaultStyles, customStyles)

export default styles
