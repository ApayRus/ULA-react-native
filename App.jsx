import React from 'react'
import AppLoading from 'expo-app-loading'
import {
	useFonts,
	Scheherazade_400Regular
} from '@expo-google-fonts/scheherazade'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'react-native-elements'
import store from './src/store/rootReducer'
import RootNavigation from './src/navigation/RootNavigation'

export default function App() {
	const [fontLoaded] = useFonts({ Scheherazade_400Regular })

	return fontLoaded ? (
		<ReduxProvider store={store}>
			<ThemeProvider>
				<RootNavigation />
			</ThemeProvider>
		</ReduxProvider>
	) : (
		<AppLoading />
	)
}
