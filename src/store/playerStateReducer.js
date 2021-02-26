import AsyncStorage from '@react-native-async-storage/async-storage'

const initState = {
	currentPhraseNum: 0,
	currentPhraseId: '',
	currentTime: 0,
	isPlaying: false
}

const translationReducer = (state = initState, action) => {
	switch (action.type) {
		case 'SET_PLAYER_STATE': {
			Object.entries(action.payload).forEach(elem => {
				const [key, value] = elem
				AsyncStorage.setItem(key, String(value)).catch(error =>
					console.log('AsyncStorage', error)
				)
			})
			return { ...state, ...action.payload }
		}
		default:
			return state
	}
}

export default translationReducer
