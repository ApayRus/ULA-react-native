import { map } from 'lodash'

/**
 * 
 * @param {Object} object 
 * @example 
 objectToArray( { 01:{ text:'bla1' }, 02:{ text:'bla2' }} ) 
 // [{ id:'01', text:'bla1' }, { id:'02', text:'bla2' }]
 */
export function objectToArray(object) {
    return map(object, (elem, key) => ({ id: key, ...elem }))
}