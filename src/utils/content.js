// text of book and its translations

import original from '../../assets/content'
import translations from '../../assets/translations'
import { map, orderBy } from 'lodash'
import contentTypes from '../config/contentTypes'

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
     * content type contain 3 parts: name (key), interactivity, style
     * if something is not set, will be used default values
     * @param {string} type - name of type
     */
    static getContentType = type => {
        const { default: defaultTypeObject } = contentTypes
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