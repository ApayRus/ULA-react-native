import React from 'react'
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'

function SubchapterBlock(props) {
	const { globalStyles, chapterId, showTranslation } = props

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
			const sourceType = source == wordAudios ? 'word' : 'phrase'
			Alert.alert(
				`Audio for ${sourceType} ${id} doesn't exist`,
				`Please, contact the admin`
			)
		}
	}

	return (
		<View style={{ padding: 5 }}>
			<Text h2 h2Style={globalStyles.subchapter}>
				Words
			</Text>
			{words.map(elem => {
				const wordId = chapterId + '-' + elem.id
				const image = wordImages[wordId]
				const trText = trWords ? trWords[elem.id]?.text : ''
				return (
					<TouchableOpacity
						onPress={() => playAudio(wordId, wordAudios)}
						key={`word-${elem.id}`}
						style={{
							display: 'flex',
							alignItems: 'center',
							marginBottom: 20
						}}
					>
						{image && (
							<Image
								source={image}
								style={{ width: 100, height: 100, resizeMode: 'contain' }}
							/>
						)}
						<View
							style={{
								flexDirection: 'column',
								flexWrap: 'wrap',
								alignItems: 'center'
							}}
						>
							<Text style={[globalStyles.body1]}>{elem.text}</Text>

							<Text
								style={[
									globalStyles.translation,
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
	)
}

export default SubchapterBlock
