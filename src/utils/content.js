// text of book and its translations

import original from '../../assets/content'
import translations from '../../assets/translations'
import files from '../../assets/contentFilesMap'
import { map, orderBy } from 'lodash'
import { prefixedIndex, getNextPrefixedIndex } from './utils'
import store from '../store/rootReducer'

export class Content {
	constructor(original, translations, files) {
		this.original = original
		this.translations = translations
		this.files = files
	}

	// main content

	getInfo() {
		const { info } = this.original
		return info
	}
	getInfoTr(trLang) {
		if (!trLang) return {}
		const info = this?.translations?.[trLang]?.default?.info || {}
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
	getChapterTitlesTr() {
		const { trLang } = store.getState().translation

		if (!trLang) return {}
		let chapters = this?.translations?.[trLang]?.default?.content
		if (!chapters) return {}
		chapters = map(chapters, (elem, key) => {
			const { title = '???' } = elem
			return { id: key, title }
		})
		return chapters.reduce(
			(prev, item) => ({ ...prev, [item.id]: { title: item.title } }),
			{}
		)
	}

	getChapterTitle(chapterId) {
		const chapterTitle = this?.original?.content?.[chapterId]?.title
		return chapterTitle
	}

	getChapterTitleTr(chapterId) {
		const { trLang } = store.getState().translation
		const chapterTitle = this?.translations?.[trLang]?.default?.content?.[
			chapterId
		]?.title
		return chapterTitle
	}

	getSubchapterTitle(chapterId, subchapterId) {
		const subchapterTitle = this?.original?.content?.[chapterId]?.content?.[
			subchapterId
		]?.title
		return subchapterTitle
	}

	getSubchapterTitleTr(chapterId, subchapterId) {
		const { trLang } = store.getState().translation
		const chapterTitle = this?.translations?.[trLang]?.default?.content?.[
			chapterId
		]?.content?.[subchapterId]?.title
		return chapterTitle
	}

	getChapterSubchapterTitlesWithTr(chapterId, subchapterId) {
		const chapterTitle = this.getChapterTitle(chapterId)
		const chapterTitleTr = this.getChapterTitleTr(chapterId)
		const subchapterTitle = this.getSubchapterTitle(chapterId, subchapterId)
		const subchapterTitleTr = this.getSubchapterTitleTr(chapterId, subchapterId)
		return { chapterTitle, chapterTitleTr, subchapterTitle, subchapterTitleTr }
	}

	// object to array:
	// [{ id, title, type, content: [{ id, title, type }] }]
	getTableOfContent() {
		return Object.keys(this.original.content)
			.map(key => {
				const id = key
				const chapterParams = { ...this.original.content[key] }
				const { content: contentObject } = chapterParams
				const subchapters = Object.keys(contentObject)
					.map(key => {
						const id = key
						const { title, type } = contentObject[key]
						return { id, title, type }
					})
					.filter(elem => Boolean(elem.title)) //don't show 'phrases' from media, when chapter is without subchapters
					.sort((a, b) => a.id.localeCompare(b.id))
				return { id, ...chapterParams, subchapters }
			})
			.sort((a, b) => a.id.localeCompare(b.id))
	}

	getChapter(chapterId) {
		const chapterDoc = this?.original?.content?.[chapterId]
		return chapterDoc
	}

	// array [ { id, title }, ... ]
	getChapterTr(chapterId) {
		const { trLang } = store.getState().translation
		if (!(trLang && chapterId)) return {}
		const trDoc =
			this?.translations?.[trLang]?.default?.content?.[chapterId] || {}
		return trDoc
	}

	getSubchapter(chapterId, subchapterId) {
		const subchapterDoc = this?.original?.content?.[chapterId]?.content[
			subchapterId
		]
		return subchapterDoc
	}

	getSubchapterTr(chapterId, subchapterId) {
		const { trLang } = store.getState().translation
		if (!(trLang && chapterId && subchapterId)) return {}
		const subchapterDoc =
			this?.translations?.[trLang]?.default?.content?.[chapterId]?.content?.[
				subchapterId
			] || {}
		return subchapterDoc
	}
	getPhrases(chapterId, subchapterId, arrayOfIndexes) {
		const { content: contentTypeDoc } = this.original.content[
			chapterId
		].content[subchapterId]
		const phrases = arrayOfIndexes.map(phraseIndex => {
			const phraseId = prefixedIndex(phraseIndex)
			const phrase = contentTypeDoc[phraseId]
			return phrase
		})
		return phrases
	}
	getPhrasesTr(chapterId, subchapterId, arrayOfIndexes) {
		const { trLang } = store.getState().translation
		const { content: contentTypeDoc } = this.translations[
			trLang
		].default.content[chapterId].content[subchapterId]
		const phrases = arrayOfIndexes.map(phraseIndex => {
			const phraseId = prefixedIndex(phraseIndex)
			const phrase = contentTypeDoc[phraseId]
			return phrase
		})
		return phrases
	}

	getNextContentItem(chapterId = '', subchapterId = '') {
		const nextSubchapterId = getNextPrefixedIndex(subchapterId)

		// same chapter, next subchapter
		const nextSubchapterExist = Boolean(
			this.getSubchapterTitle(chapterId, nextSubchapterId)
		)

		const checkNextChapter = chapterId => {
			const nextChapterId = getNextPrefixedIndex(chapterId)
			const nextChapterExist = Boolean(this.getChapterTitle(nextChapterId))
			if (nextChapterExist) {
				return { nextChapterId }
			} else {
				return null // we faced end of the content
			}
		}

		if (!subchapterId) {
			if (nextSubchapterExist) {
				//we are on chapter page - list of subchapters
				return { nextChapterId: chapterId, nextSubchapterId }
			} else {
				// we are on chapter page without subchapters
				return checkNextChapter(chapterId)
			}
		}
		if (nextSubchapterExist) {
			return { nextChapterId: chapterId, nextSubchapterId }
		} else {
			return checkNextChapter(chapterId)
		}
	}

	/* files is an object like:
 	{
		content: {
			audios: {
				'001': {
					'002': { '003.mp3': require('../content/audios/001/002/003.mp3') }
				}
			}
		}
		@returns 1 or more files (in object)
	} */
	getFilesByPathArray = pathArray => {
		try {
			return pathArray.reduce((prev, item) => prev[item], this.files)
		} catch (err) {
			// console.log('getFilesByPathArray', err)
			return null
		}
	}
	getFilesByPathString = pathString => {
		const pathArray = ['content', ...pathString.split('/')]
		return this.getFilesByPathArray(pathArray)
	}
	/**
	 * prepares fonts for useFont hook
	 */
	getFonts() {
		const { fonts: fontsRaw } = this.getFilesByPathArray(['content'])
		const fonts = {}
		// will be: { Inter_400Regular: require(/path), Scheherazade_400Regular: require(/path) }
		for (let key in fontsRaw) {
			const { file } = fontsRaw[key]
			fonts[key] = file
		}
		return fonts
	}
}

const content = new Content(original, translations, files)

export default content
