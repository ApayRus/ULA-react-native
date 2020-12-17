import React from 'react'

import { ThemeProvider, colors } from 'react-native-elements'

import AppLoading from 'expo-app-loading'
import {
	useFonts,
	Scheherazade_400Regular
} from '@expo-google-fonts/scheherazade'
import { Provider as ReduxProvider } from 'react-redux'
import store from './src/store/rootReducer'
import RootNavigation from './src/navigation/RootNavigation'

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
const theme = {
	colors
}

export default function App() {
	const [fontLoaded] = useFonts({ Scheherazade_400Regular })

	return fontLoaded ? (
		<ReduxProvider store={store}>
			<ThemeProvider theme={theme}>
				<RootNavigation />
			</ThemeProvider>
		</ReduxProvider>
	) : (
		<AppLoading />
	)
}
