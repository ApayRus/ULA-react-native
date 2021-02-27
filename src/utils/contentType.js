/**
 * Each content type has its own parser.
 */

import { parseSubs as frazyParseSubs } from 'frazy-parser'
import { prefixedIndex, splitMarkdownIntoPartsByTemplate } from './utils.js'
import contentTypeInteractivity from '../config/contentTypeInteractivity.js'
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
export const parseContentType = (contentTypeDoc, level) => {
	const { title, type: typeRaw, content } = contentTypeDoc

	const type = typeRaw ? typeRaw : title

	// switcher between parsers for each content type
	const typeParserMap = {
		oneLineOneFile: parseTypeOneLineOneFile,
		media: parseTypeMedia,
		inText: parseTypeInText
	}

	const interactivity =
		contentTypeInteractivity[type] ||
		contentTypeInteractivity?.default ||
		'oneLineOneFile'
	const parserFunction = typeParserMap[interactivity]
	const parsedContent = parserFunction
		? parserFunction(content, level)
		: content
	return { ...contentTypeDoc, content: parsedContent }
}

/**
 * Media can have
 * @param {string} text - markdown text
 *
 */
const parseTypeMedia = (text, level) => {
	const h3template = new RegExp(/^\s*#{3}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')
	const h2template = new RegExp(/^\s*#{2}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')
	const template = level === 'chapter' ? h2template : h3template
	const splitedMediaBlocks = splitMarkdownIntoPartsByTemplate(text, template)

	const { content: phrasesText } =
		splitedMediaBlocks.find(elem => {
			const { title, type } = elem
			const phrasesSynonyms = ['timing', 'captions', 'phrases', 'subtitles']
			return phrasesSynonyms.includes(title || type)
		}) || {}

	const phrases = parseTypeTiming(phrasesText)
	return { phrases }
}

/**
 * it is sub-type for type Media
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
export const parseTypeInText = markdownText => ({ markdownText })
