import React, { useContext } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
	StyleSheet,
	ScrollView,
	View,
	TouchableOpacity,
	Alert
} from 'react-native'
import { Text, Image, Header } from 'react-native-elements'
import { objectToArray } from '../utils'
import wordImages from '../assets/images/words'
import wordAudios from '../assets/audios/words'
import phraseAudios from '../assets/audios/phrases'
import { Audio } from 'expo-av'
// import globalStyles from '../config/globalStyles'

export default function LessonScreen({ navigation, route }) {
	const {
		// name: lessonTitle,
		params: { chapterId, chapterDoc, globalStyles }
	} = route

	console.log('globalStyles', globalStyles)

	const { title = '', words: wordsObject = '', phrases: phrasesObject = '' } =
		chapterDoc || {}
	const words = objectToArray(wordsObject)
	const phrases = objectToArray(phrasesObject)

	const playAudio = async (id, source) => {
		// console.log('playAudio', id, source)
		if (source[id]) {
			const soundObject = new Audio.Sound()
			await soundObject.loadAsync(source[id])
			soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(soundObject))
			await soundObject.playAsync()
		} else {
			const sourceType = source == wordAudios ? 'word' : 'phrase'
			Alert.alert(
				`Audio for ${sourceType} ${id} doesn't exist`,
				`Please, contact the admin`
			)
		}
	}

	const onPlaybackStatusUpdate = soundObject => playbackStatus => {
		if (!playbackStatus.isPlaying && playbackStatus.positionMillis > 0)
			soundObject.unloadAsync()
		// console.log('playbackStatus', playbackStatus)
	}

	return (
		<ScrollView>
			<StatusBar style='auto' />
			<Header
				rightComponent={{
					icon: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				centerComponent={{
					text: title,
					style: {
						color: '#fff',
						fontFamily: 'Scheherazade_400Regular',
						fontSize: 25
					}
				}}
			/>

			<View style={{ padding: 5 }}>
				<Text h2 h2Style={{ fontSize: 20 }}>
					Words
				</Text>
				{words.map(elem => {
					const wordId = chapterId + '_' + elem.id
					const image = wordImages[wordId]
					// console.log('image.getSize()', image.getSize())
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
									flexDirection: 'row',
									flexWrap: 'wrap',
									alignItems: 'baseline'
								}}
							>
								<Text style={[globalStyles.body1]}>{elem.text}</Text>
								{/* <Icon
								type='material'
								name='play-arrow'
								style={{ marginLeft: 20 }}
								onPress={() => console.log('play!!!')}
							/> */}
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
			<View style={{ marginBottom: 20, padding: 5 }}>
				<Text h2 h2Style={{ fontSize: 20 }}>
					Phrases
				</Text>
				{phrases.map(elem => {
					const phraseId = chapterId + '_' + elem.id
					return (
						<TouchableOpacity
							onPress={() => playAudio(phraseId, phraseAudios)}
							key={`phrase-${elem.id}`}
							// style={{ display: 'flex', alignItems: 'center' }}
						>
							<Text
								style={[{ marginTop: 10, marginRight: 20 }, globalStyles.body1]}
							>
								{elem.text}
							</Text>
						</TouchableOpacity>
					)
				})}
			</View>
		</ScrollView>
	)
}
