/**
 * 1) first level parser, that split content by # and ## (h1, h2)
 * into chapters and subchapters -- for navigation: cover + drawer
 * 2) deepest parser, content type related, for each type of content
 */

import yaml from 'yaml'
import { arrayToObject } from './utils.js'
import { parseSubchapter } from './contentType.js'

const h1template = new RegExp(/^\s*#{1}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')
const h2template = new RegExp(/^\s*#{2}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')

export const splitMarkdownIntoPartsByTemplate = (text, template) => {
	const matches = text.matchAll(template)
	if (!text.match(template)) return [{ content: text }]
	return [...matches].map((elem, index, array) => {
		const nextElem = array[index + 1] || {}
		const nextIndex = nextElem.index || text.length
		const [headerText, title = '', , typeString = ''] = elem
		const [type, param] = typeString.split('|').map(elem => elem.trim())
		const { index: curIndex, input } = elem
		return {
			title,
			type,
			param,
			content: input.slice(curIndex, nextIndex).replace(headerText, '').trim()
		}
	})
}

const parseMarkdown = (markdownText, h1template, h2template) => {
	const chaptersArray = splitMarkdownIntoPartsByTemplate(
		markdownText,
		h1template
	)

	const infoBlock = chaptersArray.shift()
	const { title, content: infoContent } = infoBlock || {}
	const info = { title, ...yaml.parse(infoContent) }

	let chaptersAndSubchapters = chaptersArray
		.map(elem => {
			const subchapters = splitMarkdownIntoPartsByTemplate(
				elem.content,
				h2template
			).map(subchapterDoc => parseSubchapter(subchapterDoc))

			return {
				...elem,
				content: subchapters
			}
		})
		.map(chapter => {
			let { content } = chapter
			content = arrayToObject(content)
			return { ...chapter, content }
		})

	const content = arrayToObject(chaptersAndSubchapters)

	return { info, content }
}

export const contentMDtoAssetJS = text =>
	parseMarkdown(text, h1template, h2template)
