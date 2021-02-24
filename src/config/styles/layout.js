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
	homeScreen: {
		container: {
			flex: 1
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
		title: { ...general.h3 },
		author: { ...general.h5 },
		logoImageContainer: { marginTop: 30 },
		logoImageProps: {
			style: { width: 200, height: 80 },
			source: content.getFilesByPathString('images/logo')?.file
		},
		additionalInfoContainer: { marginTop: 10, alignItems: 'center' },
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

	drawer: {
		containerView: { flex: 1, backgroundColor: 'rgb(242,242,242)' },
		containerScrollView: { ...general.basicWritingDirection },
		imageContainer: { marginTop: 10, alignItems: 'center' },
		image: { width: 100, height: 100 },
		listItem: {
			paddingBottom: 2,
			paddingTop: 2
			// backgroundColor: 'transparent'
		},
		listItemText: { ...general.body2 },
		listItemTranslation: { ...general.translation }
	},
	// chapter/subchapter title with translations
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
		chapterTitleTr: { ...general.translation, textAlign: 'center' },
		subchapterTitleTr: { ...general.translation, textAlign: 'center' }
	},
	subchaptersListScreen: {
		screenContainer: { justifyContent: 'center', padding: 5 },
		listContainer: { marginTop: 10 },
		subchapterButton: { margin: 10 }
	}
}
