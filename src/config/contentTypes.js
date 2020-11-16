export default {
    default: {
        interactivity: 'oneLineOneFile'
    },
    words: {
        style: {
            container: {
                alignItems: 'center'
            },
            item: { marginBottom: 20 },
            image: { width: 100, height: 100, resizeMode: 'contain' },
            // text: { color: 'red' },
            translation: { marginTop: -10 }
        }
    },

    phrases: {
        style: {
            translation: {
                marginTop: -10
            }
        }
    },
    grammar: {
        interactivity: 'inText'
    },
    listening: {
        interactivity: 'timing'
    }
}