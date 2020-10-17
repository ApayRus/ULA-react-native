// import { StyleSheet } from 'react-native'

export default lang => {
    const fontFamilyByLang = lang => {
        if (lang === 'arabic') {
            return 'Scheherazade_400Regular'
        }
        return null
    }

    const directionByLang = lang => {
        const rtlLanguages = ['arabic', 'hebrew']
        if (rtlLanguages.includes(lang)) {
            return 'rtl'
        }
        return null
    }

    const writingDirection = directionByLang(lang)

    const fontFamily = fontFamilyByLang(lang)

    const fontSizeDelta = lang => {
        if (lang === 'arabic') {
            return 10
        }
        return 0
    }

    const styles = {
        body1: {
            fontFamily,
            fontSize: 24 + fontSizeDelta(lang)
        },
        body2: {
            fontFamily,
            fontSize: 18 + fontSizeDelta(lang)
        },
        body3: {
            fontFamily,
            fontSize: 14 + fontSizeDelta(lang)
        },
        writingDirection: {
            writingDirection
        }
    }

    return styles
}