/**
 * 1) first level parser, that split content by # and ## (h1, h2)
 * into chapters and subchapters -- for navigation: cover + drawer
 * 2) deepest parser, content type related, for each type of content
 */

/* 
  While parsing we aim 2 goals: 
  1) To make Navigation. Split content to chapters/subchapters (ch/sch)
    which is generally to shape our source markdown into form: 
    { 001: {title, type, params, content} } 
    for both - chapters and subchapters 
  2) To make Interactivity. After split into ch/sch, 
    we finally find contentType => that we parse according to the type. 
    In general we have a sequance:

    ch => sch => contentType => interactivity => parser

    A problem is that the sequance is not preset and some elements in it are optional.
    We don't know depth of elements before we face them. 

    Some chapters can have contentType at 1st level (without subchapters)

    Some contentTypes can have several interactivities (and parsers for each of them). 
    For now it is media, which can contain timing and quiz. 

    For some contentTypes (inText) we can't interpret ## as a subchapter, 
    because it is just a header inside text. 


   AN ALGORITHM 

  1. SPLIT TEXT BY H1 (#) without any conditions 

    A first block is a general info about an app for a cover (home page): 
    title, author, level, published etc 

  2. TRAVERSE H1 BLOCKS (from 2nd)

    1) If h1 block has type (text, media), it means that:
      we are also on contentType level and should parse it immediatelly:
          don't find any more h2 (##) blocks
          run contentType parser 

    2) Else we split h1 block into h2 blocks. 
      Then we traverse h2 blocks and run parser for each of them 

*/

import yaml from 'yaml'
import { arrayToObject, splitMarkdownIntoPartsByTemplate } from './utils.js'
import { parseContentType } from './contentType.js'

const h1template = new RegExp(/^\s*#{1}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')
const h2template = new RegExp(/^\s*#{2}\s+(.+?)\s*(\[(.+?)\])?\s*$/, 'gm')

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
			).map(subchapterDoc => parseContentType(subchapterDoc))

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
