import React from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image } from 'react-native-elements'
import { Audio } from 'expo-av'
import { objectToArray, prefixedIndex } from '../../utils/utils'
import audios from '../../../assets/audios'
import images from '../../../assets/images'

function OneLineOneFile(props) {
	const {
		subchapterDoc,
		subchapterTrDoc = {},
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const parseContent = pText => {
		if (!pText) return {}
		const rowsArray = pText.split('\n')
		const info = rowsArray.reduce((prev, item, index) => {
			const rowIndex = prefixedIndex(index + 1)
			return { ...prev, [rowIndex]: { text: item.trim() } }
		}, {})
		return info
	}

	const {
		title,
		content: rawContent,
		type,
		style: contentTypeStyle
	} = subchapterDoc
	const { content: rawContentTr } = subchapterTrDoc
	const content = parseContent(rawContent)
	const contentTr = parseContent(rawContentTr)

	const contentLines = objectToArray(content)
	const contentTypeAudios = audios[type] || {}
	const contentTypeImages = images[type] || {}

	const onUpdate = soundObject => playbackStatus => {
		if (!playbackStatus.isPlaying && playbackStatus.positionMillis > 0)
			soundObject.unloadAsync()
	}

	const playAudio = async (id, source) => {
		if (source[id]) {
			const soundObject = new Audio.Sound()
			await soundObject.loadAsync(source[id])
			soundObject.setOnPlaybackStatusUpdate(onUpdate(soundObject))
			await soundObject.playAsync()
		} else {
			Alert.alert(
				`Audio for ${type} ${id} doesn't exist`,
				`Please, contact the admin`
			)
		}
	}

	const handlePlay = contentLineId => e =>
		playAudio(contentLineId, contentTypeAudios)

	return (
		<View style={{ paddingLeft: 5, paddingRight: 5 }}>
			<Text h2 h2Style={globalStyles.subchapter}>
				{title}
			</Text>
			<View
				style={[
					{
						flex: 1,
						flexDirection: 'column',
						padding: 10
					},
					globalStyles.align,
					contentTypeStyle.container
				]}
			>
				{contentLines.map(elem => {
					const contentLineId = chapterId + '-' + elem.id
					const image = contentTypeImages[contentLineId]
					const trText = subchapterTrDoc ? contentTr[elem.id]?.text : ''
					return (
						<TouchableOpacity
							onPress={handlePlay(contentLineId)}
							key={`${type}-${contentLineId}`}
							style={[
								{
									flex: 1
								},
								globalStyles.align,
								contentTypeStyle.item
							]}
						>
							{image && (
								<Image
									source={image}
									style={[
										{ width: 100, height: 100, resizeMode: 'contain' },
										contentTypeStyle.image
									]}
								/>
							)}
							<View style={[{ flex: 1 }]}>
								<Text
									style={[
										{ flex: 1 },
										globalStyles.body1,
										contentTypeStyle.text
									]}
								>
									{elem.text}
								</Text>
								<Text
									style={[
										{ flex: 1 },
										globalStyles.translation,
										contentTypeStyle.translation,
										{ opacity: showTranslation ? 1 : 0 }
									]}
								>
									{trText}
								</Text>
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
		</View>
	)
}

export default OneLineOneFile
