// text of book and its translations

import textContentModules from '../../assets/textContentMap'
import files from '../../assets/contentFilesMap'
import store from '../store/rootReducer'
import { getInteractivity as getInteractivityFromStyles } from '../styles/contentType'
import { prefixedIndex } from './utils'

export class Content {
	constructor(textContentModules, files) {
		this.text = Object.keys(textContentModules).reduce((prev, langCode) => {
			return { ...prev, [langCode]: textContentModules[langCode].default }
		}, {})
		this.files = files
	}

	// main content

	getTranslationLangs() {
		return Object.keys(textContentModules).filter(elem => elem !== 'oo')
	}

	getInfo(lang = 'oo') {
		const { info } = this.text[lang]
		return info
	}

	/**
	 * @returns ['ru', 'en', 'es']
	 */

	getChapterTitle(chapterId) {
		const chapterTitle = this.text['oo'].content?.[chapterId - 1]?.title
		return chapterTitle
	}
	getChapterTitleTr(chapterId) {
		const { trLang } = store.getState().translation
		const chapterTitle = this.text?.[trLang]?.content?.[chapterId - 1]?.title
		return chapterTitle
	}

	getSubchapterTitle(chapterId, subchapterId) {
		const subchapterTitle =
			this.text['oo'].content?.[chapterId - 1]?.content?.[subchapterId - 1]
				?.title
		return subchapterTitle
	}

	getSubchapterTitleTr(chapterId, subchapterId) {
		const { trLang } = store.getState().translation
		const chapterTitle =
			this.text?.[trLang]?.content?.[chapterId - 1]?.content?.[subchapterId - 1]
				?.title
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
	getTOC(source) {
		return source?.map(chapter => {
			const { content: chapterContent, id, type = '', title } = chapter
			if (!Array.isArray(chapterContent)) {
				return { id, type, title, subchapters: [] }
			} //don't show 'phrases' from media, when chapter is without subchapters}
			const subchapters = chapterContent.map(subchapter => {
				const { id, title, type } = subchapter
				return { id, title, type }
			})
			return { id, type, title, subchapters }
		})
	}

	getTableOfContent() {
		return this.getTOC(this.text['oo'].content)
	}

	getTableOfContentTr() {
		const { trLang } = store.getState().translation
		return this.getTOC(this.text?.[trLang]?.content)
	}

	/**
	 *
	 * @param {string} chapterId
	 * @param {string} subchapterId
	 * @param {number[]} arrayOfIndexes
	 * @returns array of phrases by indexes or all (if indexes are undefined)
	 */
	getPhrases(chapterId, subchapterId, arrayOfIndexes) {
		if (!this.text['oo']) return []
		if (!arrayOfIndexes) return phrases
		const {
			content: { phrases }
		} = this.getItem(chapterId, subchapterId)

		const result = phrases.filter((elem, index) =>
			arrayOfIndexes.includes(index)
		)

		return result
	}

	getPhrasesCount(chapterId, subchapterId) {
		const contentItem = this.getItem(chapterId, subchapterId)

		if (!this.text['oo']) return []
		const {
			content: { phrases }
		} = contentItem

		const phrasesCount = phrases.length - 1 // because first phrase is fake

		return phrasesCount
	}

	getPhrasesTr(chapterId, subchapterId, arrayOfIndexes) {
		const { trLang } = store.getState().translation
		if (!arrayOfIndexes) return phrases

		if (!(this.text && trLang)) return []
		const {
			content: { phrases }
		} = this.getItemTr(chapterId, subchapterId, trLang)

		const result = phrases.filter((elem, index) =>
			arrayOfIndexes.includes(index)
		)

		return result
	}

	getPhrasesTrCount(chapterId, subchapterId) {
		const { trLang } = store.getState().translation
		if (!(this.text && trLang)) return []
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
		const chapterIndex = chapterId - 1
		const subchapterIndex = subchapterId - 1
		return subchapterIndex >= 0
			? this.text['oo'].content?.[chapterIndex]?.content?.[
					subchapterIndex
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  ]
			: this.text['oo'].content?.[chapterIndex]
	}

	getItemTr(chapterId, subchapterId = '') {
		const chapterIndex = chapterId - 1
		const subchapterIndex = subchapterId - 1
		const { trLang } = store.getState().translation
		const result =
			subchapterId >= 0
				? this.text?.[trLang]?.content?.[chapterIndex]?.content?.[
						subchapterIndex
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  ]
				: this.text?.[trLang]?.content?.[chapterIndex]
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
	navigateToNextItem(chapterId, subchapterId = '', navigation) {
		const nextSubchapterId = prefixedIndex(+subchapterId + 1)
		const nextChapterId = prefixedIndex(+chapterId + 1)
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
		const prevSubchapterId = prefixedIndex(+subchapterId - 1)
		const prevChapterId = prefixedIndex(+chapterId - 1)
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

const content = new Content(textContentModules, files)

export default content
