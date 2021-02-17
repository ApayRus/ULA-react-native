import React from 'react'
import AppLoading from 'expo-app-loading'
import { useFonts } from 'expo-font'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'react-native-elements'
import store from './src/store/rootReducer'
import RootNavigation from './src/navigation/RootNavigation'
import content from './src/utils/content'
//for react-native-render-html , fix an error:
import { Image } from 'react-native'
if (!Image.getSizeWithHeaders) {
	Image.getSizeWithHeaders = function (uri, headers, onsuccess, onerror) {
		return Image.getSize(uri, onsuccess, onerror)
	}
}

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
