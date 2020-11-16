// content type contain 3 parts: name (key), interactivity, style
// if something is not set, will be used default values
import contentTypes from '../config/contentTypes'

export const getContentType = type => {
    const { default: defaultTypeObject } = contentTypes
    // 1) type exist or not
    const typeObject = contentTypes[type.toLowerCase()] ?
        contentTypes[type] :
        defaultTypeObject
        // 2) type exist but some parts are not filled (interactivity or style)
        // and we get them from default
    let { interactivity, style } = typeObject
    if (!interactivity) interactivity = defaultTypeObject.interactivity || {}
    if (!style) style = defaultTypeObject.style || {}
    return { type, interactivity, style }
}