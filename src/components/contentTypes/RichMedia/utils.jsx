// 's34.5-67.89' => [34.5, 67.89]
export const parseSecondsInterval = text => {
	const intervalPattern = /s\s*(.+?)\s*-\s*(.+?)\s*$/
	const match = text.match(intervalPattern)
	const [, start, end] = match
	return { start: +start, end: +end }
}
