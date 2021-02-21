import { colors } from 'react-native-elements'
import general from './general'

export default {
	homeScreen: {
		container: {
			flex: 1,
			backgroundColor: '#fff',
			alignItems: 'center',
			justifyContent: 'center'
		},
		title: { ...general.h3 },
		author: { ...general.h5 },
		imageContainer: { marginTop: 30 },
		image: { width: 200, height: 80 },
		additionalInfoContainer: { marginTop: 10, alignItems: 'center' },
		additionalInfoItem: { marginBottom: 2 },
		additionalInfoText: { ...general.body3 },
		tableOfContentButton: {
			paddingRight: 20,
			margin: 20
		},
		tableOfContentButtonIcon: { name: 'list', color: 'white' },
		translationsContainer: { position: 'absolute', bottom: 0 }
	},

	drawer: {
		containerView: { flex: 1 },
		containerScrollView: { ...general.basicWritingDirection },
		imageContainer: { marginTop: 10, alignItems: 'center' },
		image: { width: 100, height: 100 },
		listItem: {
			paddingBottom: 2,
			paddingTop: 2
		},
		listItemText: { ...general.body2 },
		listItemTranslation: { ...general.translation }
	},
	// chapter/subchapter title with translations
	screenHeader: {
		container: { margin: 5, alignItems: 'center' },
		chapterTitle: { ...general.h4, color: colors.primary, marginTop: 5 },
		subchapterTitle: { ...general.h5, color: colors.primary, marginTop: 5 },
		chapterTitleTr: { ...general.translation },
		subchapterTitleTr: { ...general.translation }
	}
}
