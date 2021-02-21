import { colors } from 'react-native-elements'
import general from './general'

const subchapterHeader = {
	backgroundColor: colors.primary,
	paddingLeft: 10,
	paddingRight: 10,
	paddingTop: 5,
	paddingBottom: 5,
	borderRadius: 10,
	fontSize: 20,
	color: 'white'
}
const chapterHeader = {
	color: colors.primary,
	display: 'flex',
	alignItems: 'center',
	marginTop: 10,
	marginBottom: 10
}

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
	}
}
