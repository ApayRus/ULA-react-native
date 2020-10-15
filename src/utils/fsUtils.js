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

module.exports = {
    getSubDirsOfDir,
    getFileMapOfDir
}