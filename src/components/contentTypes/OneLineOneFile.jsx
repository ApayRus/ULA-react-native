import React from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import { Audio } from 'expo-av'
import { objectToArray } from '../../utils/utils'
import audios from '../../../assets/audios'
import images from '../../../assets/images'

function OneLineOneFile(props) {
	const {
		subchapter,
		subchapterTr,
		globalStyles,
		chapterId,
		showTranslation
	} = props

	const { title, content, type, style: contentTypeStyle } = subchapter
	const contentLines = objectToArray(content)
	const contentTypeAudios = audios[type] || {}
	const contentTypeImages = images[type] || {}

	console.log('subchapterTr', subchapterTr)

	// console.log('audios', type, audios[type])
	// console.log('images', type, images[type])

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
					const trText = subchapterTr
						? subchapterTr?.content[elem.id]?.text
						: ''
					return (
						<TouchableOpacity
							onPress={handlePlay(contentLineId)}
							key={`${type}-${contentLineId}`}
							style={[
								{
									flex: 1,
									alignItems: 'inherit'
								},
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
							<View style={{ flex: 1, alignItems: 'inherit' }}>
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
