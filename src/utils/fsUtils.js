const fs = require('fs')
const path = require('path')

const isFile = path => fs.statSync(path).isFile()
const isDirectory = path => fs.statSync(path).isDirectory()

const getSubDirsOfDir = (dir) => fs.readdirSync(dir).filter(elem => isDirectory(path.join(dir, elem)))

const getFileMapOfDir = (dir) => fs.readdirSync(dir)
    .filter(elem => isFile(path.join(dir, elem)))
    .reduce((prev, elem) => {
        const fileId = elem.replace(/\.[^.]+$/, '')
        const filePath = path.join('../../', dir, elem)
        return {...prev, [fileId]: `require("${filePath}")` }
    }, {})

const getFilesOfDir = (dir) => fs.readdirSync(dir)
    .filter(elem => isFile(path.join(dir, elem)))

const writeFileSyncRecursive = (filename, content, charset) => {
    const folders = filename.split(path.sep).slice(0, -1)
    folders.forEach((elem, index, array) => {
        const folderPath = path.join(...array.slice(0, index + 1))
        fs.mkdirSync(folderPath, { recursive: true })
    })
    fs.writeFileSync(filename, content, charset)
}

module.exports = {
    getSubDirsOfDir,
    getFileMapOfDir,
    getFilesOfDir,
    writeFileSyncRecursive
}