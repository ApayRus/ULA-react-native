/**
 * Each content type has its own parser.
 */

import { parseSubs as frazyParseSubs } from 'frazy-parser'
import { prefixedIndex } from './utils.js'
import contentTypes from '../config/contentTypes.js'
import marked from 'marked'

marked.use({
	smartypants: true // additional typography like long tire -- , etc
})

/**
 * get Subchapter with plain content,
 * choose proper parser by type
 * returns subchapter with parsed content
 *
 * @param {*} chapterId
 * @param {*} subchapterId
 * @param {*} subchapterDoc
 */
export const parseSubchapter = subchapterDoc => {
	const { title, type: typeRaw, content } = subchapterDoc

	const type = typeRaw ? typeRaw : title

	const contentTypeDoc = getContentType(type)

	// switcher between parsers for each content type
	const typeParserMap = {
		oneLineOneFile: parseTypeOneLineOneFile,
		timing: parseTypeTiming,
		inText: parseTypeInText
	}

	const { interactivity } = contentTypeDoc
	const parserFunction = typeParserMap[interactivity]
	const parsedContent = parserFunction ? parserFunction(content) : content
	return { ...subchapterDoc, content: parsedContent }
}

/**
 *
 * @param {string} subsText
 * @returns {object} - phrases {start, end, text, voiceName}
 */
const parseTypeTiming = subsText => {
	// frazyParseSubs extracts text of phrase into tricky object {start, end, body:[{voice}]} for support multiple voices
	// we don't need many voices (it's hard to handle this nested array of objects)
	// then we extract it into plain object {start, end, text, voiceName}

	const parsedSubs = frazyParseSubs(subsText)

	if (!parsedSubs) return {}
	const phrasesObject = {}

	for (let key in parsedSubs) {
		const { start, end, body = [] } = parsedSubs[key] || {}
		const [bodyFirstObject] = body
		const { voice: { name: voiceName } = {}, text = '' } = bodyFirstObject || {}
		phrasesObject[key] = { start, end, text, voiceName }
	}

	const emptyPhrase = { start: 0, end: 0, text: '' } // for add empty space before 1-st phrase
	phrasesObject['000'] = emptyPhrase // empty phrase

	return phrasesObject
}

/**
 *
 * @param {string} text
 * @returns {object} - phrases {id:{text}}
 */
const parseTypeOneLineOneFile = text => {
	if (!text) return {}
	const rowsArray = text.split('\n')
	const obj = rowsArray.reduce((prev, item, index) => {
		const rowIndex = prefixedIndex(index + 1)
		const renderer = new marked.Renderer()
		renderer.paragraph = text => text //by default renderer returns <p></p> for any text line
		const text = marked(item.trim(), {
			renderer
		})
		return { ...prev, [rowIndex]: { text } }
	}, {})
	return obj
}

/**
 *
 * @param {string} textContent
 * @returns {string} - html
 */
export const parseTypeInText = textContent => {
	let html = marked(textContent)
	html = extractIntextShortcutIntoTags(html)
	return html
}

/**
 *
 * @param {string} htmlText - multiline text
 * @returns {string}
 * @example
 * const exampleText = 'There is some text with [[ sounded word ]] or [[sounded phrase | path to file]]'
 * convertInTextShortcutIntoTags(exampleText)
 * // 'There is some text with <inText text="sounded word" path="" /> or <inText text="sounded phrase" path="path to file" />'
 * // () ===> <inText text="some text" path="path to file" />
 */
const extractIntextShortcutIntoTags = htmlText => {
	const inTextShortcutTemplate = new RegExp(
		/\[\[\s*(.+?)\s*(\|\s*(.+?)\s*)?\]\]/gm
	) // [[ sounded word ]] or [[sounded phrase | path to file]]

	return htmlText.replace(
		inTextShortcutTemplate,
		'<intext text="$1" path="$3"></intext>'
	)
}

/**
 * content type contain 3 parts: name (key), interactivity, style
 * if something is not set, will be used default values
 * @param {string} type - name of type
 */
export const getContentType = type => {
	const { default: defaultTypeObject } = contentTypes
	// 1) type exist or not
	const typeObject = contentTypes[type] ? contentTypes[type] : defaultTypeObject
	// 2) type exist but some parts are not filled (interactivity or style)
	// and we get them from

	console.log('type', type)
	console.log('typeObject', typeObject)

	let { interactivity, style } = typeObject
	if (!interactivity) interactivity = defaultTypeObject.interactivity || {}
	if (!style) style = defaultTypeObject.style || {}
	return { type, interactivity, style }
}
