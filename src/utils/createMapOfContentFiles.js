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
	const { children = [], name } = dirTree || {}
	const noMoreChildren = !children.length

	obj[name] = noMoreChildren ? collapseItem(dirTree, prefix) : {}

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
