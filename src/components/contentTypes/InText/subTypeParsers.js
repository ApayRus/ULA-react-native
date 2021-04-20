import matchAll from 'string.prototype.matchall'
import { parseText } from 'frazy-parser'

/**
 *
 * @param {string} text - [media|path/to/file|param1|param2]
 * @returns {string[]} - ['path/to/file', 'param1', 'param2']
 */
export const mediaParser = rawText => {
	const regex = new RegExp(/\[(.+?)\]/)
	const match = rawText?.match(regex)
	if (!match) return null
	const [, paramsString = ''] = match || []
	const paramsArray = paramsString.split('|')?.map(elem => elem.trim())
	if (paramsArray[0]?.toLowerCase() !== 'media') return null
	const [, pathToMedia, ...params] = paramsArray
	return { pathToMedia, params }
}

const soundedWordRegex = new RegExp(/\{(.+?)\}/g)

/**
 *
 * @param {string} text - [[ text | path/to/file | param1 | param2 ]]
 * @returns {string[]} - ['text', 'path/to/file', 'param1', 'param2']
 */
const soundedWordParser = rawText => {
	const soundedWordRegex = new RegExp(/\{(.+?)\}/)
	const match = rawText?.match(soundedWordRegex)
	if (!match) return null
	const [, paramsString = ''] = match || []
	const paramsArray = paramsString.split('|')?.map(elem => elem.trim())
	// first param is path
	const [text, path, ...params] = paramsArray
	return { text, path, params }
}

const ordinaryWordParser = rawText => {
	return { text: rawText }
}

/**
 * labels content to sounded and ordinary
 * @param {string} rawText
 */
export const textWithSoundedWordsParser = rawText => {
	return parseText(
		rawText,
		[
			{
				label: 'soundedText',
				regex: soundedWordRegex,
				parser: soundedWordParser
			},
			{ label: 'ordinaryText', parser: ordinaryWordParser }
		],
		'ordinaryText'
	)
}

export const quizParser = rawText => {
	const quizRegex = /^\s*[\-\*]\s*([\(\[])(.*?)([\]\)])\s*(.+)$/
	const matches = [...matchAll(rawText, new RegExp(quizRegex, 'gm'))]
	if (!matches.length) {
		return null
	}
	const firstBrace = matches[0][1]
	const type = firstBrace === '(' ? 'single' : 'multiple'
	const correctAnswers = []

	const variants = matches.map((elem, index) => {
		const [, , answerSign, , text] = elem
		if (answerSign.trim()) {
			correctAnswers.push(index)
		}
		return { text }
	})

	return { variants, correctAnswers, type }
}
