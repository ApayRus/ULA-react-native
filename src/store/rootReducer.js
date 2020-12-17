import { combineReducers, createStore } from 'redux'
import translationReducer from './translationReducer'
import playerStateReducer from './playerStateReducer'

const rootReducer = combineReducers({
	translation: translationReducer,
	playerState: playerStateReducer
})

const initialState = {}

const store = createStore(rootReducer, initialState)

export default store
