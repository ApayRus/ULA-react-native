import React, { useEffect } from 'react'
import HomeScreen from '../components/screens/HomeScreen'
import AboutScreen from '../components/screens/AboutScreen'
import TypographyScreen from '../components/screens/TypographyScreen'
import ChapterScreen from '../components/screens/ChapterScreen'
import SubChapterScreen from '../components/screens/SubChapterScreen'
import DrawerContent from '../components/Drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import content from '../utils/content'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { setTranslation } from '../store/translationActions'
import Exercise from '../components/contentTypes/Exercise'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

const info = content.getInfo()
const translations = content.getTranslations() // list of available langs

export default function RootNavigation() {
	const dispatch = useDispatch()

	const chapters = content.getTableOfContent()

	useEffect(() => {
		const getTranslationAsync = async () => {
			const trLang = await AsyncStorage.getItem('trLang')
			let showTranslation = await AsyncStorage.getItem('showTranslation')
			showTranslation =
				showTranslation === 'true' || showTranslation === null ? true : false
			dispatch(setTranslation({ trLang, showTranslation }))
		}
		getTranslationAsync()
		return () => {}
	}, [])

	return (
		<NavigationContainer>
			<Drawer.Navigator
				initialRouteName='Home'
				drawerContent={props => (
					<DrawerContent {...props} chapters={chapters} info={info} />
				)}
			>
				<Drawer.Screen
					name='Home'
					component={HomeScreen}
					initialParams={{
						info: info,
						translations: translations
					}}
				/>
				<Drawer.Screen
					name='About'
					component={AboutScreen}
					initialParams={{}}
				/>
				<Drawer.Screen
					name='Exercise'
					component={Exercise}
					initialParams={{}}
				/>
				<Drawer.Screen name='Typography' component={TypographyScreen} />

				{/* CHAPTERS */}

				{chapters.map(chapter => {
					const { id: chapterId, subchapters, title, type } = chapter
					const name = `chapter-${chapterId}` // chapter-001

					const subchaptersStackNavigator = () => (
						<Stack.Navigator
							key={name}
							initialRouteName='Heading'
							screenOptions={{
								headerShown: false
							}}
						>
							<Stack.Screen
								key={name}
								name='Heading'
								component={ChapterScreen}
								initialParams={{ chapterId, title, subchapters }}
							/>
							{subchapters.map(subchapter => {
								const { id: subchapterId } = subchapter
								const name = `subchapter-${subchapterId}` // subchapter-002
								return (
									<Stack.Screen
										key={name}
										{...{ name }}
										component={SubChapterScreen}
										initialParams={{
											chapterId,
											subchapterId
										}}
									/>
								)
							})}
						</Stack.Navigator>
					)

					return (
						<Drawer.Screen
							key={name}
							name={name}
							component={subchaptersStackNavigator}
							initialParams={{
								chapterId,
								title,
								type
							}}
						/>
					)
				})}
			</Drawer.Navigator>
		</NavigationContainer>
	)
}
