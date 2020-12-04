// text of book and its translations

import textContent from '../../assets/content'
import translations from '../../assets/translations'
import { map, orderBy } from 'lodash'

// main content
export const getChapters = () => {
    const { content: chaptersRaw } = textContent
    let chapters = map(chaptersRaw, (elem, key) => {
        const { title = '???' } = elem
        return { id: key, title }
    })
    chapters = orderBy(chapters, 'id')
    return chapters
}

export const getChapter = chapterId => {
    const chapterDoc = textContent.content[chapterId]
    return chapterDoc
}

export const getInfo = () => {
    const { info } = textContent
    return info
}

export const getTranslations = () => {
    const { translations } = textContent
    return translations
}

// translations

// array [ { id, title }, ... ]
export const getTrChapter = (trLang, chapterId) => {
    try {
        const trDoc = translations[trLang]['default']['content'][chapterId] || {}
        return trDoc
    } catch (e) {
        console.log('translation error, ', e)
        return {}
    }
}

// object { chapterId: { title: "Chapter title" }, ... }
export const getTrChapters = trLang => {
    try {
        let chapters = translations[trLang]['default']['content']
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
export const convertInTextShortcutIntoTags = htmlText => {
    const inTextShortcutTemplate = new RegExp(
            /\[\[\s*(.+?)\s*(\|\s*(.+?)\s*)?\]\]/gm
        ) // [[ sounded word ]] or [[sounded phrase | path to file]]

    return htmlText.replace(
        inTextShortcutTemplate,
        '<intext text="$1" path="$3"></intext>'
    )
}