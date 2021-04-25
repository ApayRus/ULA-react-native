import { Image, Platform } from 'react-native'
import content from '../../utils/content'

export const getImageSize = async path => {
	if (!path) return { width: 0, height: 0 }

	const result = new Promise((resolve, reject) => {
		const isFileLocal = Boolean(!path.match(/^http/i))

		if (isFileLocal) {
			const source = content.getFilesByPathString(path)?.file

			if (Platform.OS == 'web') {
				Image.getSize(
					source,
					(width, height) => resolve({ width, height }),
					err => reject(err)
				)
			} else {
				const { width, height } = Image.resolveAssetSource(source)
				resolve({ width, height })
			}
		} else {
			Image.getSize(
				path,
				(width, height) => resolve({ width, height }),
				err => reject(err)
			)
		}
	})

	return result
}
