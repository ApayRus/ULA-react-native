import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import contentTypeStyles from '../../../config/styles/contentType'
import MarkdownRenderer from '../../MarkdownRenderer'

const {
	media: { phraseList: contentTypeStyle }
} = contentTypeStyles

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
			<Text selectable={true} style={contentTypeStyle.phraseText}>
				<MarkdownRenderer markdownText={text} contentType='text' />
			</Text>
			{/* TRANSLATION */}
			{showTranslation && (
				<Text selectable={true} style={contentTypeStyle.phraseTextTr}>
					<MarkdownRenderer markdownText={trText} contentType='text' />
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
