import React from 'react'
import AppLoading from 'expo-app-loading'
import { useFonts } from 'expo-font'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'react-native-elements'
import store from './src/store/rootReducer'
import RootNavigation from './src/components/RootNavigation'
import content from './src/utils/content'

export default function App() {
	const fonts = content.getFonts()
	const [fontLoaded] = useFonts(fonts)

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
