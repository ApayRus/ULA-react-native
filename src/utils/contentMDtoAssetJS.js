const marked = require('marked')

marked.use({ smartypants: true }) //"smart" typographic punctuation for things like quotes and dashes.

const makeArrayFromMarkdown = mdFileContent =>
    marked
    .lexer(mdFileContent) // raw array with many unnecessary fields
    .filter(elem => elem.type !== 'space')
    .map(elem => {
        const { type, depth, tokens = [] } = elem
        const { text } = tokens[0] || {}
        const joinedType = depth ? type[0] + depth : type[0]
        return { type: joinedType, text }
    })

const prefixedIndex = index => {
    return index.toString().padStart(3, '0')
}

// object { key: param }
const parseInfoParagraph = text => {
    const rowsArray = text.split('\n')
    const info = rowsArray.reduce((prev, item) => {
        const [key, value] = item.split(':')
        return {...prev, [key]: value.trim() }
    }, {})
    return info
}

// object with number keys '001, 002, ...'
const parseParagraph = pText => {
    const rowsArray = pText.split('\n')
    const info = rowsArray.reduce((prev, item, index) => {
        const rowIndex = prefixedIndex(index + 1)
        return {...prev, [rowIndex]: { text: item.trim() } }
    }, {})
    return info
}

const parseInfoArray = infoArray => {
    return infoArray.reduce((prev, item) => {
        const { type, text } = item
        if (type === 'h1') return { title: text }
        if (type === 'p') return {...prev, ...parseInfoParagraph(text) }
    }, {})
}

const parseChaptersArray = markdownArray => {
    const chaptersArray = []
    let chapter = {}
    let subchapterName = ''
    let subchapterIndex = 0

    markdownArray.forEach((elem, index, array) => {
        const { type, text } = elem
        const { type: nextType } = array[index + 1] || {}
        const isEndOfChapter = nextType === 'h2' || !array[index + 1]
        if (type === 'h2') {
            chapter = { title: text, subchapters: {} }
        }
        if (type === 'h3') {
            subchapterName = text
        }
        if (type === 'p') {
            subchapterIndex++
            const subchapterId = prefixedIndex(subchapterIndex)
            chapter.subchapters[subchapterId] = {
                title: subchapterName,
                content: parseParagraph(text)
            }
        }
        if (isEndOfChapter) {
            chaptersArray.push(chapter)
            subchapterIndex = 0
        }
    })

    const result = chaptersArray.reduce((prev, item, index) => {
        const chapterIndex = prefixedIndex(index + 1)
        return {...prev, [chapterIndex]: item }
    }, {})

    return result
}

const contentMDtoAssetJS = mdFileContent => {
    const markdownArray = makeArrayFromMarkdown(mdFileContent)
    const elementTypesArray = markdownArray.map(elem => elem.type)
    const infoEndIndex = elementTypesArray.indexOf('h2')

    const infoArray = markdownArray.slice(0, infoEndIndex)
    const chaptersArray = markdownArray.slice(infoEndIndex)

    const info = parseInfoArray(infoArray)
    const chapters = parseChaptersArray(chaptersArray)

    return { info, chapters }
}

module.exports = { contentMDtoAssetJS }