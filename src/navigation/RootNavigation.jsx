import React, { useEffect } from 'react'
import HomeScreen from '../components/screens/HomeScreen'
import AboutScreen from '../components/screens/AboutScreen'
import ChapterScreen from '../components/screens/ChapterScreen'
import DrawerContent from '../components/Drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import {
	getInfo,
	getTranslations,
	getChapters,
	getTrChapters
} from '../utils/manageTextContent'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { setTranslation } from '../store/translationActions'
import globalStyles from '../config/globalStyles'

const Drawer = createDrawerNavigator()

const info = getInfo()
const translations = getTranslations() // list of available langs
const chapters = getChapters()

const { language = '' } = info
const gStyles = globalStyles(language.toLocaleLowerCase())

export default function RootNavigation() {
	const dispatch = useDispatch()
	const { trLang } = useSelector(state => state.translation)

	const trChapters = getTrChapters(trLang)

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
					<DrawerContent
						{...props}
						chapters={chapters}
						trChapters={trChapters}
						info={info}
						globalStyles={gStyles}
					/>
				)}
			>
				<Drawer.Screen
					name='Home'
					component={HomeScreen}
					initialParams={{
						info: info,
						translations: translations,
						globalStyles: gStyles
					}}
				/>
				<Drawer.Screen
					name='About'
					component={AboutScreen}
					initialParams={{
						globalStyles: gStyles
					}}
				/>
				{chapters.map(elem => (
					<Drawer.Screen
						key={`lesson-${elem.id}`}
						name={elem.title}
						component={ChapterScreen}
						initialParams={{
							chapterId: elem.id,
							globalStyles: gStyles
						}}
					/>
				))}
			</Drawer.Navigator>
		</NavigationContainer>
	)
}
