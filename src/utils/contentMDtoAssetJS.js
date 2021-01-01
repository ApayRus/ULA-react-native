import yaml from 'yaml'

import { arrayToObject } from './utils.js'
import { parseSubchapter } from './contentType.js'

const h1template = new RegExp(/^\s*#{1}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'm')
const h2template = new RegExp(/^\s*#{2}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')
const h3template = new RegExp(/^\s*#{3}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')

// const h2s =
const extractInfo = (markdownText, h1template, h2template) => {
	const firstH2match = [...markdownText.matchAll(h2template)][0]
	const { index: firstH2Index } = firstH2match
	let infoText = markdownText.slice(0, firstH2Index)
	const h1Match = infoText.match(h1template)
	const [headerText, title = ''] = h1Match
	infoText = infoText.replace(headerText, '').trim()
	const info = yaml.parse(infoText)
	return { title, ...info }
}

const splitMarkdownIntoPartsByTemplate = (text, template) => {
	const matches = text.matchAll(template)
	if (!text.match(template)) return [{ content: text }]
	return [...matches].map((elem, index, array) => {
		const nextElem = array[index + 1] || {}
		const nextIndex = nextElem.index || 1000000000
		const [headerText, title = '', , type = ''] = elem
		const { index: curIndex, input } = elem
		return {
			title,
			type,
			content: input.slice(curIndex, nextIndex).replace(headerText, '').trim()
		}
	})
}

const extractContent = (markdownText, h2template, h3template) => {
	const chaptersArray = splitMarkdownIntoPartsByTemplate(
		markdownText,
		h2template
	)

	let chaptersAndSubchapters = chaptersArray.map(elem => {
		const subchapters = splitMarkdownIntoPartsByTemplate(
			elem.content,
			h3template
		).map(subchapterDoc => parseSubchapter(subchapterDoc))

		return {
			...elem,
			content: subchapters
		}
	})

	chaptersAndSubchapters = chaptersAndSubchapters.map(chapter => {
		let { content } = chapter
		content = arrayToObject(content)
		return { ...chapter, content }
	})

	chaptersAndSubchapters = arrayToObject(chaptersAndSubchapters)

	return chaptersAndSubchapters
}

// console.log("chaptersAndSubchaptersArray", JSON.stringify(chaptersAndSubchapters, null, '\t'));
const parseMarkdown = (mdFileContent, h1template, h2template, h3template) => {
	const info = extractInfo(mdFileContent, h1template, h2template)
	const content = extractContent(mdFileContent, h2template, h3template)
	return { info, content }
}

export const contentMDtoAssetJS = text =>
	parseMarkdown(text, h1template, h2template, h3template)
