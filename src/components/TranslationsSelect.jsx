import React from 'react'
import { Button, Text } from 'react-native-elements'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setTranslation } from '../store/translationActions'

export default function TranslationsSelect(props) {
	const { translations } = props
	const dispatch = useDispatch()

	const { trLang } = useSelector(state => state.translation)

	const handleTrLang = langCode => () => {
		const action = trLang === langCode ? { trLang: '' } : { trLang: langCode }
		dispatch(setTranslation(action))
	}

	return (
		<View>
			<Text>Available translations (choose one)</Text>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center'
				}}
			>
				{translations.map(elem => {
					return (
						<Button
							key={`trLang-${elem}`}
							type={trLang === elem ? 'solid' : 'outline'}
							buttonStyle={{ margin: 5 }}
							title={elem}
							onPress={handleTrLang(elem)}
						></Button>
					)
				})}
			</View>
		</View>
	)
}
