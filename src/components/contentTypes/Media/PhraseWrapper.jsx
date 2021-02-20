import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Avatar, colors } from 'react-native-elements'
import globalStyles from '../../../config/globalStyles'

/* 
<PhraseWrapper>
	<Voice /> 
	<Phrase /> 
</PhraseWrapper>
*/

const Voice = ({ voiceName, voiceNameTr, showTranslation }) => {
	return (
		<View
			style={{
				// writingDirection: 'rtl',
				flexDirection: 'row-reverse',
				alignItems: 'center',
				marginTop: 15,
				marginBottom: 2
			}}
		>
			<Avatar
				rounded
				icon={{ name: 'perm-identity', color: 'grey', type: '' }}
				containerStyle={{
					backgroundColor: 'lightgrey',
					width: 20,
					height: 20,
					marginLeft: 5 // should be related to writing direction
				}}
				size='small'
			/>
			<Text style={{ color: 'gray' }}>
				{voiceName}
				{voiceNameTr && showTranslation ? ` (${voiceNameTr})` : ''}
			</Text>
		</View>
	)
}

const Phrase = ({
	text,
	trText,
	currentPhraseNum,
	phraseNum,
	showTranslation,
	trLang,
	handlePlayPhrase
}) => {
	const isActivePhrase = phraseNum === currentPhraseNum
	const phraseStyle = isActivePhrase
		? styles.phraseActive
		: styles.phraseDefault

	return (
		<TouchableOpacity
			onPress={handlePlayPhrase(phraseNum)}
			style={[phraseStyle, { marginBottom: 6 }]}
		>
			<View style={{ paddingLeft: 2, paddingRight: 7 }}>
				<Text style={globalStyles.body2}>{text}</Text>
				{showTranslation && (
					<Text
						style={[globalStyles.translation(trLang), { paddingBottom: 4 }]}
					>
						{trText}
					</Text>
				)}
				<View style={{ position: 'absolute', left: 2, bottom: 2 }}>
					<Text style={{ color: 'grey', fontSize: 10 }}>{phraseNum}</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const PhraseWrapper = props => {
	const {
		/* voice:  */
		voiceName,
		voiceNameTr,
		/* phrase: */
		text,
		trText,
		currentPhraseNum,
		phraseNum,
		showTranslation,
		onPhraseLayout,
		handlePlayPhrase
	} = props

	return (
		<View
			style={{ paddingLeft: 3, paddingRight: 3 }}
			onLayout={onPhraseLayout(phraseNum)}
		>
			{voiceName && <Voice voiceName={voiceName} voiceNameTr={voiceNameTr} />}
			<Phrase
				{...{
					text,
					trText,
					currentPhraseNum,
					phraseNum,
					showTranslation,
					handlePlayPhrase
				}}
			/>
		</View>
	)
}

const border = color => ({
	borderColor: color,
	borderStyle: 'solid',
	borderRadius: 5,
	borderWidth: 1
})

const styles = {
	phraseActive: { ...border(colors.primary) },
	phraseDefault: { ...border('rgb(242,242,242)') }
}

export default PhraseWrapper
