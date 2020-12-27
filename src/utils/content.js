// text of book and its translations

import original from '../../assets/content'
import translations from '../../assets/translations'
import { map, orderBy } from 'lodash'
import { parseSubs as frazyParseSubs } from 'frazy-parser'
import { prefixedIndex } from './utils'
import marked from 'marked'
import contentTypes from '../config/contentTypes'

marked.use({
    renderer: {
        paragraph: text => text //by default renderer returns <p></p> for any text line
    },
    smartypants: true // additional typography like long tire -- , etc
})

export class Content {
    constructor(original, translations) {
        this.original = original
        this.translations = translations
    }

    // main content

    getInfo() {
        const { info } = this.original
        return info
    }

    /**
     * @returns ['ru', 'en', 'es']
     */
    getTranslations() {
        const { translations } = this.original
        return translations
    }

    /**
     * @returns titles of chapters
     */
    getChapterTitles() {
        const { content: chaptersRaw } = this.original
        let chapters = map(chaptersRaw, (elem, key) => {
            const { title = '???' } = elem
            return { id: key, title }
        })
        chapters = orderBy(chapters, 'id')
        return chapters
    }

    // object { chapterId: { title: "Chapter title" }, ... }
    getChapterTitlesTr(trLang) {
        if (!trLang) return {}
        try {
            let chapters = this.translations[trLang]['default']['content']
            chapters = map(chapters, (elem, key) => {
                const { title = '???' } = elem
                return { id: key, title }
            })
            return chapters.reduce(
                (prev, item) => ({...prev, [item.id]: { title: item.title } }), {}
            )
        } catch (e) {
            console.log('translation error, ', e)
            return {}
        }
    }

    getChapter(chapterId) {
        const chapterDoc = this.original.content[chapterId]
        return chapterDoc
    }

    // array [ { id, title }, ... ]
    getChapterTr(trLang, chapterId) {
        if (!(trLang && chapterId)) return {}
        try {
            const trDoc =
                this.translations[trLang]['default']['content'][chapterId] || {}
            return trDoc
        } catch (e) {
            console.log('translation error, ', e)
            return {}
        }
    }

    /**
     * get Subchapter with plain content,
     * choose proper parser by type
     * returns subchapter with parsed content
     *
     * @param {*} chapterId
     * @param {*} subchapterId
     * @param {*} subchapterDoc
     */
    parseSubchapter(chapterId, subchapterId, subchapterDoc) {
        const { content } = subchapterDoc

        const contentTypeDoc = this.getContentType(chapterId, subchapterId)

        // switcher between parsers for each content type
        const typeParserMap = {
            oneLineOneFile: Content.parseTypeOneLineOneFile,
            timing: Content.parseTypeTiming,
            inText: Content.parseTypeInText
        }

        const { interactivity } = contentTypeDoc
        const parserFunction = typeParserMap[interactivity]
        const parsedContent = parserFunction ? parserFunction(content) : content
        return {...subchapterDoc, content: parsedContent }
    }

    getSubchapter(chapterId, subchapterId) {
        const subchapterDoc = this.original.content[chapterId].content[subchapterId]
        const parsedSubchapterDoc = this.parseSubchapter(
            chapterId,
            subchapterId,
            subchapterDoc
        )
        return parsedSubchapterDoc
    }

    getSubchapterTr(trLang, chapterId, subchapterId) {
        if (!(trLang && chapterId && subchapterId)) return {}
        try {
            const subchapterDoc =
                this.translations[trLang].default.content[chapterId].content[
                    subchapterId
                ] || {}
            const parsedSubchapterDoc = this.parseSubchapter(
                chapterId,
                subchapterId,
                subchapterDoc
            )
            return parsedSubchapterDoc
        } catch (e) {
            console.log('translation error, ', e)
            return {}
        }
    }

    /**
     *
     * @param {string} subsText
     * @returns {object} - phrases {start, end, text, voiceName}
     */
    static parseTypeTiming = subsText => {
        // frazyParseSubs extracts text of phrase into tricky object {start, end, body:[{voice}]} for support multiple voices
        // we don't need many voices (it's hard to handle this nested array of objects)
        // then we extract it into plain object {start, end, text, voiceName}

        const parsedSubs = frazyParseSubs(subsText)

        if (!parsedSubs) return {}
        const phrasesObject = {}

        for (let key in parsedSubs) {
            const { start, end, body = [] } = parsedSubs[key] || {}
            const [bodyFirstObject] = body
            const { voice: { name: voiceName } = {}, text = '' } =
            bodyFirstObject || {}
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
    static parseTypeOneLineOneFile = text => {
        if (!text) return {}
        const rowsArray = text.split('\n')
        const obj = rowsArray.reduce((prev, item, index) => {
            const rowIndex = prefixedIndex(index + 1)
            const text = marked(item.trim())
            return {...prev, [rowIndex]: { text } }
        }, {})
        return obj
    }

    /**
     *
     * @param {string} textContent
     * @returns {string} - html
     */
    static parseTypeInText = textContent => {
        let html = marked(textContent)
        html = Content.extractIntextShortcutIntoTags(html)
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
    static extractIntextShortcutIntoTags = htmlText => {
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
    getContentType = (chapterId, subchapterId) => {
        const subchapterDoc = this.original.content[chapterId].content[subchapterId]
        const { type: typeRaw, title } = subchapterDoc
        const { default: defaultTypeObject } = contentTypes
        const type = typeRaw ? typeRaw : title // if type not set, it is the same as title
            // 1) type exist or not
        const typeObject = contentTypes[type] ?
            contentTypes[type] :
            defaultTypeObject
            // 2) type exist but some parts are not filled (interactivity or style)
            // and we get them from default
        let { interactivity, style } = typeObject
        if (!interactivity) interactivity = defaultTypeObject.interactivity || {}
        if (!style) style = defaultTypeObject.style || {}
        return { type, interactivity, style }
    }
}

const content = new Content(original, translations)

export default content