// import { StyleSheet } from 'react-native'
import { colors } from 'react-native-elements'

export default lang => {
    const fontFamilyByLang = lang => {
        if (lang === 'ar') {
            return 'Scheherazade_400Regular'
        }
        return null
    }

    const directionByLang = lang => {
        const rtlLanguages = ['ar', 'he']
        if (rtlLanguages.includes(lang)) {
            return 'rtl'
        }
        return null
    }

    const alignByLang = lang => {
        const rtlLanguages = ['ar', 'he']
        if (rtlLanguages.includes(lang)) {
            return { alignItems: 'flex-end' }
        }
        return { alignItems: 'flex-start' }
    }

    const writingDirection = directionByLang(lang)
    const fontFamily = fontFamilyByLang(lang)
    const align = alignByLang(lang)

    const fontSizeDelta = lang => {
        if (lang === 'ar') {
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
        },
        translation: {
            fontSize: 14,
            color: colors.grey2
        },
        align: {
            ...align
        },
        subchapter: {
            backgroundColor: colors.primary,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 10,
            fontSize: 20,
            color: 'white'
        },
        chapterHeader: {
            color: colors.primary,
            display: 'flex',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 10
        }
    }

    return styles
}