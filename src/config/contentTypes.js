export default {
	default: {
		interactivity: 'oneLineOneFile'
	},
	words: {
		style: {
			container: {
				alignItems: 'center'
			},
			item: { marginBottom: 20, alignItems: 'center' },
			image: { width: 100, height: 100, resizeMode: 'contain' },
			text: { alignSelf: 'center' },
			translation: { alignSelf: 'center' }
		}
	},

	phrases: {
		style: {
			item: {
				marginBottom: 5
			},
			translation: {
				textAlign: 'left'
			}
		}
	},
	text: {
		interactivity: 'inText'
	},
	media: {
		interactivity: 'media'
	}
}
