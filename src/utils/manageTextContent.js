// text of book and its translations

import textContent from '../../assets/content'
import translations from '../../assets/translations'
import { map, orderBy } from 'lodash'

// main content
export const getChapters = () => {
    const { chapters: chaptersRaw } = textContent
    let chapters = map(chaptersRaw, (elem, key) => {
        const { title = '???' } = elem
        return { id: key, title }
    })
    chapters = orderBy(chapters, 'id')
    return chapters
}

export const getChapter = chapterId => {
    const chapterDoc = textContent.chapters[chapterId]
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
        const trDoc = translations[trLang]['default']['chapters'][chapterId] || {}
        return trDoc
    } catch (e) {
        console.log('translation error, ', e)
        return {}
    }
}

// object { chapterId: { title: "Chapter title" }, ... }
export const getTrChapters = trLang => {
    try {
        let chapters = translations[trLang]['default']['chapters']
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