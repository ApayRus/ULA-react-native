import AsyncStorage from '@react-native-community/async-storage'

const initState = {
    trLang: '',
    showTranslation: true
}

const translationReducer = (state = initState, action) => {
    switch (action.type) {
        case 'SET_TRANSLATION':
            {
                Object.entries(action.payload).forEach(elem => {
                    const [key, value] = elem
                    AsyncStorage.setItem(key, value)
                })
                return {...state, ...action.payload }
            }
        default:
            return state
    }
}

export default translationReducer