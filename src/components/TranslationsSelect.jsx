import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-elements'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { changeTrLang } from '../store/translationActions'

export default function TranslationsSelect(props) {
	const { translations } = props
	const dispatch = useDispatch()

	const { trLang } = useSelector(state => state.translation)

	const handleTrLang = langCode => () => {
		dispatch(changeTrLang({ trLang: langCode }))
		AsyncStorage.setItem('trLang', langCode)
	}

	return (
		<View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
			{translations.map(elem => {
				return (
					<Button
						key={`trLang-${elem}`}
						type={trLang === elem ? 'solid' : 'outline'}
						style={styles.trLangButton}
						title={elem}
						onPress={handleTrLang(elem)}
					></Button>
				)
			})}
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
