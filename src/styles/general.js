import { merge } from 'lodash'
import customStyles from '../../content/styles/general'

const {
	basicAlignItems: customAlignItems,
	basicWritingDirection: customWritingDirection,
	basicFontFamily: customFontFamily,
	basicFontSize: customFontSize
} = customStyles || {}

const basicAlignItems = customAlignItems || 'flex-start' // 'flex-end' for arabic, hebrew, etc
const basicWritingDirection = customWritingDirection || 'ltr' // 'rtl' for arabic, hebrew, etc
const basicFontFamily = customFontFamily || 'Inter-Variable' // ScheherazadeNew for arabic (for example)
const basicFontSize = customFontSize || 14

const defaultFontSetup = fontSizeDelta => ({
	writingDirection: basicWritingDirection,
	fontFamily: basicFontFamily,
	fontSize: basicFontSize + fontSizeDelta
})

/**
 a default text style after calculation looks like: 
 {
	 writingDirection: 'ltr', 
	 fontFamily: 'Inter-Variable', 
	 fontsSize: 14
 }
 Use template above to change it to your custom style in /content/styles folder 
 */

const defaultStyles = {
	h3: defaultFontSetup(10),
	h4: defaultFontSetup(8),
	h5: defaultFontSetup(6),
	body1: defaultFontSetup(4),
	body2: defaultFontSetup(2),
	body3: defaultFontSetup(0),
	translation: {
		default: { ...defaultFontSetup(0), color: 'grey' } // default means lang is not set (ru, en, ar, etc)
	},
	basicAlignItems,
	basicFontFamily,
	basicWritingDirection,
	colors: {
		primary: 'rgb(32, 137, 220)',
		grey1: 'grey',
		grey2: 'grey',
		grey3: 'grey'
	}
}

export default merge(defaultStyles, customStyles)
