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
		const { info } = this.text?.[lang] || {}
		return info
	}

	getChapterSubchapterTitlesWithTr(trLang, chapterId, subchapterId) {
		// prettier-ignore
		const {title: chapterTitle} = this.getItemByPath(`oo/content/${chapterId}`) || {}
		// prettier-ignore
		const {title: chapterTitleTr} = this.getItemByPath(`${trLang}/content/${chapterId}`)|| {}
		// prettier-ignore
		const {title: subchapterTitle} = this.getItemByPath(`oo/content/${chapterId}/${subchapterId}`)|| {}
		// prettier-ignore
		const {title: subchapterTitleTr} = this.getItemByPath(`${trLang}/content/${chapterId}/${subchapterId}`)|| {}

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
		} = this.getItem({ chapterId, subchapterId })

		const result = phrases.filter((elem, index) =>
			arrayOfIndexes.includes(index)
		)

		return result
	}

	getPhrasesCount(chapterId, subchapterId) {
		const contentItem = this.getItem({ chapterId, subchapterId })

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
		} = this.getItem({ chapterId, subchapterId, lang: trLang })

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
		} = this.getItem({ chapterId, subchapterId, lang: trLang })

		const phrasesCount = phrases.length - 1 // because first phrase is fake
		return phrasesCount
	}

	getInteractivity(chapterId, subchapterId = '') {
		const doc = this.getItem({ chapterId, subchapterId })
		const { title, type } = doc
		const contentType = type ? type : title
		const interactivity = getInteractivityFromStyles(contentType)
		return interactivity
	}

	getItem(params) {
		const {
			chapterId,
			subchapterId = '',
			lang = 'oo',
			source = 'content'
		} = params
		const pathEnd = subchapterId
			? `${chapterId}/${subchapterId}`
			: `${chapterId}`
		return this.getItemByPath(`${lang}/${source}/${pathEnd}`)
	}

	/**
	 *
	 * @param {string} path - // ru/content/chapterId/subchapterId
	 * @returns object with chapter or subchapter doc
	 */
	getItemByPath(path) {
		const pathArray = path.split('/') // [lang, source, chapterId, subchapterId]

		const [lang, source, chapterId, subchapterId] = pathArray

		if (!lang) return {}

		const item = subchapterId
			? this.text?.[lang]?.[source]?.[chapterId - 1]?.content?.[
					subchapterId - 1
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  ]
			: this.text?.[lang]?.[source]?.[chapterId - 1]

		return item
	}

	isItemExists(chapterId, subchapterId = '') {
		const item = this.getItem({ chapterId, subchapterId })
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
			const result = { chapterId, subchapterId: prevSubchapterId }

			return result
		} else if (this.isItemExists(prevChapterId)) {
			const result = { chapterId: prevChapterId }
			const subchapterCount = this.getItem({ chapterId: prevChapterId })
				?.content?.length
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
