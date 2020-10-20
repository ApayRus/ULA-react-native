const initState = {
    trLang: ''
}

const translationReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CHANGE_TR_LANG':
            {
                return {...state, ...action.payload }
            }
        default:
            return state
    }
}

export default translationReducer