const getTask1 = (givenType, givenLang = '') => {
	const mapOfTaskTexts = {
		'audio-original': 'Listen to the audio',
		'text-original': 'Read the original text',
		'text-translation': 'Read the translation text'
	}
	const task = `${givenType}-${givenLang}`
	return mapOfTaskTexts?.[task]
}

const getTask2 = (
	givenType,
	givenLang,
	requiredType,
	requiredLang,
	activityType
) => {
	const activity = activityType === 'write' ? 'write' : 'choose'
	const mapOfTaskTexts = {
		'audio-original --> text-original write': 'write what you have heard',
		'audio-original --> text-translation write': 'write translation',
		'audio-original --> text-original choose': 'choose the right variant',
		'audio-original --> text-translation choose':
			'choose the right translation',
		'text-original --> text-translation write': 'write translation',
		'text-translation --> text-original write': 'write original text'
	}
	const task = `${givenType}-${givenLang} --> ${requiredType}-${requiredLang} ${activity}`
	return mapOfTaskTexts?.[task]
}

export const getPlaceholderText = requiredLang => {
	const mapOfTexts = {
		original: 'original text',
		translation: 'translation text'
	}
	return mapOfTexts?.[requiredLang]
}

export const getTaskText = (
	givenType,
	givenLang,
	requiredType,
	requiredLang,
	activityType
) => {
	const task1 = getTask1(givenType, givenLang)
	const task2 = getTask2(
		givenType,
		givenLang,
		requiredType,
		requiredLang,
		activityType
	)
	return `${task1}, and ${task2}`
}
