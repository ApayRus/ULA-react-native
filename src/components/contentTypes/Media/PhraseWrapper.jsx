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
			style={
				isActivePhrase
					? contentTypeStyle.phraseActiveContainer
					: contentTypeStyle.phraseDefaultContainer
			}
		>
			<View style={contentTypeStyle.phraseTextsWrapper}>
				<Text style={contentTypeStyle.phraseText} selectable={true}>
					<MarkdownRenderer markdownText={text} contentType='text' />
				</Text>

				{/* <MarkdownRenderer markdownText={text} contentType='text' /> */}
				{showTranslation && (
					<Text style={contentTypeStyle.phraseTextTr} selectable={true}>
						<MarkdownRenderer markdownText={trText} contentType='text' />
					</Text>
				)}
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
