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
			translation: { marginTop: -10, alignSelf: 'center' }
		}
	},

	phrases: {
		style: {
			translation: {
				marginTop: -10,
				textAlign: 'right'
			}
		}
	},
	text: {
		interactivity: 'inText'
	},
	timing: {
		interactivity: 'timing'
	},
	audio: {
		interactivity: 'audio'
	}
}
