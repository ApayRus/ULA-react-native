/**
 * You can use custom fonts (otf, ttf) in your app.
 * Why? Read here some theoretical aspects: https://docs.expo.io/guides/using-custom-fonts/
 * Just add them into /content/fonts folder.
 * After `npm run generate-assets` they will be displayed in your app.
 * Here in styles just set {fontFamily: fontFileName} (without extension)
 */

// import { StyleSheet } from 'react-native'
import { colors } from 'react-native-elements'

class Styles {
	constructor() {}
	// general global settings
	// related to lang of content, witch you know before running the app
	writingDirection = {
		writingDirection: 'ltr' // 'rtl' for arabic, hebrew, etc
	}
	align = {
		alignItems: 'flex-start' // 'flex-end' for arabic, hebrew, etc
	}
	fontFamily = {
		fontFamily: 'Inter-Variable' // ScheherezadeNew for arabic (for example)
	}

	// styles
	body3 = {
		//fontFamily - specify if you want to change default,
		fontSize: 16,
		...this.fontFamily,
		...this.writingDirection
	}
	body2 = {
		fontSize: 18,
		...this.fontFamily,
		...this.writingDirection
	}
	body1 = {
		fontSize: 20,
		...this.fontFamily,
		...this.writingDirection
	}

	h5 = {
		fontSize: 22,
		...this.fontFamily,
		...this.writingDirection,
		fontWeight: 'bold',
		marginBottom: 8,
		marginTop: 12
	}
	h4 = {
		fontSize: 24,
		...this.fontFamily,
		...this.writingDirection,
		fontWeight: 'bold',
		marginBottom: 6,
		marginTop: 10
	}
	h3 = {
		fontSize: 26,
		...this.fontFamily,
		...this.writingDirection,
		fontWeight: 'bold',
		marginBottom: 4,
		marginTop: 8
	}
	subchapter = {
		backgroundColor: colors.primary,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 5,
		paddingBottom: 5,
		borderRadius: 10,
		fontSize: 20,
		color: 'white'
	}
	chapterHeader = {
		color: colors.primary,
		display: 'flex',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 10
	}

	// translations are related to lang, because user can switch between them
	// so you can specify style for each lang
	translation(lang) {
		const defaultStyle = {
			...this.fontFamily,
			color: colors.grey2,
			writingDirection: 'ltr'
			// textAlign: 'right' // for arabic
		}
		const langStyles = {
			ru: {
				...defaultStyle,
				color: colors.grey3
			}
		}
		return langStyles?.[lang] || defaultStyle
	}
}

const styles = new Styles()

export default styles
