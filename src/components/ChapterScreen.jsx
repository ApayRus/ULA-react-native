import React, { useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, View, TouchableOpacity, Alert, Switch } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import { objectToArray } from '../utils/utils'
import wordImages from '../../assets/images/words'
import wordAudios from '../../assets/audios/words'
import phraseAudios from '../../assets/audios/phrases'
import { Audio } from 'expo-av'
import translations from '../../assets/translations'
import { useSelector } from 'react-redux'
// import globalStyles from '../config/globalStyles'

export default function LessonScreen({ navigation, route }) {
	const {
		// name: lessonTitle,
		params: { chapterId, chapterDoc, globalStyles }
	} = route

	const { trLang } = useSelector(state => state.translation)

	const [trTitle, setTrTitle] = useState('')
	const [trWords, setTrWords] = useState({})
	const [trPhrases, setTrPhrases] = useState({})

	useEffect(() => {
		const getTranslationAsync = async () => {
			// const trLang = await AsyncStorage('trLang')
			// const trFilePath = `../../assets/content.ru.js`
			const trDoc = translations[trLang]['default']['chapters'][chapterId] || {}
			const { words, phrases, title = '' } = trDoc
			setTrTitle(title)
			setTrWords(words)
			setTrPhrases(phrases)
		}
		getTranslationAsync()
		return () => {
			setTrWords({})
			setTrPhrases({})
		}
	}, [trLang])

	const [switchValue, toggleSwitch] = useState(false)

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
		<View style={{ flex: 1 }}>
			<ScrollView>
				<StatusBar style='auto' />
				<Header
					rightComponent={{
						icon: 'menu',
						color: '#fff',
						onPress: () => navigation.toggleDrawer()
					}}
					leftComponent={{
						icon: 'home',
						color: '#fff',
						onPress: () => navigation.navigate('Home')
					}}
				/>
				<View style={globalStyles.chapterHeader}>
					<Text h1 h1Style={[globalStyles.body1, { color: colors.primary }]}>
						{title}
					</Text>
					<Text h1 h1Style={[globalStyles.translation]}>
						{trTitle}
					</Text>
				</View>
				<View style={{ padding: 5 }}>
					<Text h2 h2Style={globalStyles.subchapter}>
						Words
					</Text>

					{words.map(elem => {
						const wordId = chapterId + '_' + elem.id
						const image = wordImages[wordId]
						const trText = trWords[elem.id]?.text
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
									{/* <Text style={{ width: '100%', height: 0 }}></Text> */}
									<Text style={[globalStyles.translation]}>{trText}</Text>
								</View>
							</TouchableOpacity>
						)
					})}
				</View>
				<View style={{ marginBottom: 20, padding: 5 }}>
					<Text h2 h2Style={globalStyles.subchapter}>
						Phrases
					</Text>
					{phrases.map(elem => {
						const phraseId = chapterId + '_' + elem.id
						const trText = trPhrases[elem.id]?.text
						return (
							<TouchableOpacity
								onPress={() => playAudio(phraseId, phraseAudios)}
								key={`phrase-${elem.id}`}
								style={globalStyles.align}
							>
								<Text style={globalStyles.body1}>{elem.text}</Text>
								{/* <Text style={{ flexBasis: '100%', height: 0 }}></Text> */}
								<Text style={[globalStyles.translation]}>{trText}</Text>
							</TouchableOpacity>
						)
					})}
				</View>
			</ScrollView>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'flex-end',
					alignItems: 'flex-end',
					alignContent: 'flex-end'
				}}
			>
				<Text>translation ({trLang}): </Text>
				<Switch
					style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
					onValueChange={() => {
						toggleSwitch(!switchValue)
					}}
					value={switchValue}
				/>
			</View>
		</View>
	)
}
