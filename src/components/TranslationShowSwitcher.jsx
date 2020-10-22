import React from 'react'
import { Text } from 'react-native-elements'
import { View, Switch } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { setTranslation } from '../store/translationActions'

export default function TranslationOnOffSwitcher() {
	const { trLang, show } = useSelector(state => state.translation)
	const dispatch = useDispatch()
	const toggleSwitch = () => {
		dispatch(setTranslation({ show: !show }))
	}

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				flexWrap: 'wrap',
				justifyContent: 'flex-end',
				alignContent: 'flex-end'
			}}
		>
			<Text>translation ({trLang}): </Text>
			<Switch
				// style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
				onValueChange={toggleSwitch}
				value={show}
			/>
		</View>
	)
}
