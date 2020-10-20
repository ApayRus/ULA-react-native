import { combineReducers, createStore } from 'redux'
import translationReducer from './translationReducer'

const rootReducer = combineReducers({
    translation: translationReducer
})

const initialState = {}

const store = createStore(
    rootReducer,
    initialState)

export default store