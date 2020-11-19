/**
	react-native can't import files dynamically through generated names 
	than it needs a map of all files in format { '001-003': require('files/001-003.mp3') }
	this node module reads files in /content and writes map of them to /src/assets
 */

const path = require('path')
const { writeFileSyncRecursive } = require('./fsUtils')

const baseDir = './content'

const { getSubDirsOfDir, getFileMapOfDir } = require('./fsUtils')
    // types of files, like: /audio, /images, etc.
const mediaTypes = getSubDirsOfDir(baseDir)

//each mediaType has separate file
mediaTypes.forEach(mediaType => {
    // contentType (semantic types of files, like: /words, /phrases, etc. )
    let fileContent = ''
    const contentTypes = getSubDirsOfDir(path.join(baseDir, mediaType))
    contentTypes.forEach(contentType => {
        const mapFiles = getFileMapOfDir(
            path.join(path.join(baseDir, mediaType, contentType))
        )
        fileContent += `"${contentType}": {${mapFiles}},`
    })
    fileContent = `export default { ${fileContent}}`
    const filePath = path.join('./assets', mediaType, 'index.js')

    writeFileSyncRecursive(filePath, fileContent, 'utf-8')
})