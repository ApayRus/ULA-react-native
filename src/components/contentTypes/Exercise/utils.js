export const getTaskText = (givenArray, requiredArray, activityType) => {
	const [activity] = activityType.split('-') // for extract 'choose' of: choose-from-4
	// from given type
	const task1map = {
		audio: 'listen to the audio',
		image: 'look at the image',
		'text-translation': 'read translation text',
		'text-original': 'read original text'
	}
	// from given activity
	const task2map = {
		choose: 'choose the right variant',
		write: 'write the right answer',
		order: 'put words in right order'
	}

	const task1 = givenArray.reduce((prev, elem) => {
		const task = task1map[elem]
		return `${prev}${task}, `
	}, '')

	const task2 = task2map[activity]

	return `${task1}\nand ${task2}`
}

export const getPlaceholderText = requiredLang => {
	const mapOfTexts = {
		original: 'original text',
		translation: 'translation text'
	}
	return mapOfTexts?.[requiredLang]
}

// TOLERANCE TO USER INPUT
export const normalizeTextBeforeOrdering = text =>
	text
		.trim()
		.replace(/\s+/g, ' ') // multiple spaces with one space for avoid empty puzzles
		.replace(/[.?!]+/g, '') //remove sentence-end punctuation (because it is clue -- end of sentence)
		.toLowerCase() // because Uppercase letter is a clue (beginning of sentence)
