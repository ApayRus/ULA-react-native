import fs from 'fs'
import path from 'path'

const isFile = path => fs.statSync(path).isFile()

export const getFilesOfDir = dir =>
	fs.readdirSync(dir).filter(elem => isFile(path.join(dir, elem)))

export const writeFileSyncRecursive = (filename, content, charset) => {
	const folders = filename.split(path.sep).slice(0, -1)
	folders.forEach((elem, index, array) => {
		const folderPath = path.join(...array.slice(0, index + 1))
		fs.mkdirSync(folderPath, { recursive: true })
	})
	fs.writeFileSync(filename, content, charset)
}
