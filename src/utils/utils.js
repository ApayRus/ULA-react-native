import lodash from 'lodash'
const { map, orderBy } = lodash
/**
 * 
 * @param {Object} object 
 * @example 
 objectToArray( { 01:{ text:'bla1' }, 02:{ text:'bla2' }} ) 
 // [{ id:'01', text:'bla1' }, { id:'02', text:'bla2' }]
 */
export const objectToArray = object => {
    const array = map(object, (elem, key) => ({ id: key, ...elem }))
    return orderBy(array, 'id')
}

export const arrayToObject = array => {
    return array.reduce((prev, item, index) => {
        const id = prefixedIndex(index + 1)
        return {...prev, [id]: item }
    }, {})
}

/**
 *
 * @param {number} index
 * @returns {string}
 * @example
 * prefixedIndex(1) // '001'
 * prefixedIndex(45) // '045'
 * prefixedIndex(123) // '123'
 */
export const prefixedIndex = index => {
    return index.toString().padStart(3, '0')
}