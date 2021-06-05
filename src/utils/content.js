// text of book and its translations

import original from '../../assets/content'
import translations from '../../assets/translations'
import files from '../../assets/contentFilesMap'
import { map, orderBy } from 'lodash'
import store from '../store/rootReducer'
import { getInteractivity as getInteractivityFromStyles } from '../styles/contentType'

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
		const chapterTitle =
			this?.translations?.[trLang]?.default?.content?.[chapterId]?.title
		return chapterTitle
	}

	getSubchapterTitle(chapterId, subchapterId) {
		const subchapterTitle =
			this?.original?.content?.[chapterId]?.content?.[subchapterId]?.title
		return subchapterTitle
	}

	getSubchapterTitleTr(chapterId, subchapterId) {
		const { trLang } = store.getState().translation
		const chapterTitle =
			this?.translations?.[trLang]?.default?.content?.[chapterId]?.content?.[
				subchapterId
			]?.title
		return chapterTitle
	}

	getChapterSubchapterTitlesWithTr(chapterId, subchapterId) {
		const chapterTitle = this.getChapterTitle(chapterId)
		const chapterTitleTr = this.getChapterTitleTr(chapterId)
		const subchapterTitle = this.getSubchapterTitle(chapterId, subchapterId)
		const subchapterTitleTr = this.getSubchapterTitleTr(chapterId, subchapterId)
		return { chapterTitle, chapterTitleTr, subchapterTitle, subchapterTitleTr }
	}

	// [{ id, title, type, content: [{ id, title, type }] }]
	getTableOfContent() {
		return this.original.content.map((chapter, index) => {
			const id = `${index}`
			const chapterParams = { ...chapter }
			const { content: chapterContent } = chapterParams
			if (!Array.isArray(chapterContent)) {
				return { id, ...chapterParams, subchapters: [] }
			} //don't show 'phrases' from media, when chapter is without subchapters}
			const subchapters = chapterContent.map((subchapter, index) => {
				const id = `${index}`
				const { title, type } = subchapter
				return { id, title, type }
			})
			return { id, ...chapterParams, subchapters }
		})
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
		const subchapterDoc =
			this?.original?.content?.[chapterId]?.content[subchapterId]
		return subchapterDoc
	}

	getSubchapterTr(chapterId, subchapterId) {
		const { trLang } = store.getState().translation
		if (!(trLang && chapterId && subchapterId && this.translations)) return {}
		const subchapterDoc =
			this?.translations?.[trLang]?.default?.content?.[chapterId]?.content?.[
				subchapterId
			] || {}
		return subchapterDoc
	}

	getContentTypeDocsPair(chapterId, subchapterId = '') {
		let contentTypeDoc, contentTypeTrDoc
		if (subchapterId + '') {
			contentTypeDoc = this.getSubchapter(chapterId, subchapterId)
			contentTypeTrDoc = this.getSubchapterTr(chapterId, subchapterId)
		} else {
			contentTypeDoc = this.getChapter(chapterId)
			contentTypeTrDoc = this.getChapterTr(chapterId)
		}
		return { contentTypeDoc, contentTypeTrDoc }
	}

	/**
	 *
	 * @param {string} chapterId
	 * @param {string} subchapterId
	 * @param {number[]} arrayOfIndexes
	 * @returns array of phrases by indexes or all (if indexes are undefined)
	 */
	getPhrases(chapterId, subchapterId, arrayOfIndexes) {
		if (!this.original) return []
		const {
			content: { phrases }
		} = this.getItem(chapterId, subchapterId)

		const phrasesWithId = phrases.map((elem, id) => ({
			...elem,
			id
		}))

		if (!arrayOfIndexes) return phrasesWithId

		const result = phrasesWithId.filter((elem, index) =>
			arrayOfIndexes.includes(index)
		)

		return result
	}

	getPhrasesCount(chapterId, subchapterId) {
		const contentItem = this.getItem(chapterId, subchapterId)

		if (!this.original) return []
		const {
			content: { phrases }
		} = contentItem

		const phrasesCount = phrases.length - 1 // because first phrase is fake

		return phrasesCount
	}

	getPhrasesTr(chapterId, subchapterId, arrayOfIndexes) {
		const { trLang } = store.getState().translation
		if (!(this.translations && trLang)) return []
		const {
			content: { phrases }
		} = this.getItemTr(chapterId, subchapterId, trLang)

		const phrasesWithId = phrases.map((elem, id) => ({
			...elem,
			id
		}))

		if (!arrayOfIndexes) return phrasesWithId

		const result = phrasesWithId.filter((elem, index) =>
			arrayOfIndexes.includes(index)
		)

		return result
	}

	getPhrasesTrCount(chapterId, subchapterId) {
		const { trLang } = store.getState().translation
		if (!(this.translations && trLang)) return []
		const {
			content: { phrases }
		} = this.getItemTr(chapterId, subchapterId, trLang)

		const phrasesCount = phrases.length - 1 // because first phrase is fake
		return phrasesCount
	}

	getInteractivity(chapterId, subchapterId = '') {
		const doc = this.getItem(chapterId, subchapterId)
		const { title, type } = doc
		const contentType = type ? type : title
		const interactivity = getInteractivityFromStyles(contentType)
		return interactivity
	}

	getItem(chapterId, subchapterId = '') {
		return subchapterId + ''
			? this.original?.content?.[chapterId + '']?.content?.[subchapterId + '']
			: this.original?.content?.[chapterId + '']
	}

	getItemTr(chapterId, subchapterId = '', trLang = '') {
		const result =
			subchapterId + ''
				? this.translations?.[trLang]?.default?.content?.[chapterId]?.content?.[
						subchapterId
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  ]
				: this.translations?.[trLang]?.default?.content?.[chapterId]
		return result
	}

	isItemExists(chapterId, subchapterId = '') {
		const item = this.getItem(chapterId, subchapterId)
		return Boolean(item)
	}

	/**
	 *
	 * @param {string} chapterId
	 * @param {string} subchapterId
	 * @param {object} navigation - prop from react-navigation context
	 * @returns
	 */
	navigateToNextItem(chapterId, subchapterId, navigation) {
		const nextSubchapterId = +subchapterId + 1 || 0
		const nextChapterId = +chapterId + 1
		if (this.isItemExists(chapterId, nextSubchapterId)) {
			navigation.navigate(`subchapter-${nextSubchapterId}`)
		} else if (this.isItemExists(nextChapterId)) {
			navigation.navigate(`chapter-${nextChapterId}`)
		} else if (!this.isItemExists(nextChapterId)) {
			console.log('we have riched end of the app')
		}
	}

	// prev = previous
	getPrevContentItem(chapterId = '', subchapterId = '') {
		const prevSubchapterId = +subchapterId - 1
		const prevChapterId = +chapterId - 1
		if (this.isItemExists(chapterId, prevSubchapterId)) {
			return { chapterId, subchapterId: prevSubchapterId }
		} else if (this.isItemExists(prevChapterId)) {
			const result = { chapterId: prevChapterId }
			const subchapterCount = this.getItem(prevChapterId)?.content?.length
			if (subchapterCount > 0) {
				result.subchapterId = subchapterCount - 1
			}
			return result
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
