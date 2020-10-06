import { map, orderBy } from 'lodash'

/**
 * 
 * @param {Object} object 
 * @example 
 objectToArray( { 01:{ text:'bla1' }, 02:{ text:'bla2' }} ) 
 // [{ id:'01', text:'bla1' }, { id:'02', text:'bla2' }]
 */
export function objectToArray(object) {
    const array = map(object, (elem, key) => ({ id: key, ...elem }))
    return orderBy(array, 'id')
}