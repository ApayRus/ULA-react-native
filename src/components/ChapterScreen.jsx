import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, View, TouchableOpacity, Alert, Switch } from 'react-native'
import { Text, Image, Header, colors } from 'react-native-elements'
import { objectToArray } from '../utils/utils'
import wordImages from '../../assets/images/words'
import wordAudios from '../../assets/audios/words'
import phraseAudios from '../../assets/audios/phrases'
import { Audio } from 'expo-av'
import { getTrChapter } from '../utils/manageTextContent'
import { useSelector } from 'react-redux'
import TranslationOnOffSwitcher from './TranslationShowSwitcher'

export default function LessonScreen({ navigation, route }) {
	const {
		params: { chapterId, chapterDoc, globalStyles }
	} = route

	const { trLang } = useSelector(state => state.translation)

	const [trTitle, setTrTitle] = useState('')
	const [trWords, setTrWords] = useState({})
	const [trPhrases, setTrPhrases] = useState({})

	useEffect(() => {
		const getTranslationAsync = async () => {
			const trDoc = getTrChapter(trLang, chapterId)
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

	const { title = '', words: wordsObject = '', phrases: phrasesObject = '' } =
		chapterDoc || {}
	const words = objectToArray(wordsObject)
	const phrases = objectToArray(phrasesObject)

	const playAudio = async (id, source) => {
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
					<Text style={[globalStyles.body1, { color: colors.primary }]}>
						{title}
					</Text>
					<Text style={[globalStyles.translation]}>{trTitle}</Text>
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
								<Text style={[globalStyles.translation]}>{trText}</Text>
							</TouchableOpacity>
						)
					})}
				</View>
			</ScrollView>
			<TranslationOnOffSwitcher />
		</View>
	)
}
