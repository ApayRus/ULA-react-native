import makeDirTree from 'directory-tree'
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
	const { children = [], name: nameWithExtension } = dirTree || {}
	const noMoreChildren = !children.length
	const name = nameWithExtension.replace(/\..+?$/, '')
	if (noMoreChildren) {
		obj[name] = collapseItem(dirTree, prefix)
	} else {
		obj[name] = {}
	}

	children.forEach(elem => {
		collapseDirTreeToObject(elem, obj[name], prefix)
	})

	return obj
}

const treeObject = collapseDirTreeToObject(makeDirTree('content'), {}, '../')

const fileContent =
	'export default ' +
	JSON.stringify(treeObject).replace(/"(require\(.+?\))"/g, '$1')

writeFileSyncRecursive('./assets/contentFilesMap.js', fileContent, 'utf-8')
