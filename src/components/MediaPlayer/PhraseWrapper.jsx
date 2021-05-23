import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import MarkdownRenderer from '../MarkdownRenderer'
import styles from '../../utils/styles'

// const { richMedia: { phraseList: contentTypeStyle } = {} } = styles || {} // contentType styles
const contentTypeStyle = styles?.contentType?.richMedia?.phraseList || {}

/* 
<PhraseWrapper>
	<Voice /> 
	<Phrase /> 
</PhraseWrapper>
*/

const Voice = ({ voiceName, voiceNameTr, showTranslation }) => {
	return (
		<View style={contentTypeStyle.voiceContainer}>
			<Avatar {...contentTypeStyle.avatarProps} />
			<Text style={contentTypeStyle.voiceNameWrapper}>
				<Text style={contentTypeStyle.voiceName}>{voiceName}</Text>
				{voiceNameTr && showTranslation && (
					<Text style={contentTypeStyle.voiceNameTr}>({voiceNameTr})</Text>
				)}
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
	handlePlayPhrase
}) => {
	const isActivePhrase = phraseNum === currentPhraseNum

	// this is work around (i hope temporary code)
	// because selectable don't set without it
	const [selectable, setSelectable] = useState(false)
	useEffect(() => {
		setSelectable(true)
	}, [])

	return (
		<View
			style={[
				contentTypeStyle.phraseTextsWrapper,
				isActivePhrase
					? contentTypeStyle.phraseActiveContainer
					: contentTypeStyle.phraseDefaultContainer
			]}
		>
			{/* TEXT */}
			<Text {...{ selectable }} style={contentTypeStyle.phraseText}>
				<MarkdownRenderer markdownText={text} contentType='richText' />
			</Text>
			{/* TRANSLATION */}
			{showTranslation && (
				<Text {...{ selectable }} style={contentTypeStyle.phraseTextTr}>
					<MarkdownRenderer markdownText={trText} contentType='richText' />
				</Text>
			)}
			{/* NUMBER + PLAY small button */}
			<TouchableOpacity
				onPress={handlePlayPhrase(phraseNum)}
				style={contentTypeStyle.phraseNumContainer}
			>
				<Text style={contentTypeStyle.phraseNumText}>
					<Icon name='play-arrow' color='grey' size={9} />
					{phraseNum}
				</Text>
			</TouchableOpacity>
		</View>
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
			style={contentTypeStyle.phraseWrapperContainer}
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

export default PhraseWrapper
