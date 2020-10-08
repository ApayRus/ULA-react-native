import React, { useEffect } from 'react'
import HomeScreen from './src/components/HomePage'
import ContactsScreen from './src/components/ContactsPage'
import ChapterScreen from './src/components/ChapterScreen'
import DrawerContent from './src/components/Drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/Ionicons'
import { ThemeProvider, colors } from 'react-native-elements'
import { map } from 'lodash'
import textContent from './src/assets/lessons/lessonsContent'
import { AppLoading } from 'expo'
import {
	useFonts,
	Scheherazade_400Regular,
	Scheherazade_700Bold
} from '@expo-google-fonts/scheherazade'

// package bug fix
if (colors.platform.web == null) {
	// @ts-ignore The typings are also missing "web"
	colors.platform.web = {
		primary: '#2089dc',
		secondary: '#ca71eb',
		grey: '#393e42',
		searchBg: '#303337',
		success: '#52c41a',
		error: '#ff190c',
		warning: '#faad14'
	}
}
const theme = { colors }

const Drawer = createDrawerNavigator()

export default function App() {
	const chapters = map(textContent.chapters, (elem, key) => ({
		id: key,
		title: elem.title
	}))

	const [fontLoaded] = useFonts({
		Scheherazade_400Regular
	})
	return fontLoaded ? (
		<ThemeProvider theme={theme}>
			<NavigationContainer>
				<Drawer.Navigator
					initialRouteName='Home'
					drawerContent={props => (
						<DrawerContent {...props} chapters={chapters} />
					)}
				>
					<Drawer.Screen
						name='Home'
						component={HomeScreen}
						options={{
							headerLeft: () => <Icon.Button name='ios-menu' size={25} />
						}}
					/>
					<Drawer.Screen name='Contacts' component={ContactsScreen} />
					{chapters.map(elem => (
						<Drawer.Screen
							key={`lesson-${elem.id}`}
							name={elem.title}
							component={ChapterScreen}
							initialParams={{
								chapterId: elem.id,
								chapterDoc: textContent.chapters[elem.id]
							}}
						/>
					))}
				</Drawer.Navigator>
			</NavigationContainer>
		</ThemeProvider>
	) : (
		<AppLoading />
	)
}
