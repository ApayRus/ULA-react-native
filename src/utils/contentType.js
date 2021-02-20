/**
 * Each content type has its own parser.
 */

import {
	parseSubs as frazyParseSubs,
	parseText as frazyParseText,
	mediaRegex,
	mediaParser,
	quizRegex,
	quizParser,
	inTextSoundedWordReplacer
} from 'frazy-parser'
import { prefixedIndex } from './utils.js'
import contentTypes from '../config/contentTypes.js'
import marked from 'marked'

marked.use({
	gfm: false,
	smartypants: true // additional typography like long tire -- , etc
})

/**
 * get Subchapter with plain content,
 * choose proper parser by type
 * returns subchapter with parsed content
 *
 * @param {*} chapterId
 * @param {*} subchapterId
 * @param {*} contentTypeDoc
 */
export const parseSubchapter = contentTypeDoc => {
	const { title, type: typeRaw, content } = contentTypeDoc

	const type = typeRaw ? typeRaw : title

	const contentTypeInfo = getContentType(type)

	// switcher between parsers for each content type
	const typeParserMap = {
		oneLineOneFile: parseTypeOneLineOneFile,
		timing: parseTypeTiming,
		inText: parseTypeInText
	}

	const { interactivity } = contentTypeInfo
	const parserFunction = typeParserMap[interactivity]
	const parsedContent = parserFunction ? parserFunction(content) : content
	return { ...contentTypeDoc, content: parsedContent }
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
	const html = marked(textContent)
	const content = frazyParseText(
		html,
		[
			{ label: 'media', regex: mediaRegex, parser: mediaParser },
			{ label: 'quiz', regex: quizRegex, parser: quizParser },
			{ label: 'text', replacers: [inTextSoundedWordReplacer] }
		],
		'text'
	)
	// console.log('content', content)
	return content
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

	let { interactivity, style } = typeObject
	if (!interactivity) interactivity = defaultTypeObject.interactivity || {}
	if (!style) style = defaultTypeObject.style || {}
	return { type, interactivity, style }
}
