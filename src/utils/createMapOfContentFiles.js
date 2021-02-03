import makeDirTree from 'directory-tree'
import path from 'path'
import { writeFileSyncRecursive } from './fsUtils.js'

const collapseItem = (item, prefix) => {
	const { name, type, path } = item
	if (type === 'directory') {
		return { [name]: {} }
	} else if (type === 'file') {
		return `require('${prefix + path}')`
	}
}

const collapseDirTreeToObject = (dirTree, obj, prefix = '') => {
	const { children = [], name } = dirTree || {}
	const noMoreChildren = !children.length

	if (noMoreChildren) {
		{
			obj[name] = collapseItem(dirTree, prefix)
		}
	} else {
		obj[name] = {}
	}
	children.forEach(elem => {
		collapseDirTreeToObject(elem, obj[name], prefix)
	})
}

const obj = {}

collapseDirTreeToObject(makeDirTree('content'), obj, '../')

const fileContent =
	'export default ' + JSON.stringify(obj).replace(/"(require\(.+?\))"/g, '$1')

writeFileSyncRecursive('./assets/contentFilesMap.js', fileContent, 'utf-8')
