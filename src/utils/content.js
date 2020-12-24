// text of book and its translations

import original from '../../assets/content'
import translations from '../../assets/translations'
import { map, orderBy } from 'lodash'

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

    getChapter(chapterId) {
        const chapterDoc = this.original.content[chapterId]
        return chapterDoc
    }

    getSubchapter(chapterId, subchapterId) {
        const subchapterDoc = this.original.content[chapterId][subchapterId]
        return subchapterDoc
    }

    // translations

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

    getSubchapterTr(trLang, chapterId, subchapterId) {
        if (!(trLang && chapterId && subchapterId)) return {}
        try {
            const trDoc =
                this.translations[trLang]['default']['content'][chapterId][
                    subchapterId
                ] || {}
            return trDoc
        } catch (e) {
            console.log('translation error, ', e)
            return {}
        }
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
}

const content = new Content(original, translations)

export default content