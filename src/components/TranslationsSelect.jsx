import React, { useEffect, useState } from 'react'
import { Button, colors } from 'react-native-elements'
import { View, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

export default function TranslationsSelect({ translations }) {
	const [trLang, setTrLang] = useState()

	useEffect(() => {
		const readTrLangAsync = async () => {
			const storageTrLang = await AsyncStorage.getItem('trLang')
			setTrLang(storageTrLang)
		}
		readTrLangAsync()
	}, [])

	const changeTrLang = langCode => () => {
		AsyncStorage.setItem('trLang', langCode)
		setTrLang(langCode)
	}

	return (
		<View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
			{translations.map(elem => (
				<Button
					key={`trLang-${elem}`}
					type={trLang === elem ? 'solid' : 'outline'}
					style={styles.trLangButton}
					title={elem}
					onPress={changeTrLang(elem)}
				></Button>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	trLangButton: {
		flex: 1,
		alignItems: 'center',
		marginLeft: 10
	}
})
