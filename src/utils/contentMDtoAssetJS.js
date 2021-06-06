/**
 * 1) first level parser, that split content by # and ## (h1, h2)
 * into chapters and subchapters -- for navigation: cover + drawer
 * 2) deepest parser, content type related, for each type of content

While parsing we aim 2 goals: 
  1) To make Navigation. Split content to chapters/subchapters (ch/sch)
    which is generally to shape our source markdown into form: 
    { 001: {title, type, params, content} } 
    for both - chapters and subchapters 
  2) To make Interactivity. After split into ch/sch, 
    we finally find contentType => that we parse according to the type. 
    In general we have a sequence:

    ch => sch => contentType => interactivity => parser

    A problem is that the sequence is not preset and some elements in it are optional.
    We don't know depth of elements before we face them. 

    Some chapters can have contentType at 1st level (without subchapters)

    Some contentTypes can have several interactivities (and parsers for each of them). 
    For now it is richMedia, which can contain timing and quiz. 

    For some contentTypes (richText) we can't interpret ## as a subchapter, 
    because it is just a header inside text. 


   AN ALGORITHM 

  1. SPLIT TEXT BY H1 (#) without any conditions 

    A first block is a general info about an app for a cover (home page): 
    title, author, level, published etc 

  2. TRAVERSE H1 BLOCKS (from 2nd)

    1) If h1 block has type (richText, richMedia), it means that:
      we are also on contentType level and should parse it immediately:
          don't find any more h2 (##) blocks
          run contentType parser 

    2) Else we split h1 block into h2 blocks. 
      Then we traverse h2 blocks and run parser for each of them 
*/

import {
	splitMarkdownIntoPartsByTemplate,
	yamlParams,
	prefixedIndex
} from './utils.js'
import { parseContentType } from './contentType.js'

const h1template = new RegExp(/^\s*#{1}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')
const h2template = new RegExp(/^\s*#{2}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')

const parseMarkdown = (markdownText, h1template, h2template) => {
	const chaptersArray = splitMarkdownIntoPartsByTemplate(
		markdownText,
		h1template
	)

	const infoBlock = chaptersArray.shift()
	const { title, content: infoContent = '' } = infoBlock || {}

	const paramsArray =
		infoContent?.split('\n\n').map(elem => elem.split('\n')) || []
	// array of arrays with extra info, that we can put in different parts of Home page (app-cover)

	const info = { title, paramsArray }

	const content = chaptersArray // chaptersAndSubchapters
		.map((chapterDoc, chapterIndex) => {
			// we shouldn't find subchapters if:
			// 1) type is set => it's end point content (contentType)
			// 2) chapter hasn't subchapters
			const id = prefixedIndex(chapterIndex + 1)
			if (chapterDoc.type || !chapterDoc.content.trim()) {
				const content = parseContentType(chapterDoc, 'chapter')

				return { ...content, id }
			} else {
				const subchaptersRaw = splitMarkdownIntoPartsByTemplate(
					chapterDoc.content,
					h2template
				)
				const introText = subchaptersRaw?.[0]?.introText

				let additionalParams = {}
				if (introText) {
					subchaptersRaw.shift()
					additionalParams = yamlParams(introText)
				}

				const subchapters = subchaptersRaw.map(
					(subchapterDoc, subchapterIndex) => {
						const id = prefixedIndex(subchapterIndex + 1)
						parseContentType({ ...subchapterDoc, id })
					}
				)

				return {
					...chapterDoc,
					...additionalParams,
					content: subchapters,
					id
				}
			}
		})
	let hiddenContent = []
	const hiddenSectionStartIndex = content.findIndex(
		elem =>
			elem.title.trim().toLowerCase() === 'hidden' &&
			elem.type.toLowerCase() === 'section'
	)

	if (hiddenSectionStartIndex >= 0) {
		hiddenContent = content.splice(hiddenSectionStartIndex)
	}

	return { info, content, hiddenContent }
}

export const contentMDtoAssetJS = text =>
	parseMarkdown(text, h1template, h2template)
