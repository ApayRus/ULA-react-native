import yaml from 'yaml'
import marked from 'marked'

import { arrayToObject } from './utils.js'
import { parseSubs as frazyParseSubs } from 'frazy-parser'
import { prefixedIndex } from './utils'
import { Content } from './content'

marked.use({
    smartypants: true // additional typography like long tire -- , etc
})

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
        )
        return {
            ...elem,
            content: subchapters
        }
    })

    chaptersAndSubchapters = chaptersAndSubchapters.map(chapter => {
        let { content } = chapter
        content = arrayToObject(content)
        return {...chapter, content }
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

/**
 * get Subchapter with plain content,
 * choose proper parser by type
 * returns subchapter with parsed content
 *
 * @param {*} chapterId
 * @param {*} subchapterId
 * @param {*} subchapterDoc
 */
const parseSubchapter = (chapterId, subchapterId, subchapterDoc) => {
    const { content } = subchapterDoc

    const contentTypeDoc = Content.getContentType(chapterId, subchapterId)

    // switcher between parsers for each content type
    const typeParserMap = {
        oneLineOneFile: parseTypeOneLineOneFile,
        timing: parseTypeTiming,
        inText: parseTypeInText
    }

    const { interactivity } = contentTypeDoc
    const parserFunction = typeParserMap[interactivity]
    const parsedContent = parserFunction ? parserFunction(content) : content
    return {...subchapterDoc, content: parsedContent }
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
        return {...prev, [rowIndex]: { text } }
    }, {})
    return obj
}

/**
 *
 * @param {string} textContent
 * @returns {string} - html
 */
const parseTypeInText = textContent => {
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