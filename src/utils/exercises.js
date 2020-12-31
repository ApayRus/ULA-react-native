// auto excercise is related to lesson (subchapter)
// with type "oneLineOneFile" or "timing"
// excercise = { source: lesson, type, count }
// source: lesson, subchapter
// type: textToText || soundToText
// count: from 1 to total words/phrases count in source (lesson)

class Exercise {
	constructor(source, type, count) {}

	init(source, type, count) {
		this.source = source
		this.type = type
		this.count = count
	}
}

const example2 = {
	phraseId: '002',
	type: 'listenAndChooseFromVariants',
	originalVariants: ['kitab', 'daftar', 'mihfaza'], //1 is right
	correctOriginalVariant: 'kitab',
	translationVariants: ['a notebook', 'a bag', 'a book'], // 1 is right
	correctTranslationVariant: 'a book'
}
