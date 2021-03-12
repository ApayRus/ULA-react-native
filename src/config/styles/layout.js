import { colors } from 'react-native-elements'
import general from './general'
import content from '../../utils/content'

/* 
 COLORS
 you can use:
 1) {color: colors.primary}, all available colors here: https://reactnativeelements.com/docs/customization/
 2) {color: 'red'}, for more info please visit: https://www.w3schools.com/cssref/css_colors.asp

 ICONS
 on place of name in: icon: { name: 'list'} you can put any name from: https://www.materialui.co/icons
 if the name includes several words, use dash as a delimiter, for example: 'arrow-forward'
 for more info: https://reactnativeelements.com/docs/icon
*/

export default {
	// HOME SCREEN
	homeScreen: {
		root: {
			flex: 1
			// justifyContent: 'stretch'
		},
		backgroundImageProps: {
			style: {
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				// backgroundColor: 'rgb(242,242,242)',
				width: '100%'
			},
			imageStyle: { opacity: 0.5, resizeMode: 'stretch' },
			source: content.getFilesByPathString('images/background')?.file
		},
		// first 1/3 before logo
		beforeLogoContainer: {
			flex: 2,
			paddingTop: 20,
			width: '100%'
			// borderWidth: 1,
		},
		title: { ...general.h3, textAlign: 'center' },
		author: { ...general.h5, textAlign: 'center' },
		// middle 1/3 logo
		logoContainer: {
			// marginTop: 30,
			flex: 1,
			justifyContent: 'center',
			width: '100%',
			alignItems: 'center'
			// borderWidth: 1,
		},
		logoImageProps: {
			style: { width: 320, height: 200, resizeMode: 'contain' },
			source: content.getFilesByPathString('images/logo')?.file
		},
		afterLogoContainer: {
			flex: 2,
			width: '100%',
			paddingTop: 10,
			alignItems: 'center'
			// borderWidth: 1
		},
		additionalInfoItem: { marginBottom: 2 },
		additionalInfoText: { ...general.body3 },
		tableOfContentButtonProps: {
			icon: { name: 'list', color: 'white' },
			buttonStyle: {
				paddingRight: 20,
				margin: 20,
				backgroundColor: colors.primary
			},
			title: 'Table of contents'
		},
		translationsContainer: { position: 'absolute', bottom: 0 },
		navigateForwardButtonContainer: {
			position: 'absolute',
			bottom: 0,
			right: 0
		},
		navigateForwardButtonProps: {
			icon: { name: 'arrow-forward', color: colors.primary },
			type: 'clear'
		}
	},
	// DRAWER
	drawer: {
		containerView: {
			flex: 1,
			backgroundColor: 'rgb(242,242,242)'
		},
		containerScrollView: {},

		containerContainerScrollView: {},
		imageContainer: { marginTop: 20, marginBottom: 10, alignItems: 'center' },
		logoImageProps: {
			style: { width: 200, height: 100, resizeMode: 'contain' },
			source: content.getFilesByPathString('images/logo')?.file
		},
		listItemProps: {
			containerStyle: {
				paddingBottom: 2,
				paddingTop: 2,
				backgroundColor: 'rgb(242,242,242)',
				...general.basicWritingDirection
				// borderWidth: 1,
				// alignItems: 'center'
			},

			bottomDivider: true

			// ...general.basicAlign,
			// flexDirection: 'row-reverse',
			// backgroundColor: 'transparent',
		},
		listItemText: {
			...general.body2,
			width: '100%'
		},
		listItemTranslation: {
			...general.translation,
			width: '100%'
		},
		listItemDecorBeforeImageProps: {
			style: { width: 50, height: 25, resizeMode: 'contain', marginLeft: 20 },
			source: content.getFilesByPathString('images/titleDecorLeft')?.file
		},
		listItemDecorAfterImageProps: {
			style: { width: 50, height: 25, resizeMode: 'contain', marginRight: 20 },
			source: content.getFilesByPathString('images/titleDecorRight')?.file
		}
	},

	// CHAPTER/SUBCHAPTER HEADER
	screenHeader: {
		container: {
			marginTop: 10,
			marginBottom: 10,
			marginLeft: 5,
			marginRight: 5,
			alignItems: 'center'
		},
		chapterTitle: { ...general.h4, color: colors.primary, textAlign: 'center' },
		subchapterTitle: {
			...general.body1,
			color: colors.primary,
			marginTop: 5,
			textAlign: 'center'
		},
		chapterTitleTr: {
			...general.translation,
			textAlign: 'center'
		},
		subchapterTitleTr: {
			...general.translation,
			textAlign: 'center'
		}
	},
	subchaptersListScreen: {
		screenContainer: { justifyContent: 'center', padding: 5 },
		listContainer: { marginTop: 10 },
		subchapterButton: { margin: 10 }
	},

	// QUIZ
	quiz: {
		variantText: { ...general.body2, alignItems: 'baseline' },
		checkboxProps: {
			size: general.body2.fontSize,
			containerStyle: { margin: 0, padding: 0, backgroundColor: 'transparent' },
			textStyle: { ...general.body2, fontWeight: 'normal' }
		}
	}
}
