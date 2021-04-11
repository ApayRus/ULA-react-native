/* 
first task call to action: 
						"read the text"  
						"listen to the audio"
first task source material: 
						playAudioButton 
						readTextButton

second task call to action: 
						"choose the right variant" 
						"write the text"  
						"write the translation"
second task user input: 
						TextInput 
						VariantButtons
check the answer button 

show progress (position of this exercise in general count)

redirect to the next exercise
*/

import React from 'react'
import { View } from 'react-native'
import { Button, Text, Input } from 'react-native-elements'

const Single2 = () => {
	const exerciseInfo = {
		givenType: 'audio',
		givenLang: 'original',
		requiredType: 'text',
		requiredLang: 'translation',
		activityType: 'write',
		count: '10'
	}

	const getTask1 = (givenType, givenLang = '') => {
		const mapOfTaskTexts = {
			'audio-original': 'Listen to the audio',
			'text-original': 'Read the original text',
			'text-translation': 'Read the translation text'
		}
		const task = `${givenType}-${givenLang}`
		return mapOfTaskTexts?.[task]
	}

	const getTask2 = (givenType, requiredType, requiredLang, activityType) => {
		const activity = activityType === 'write' ? 'write' : 'choose'
		const mapOfTaskTexts = {
			'audio-original --> text-original write': 'write what you have heard',
			'audio-original --> text-translation write': 'write translation',
			'audio-original --> text-original choose': 'choose the right variant',
			'audio-original --> text-translation choose':
				'choose the right translation',
			'text-original --> text-translation write': 'write translation',
			'text-translation --> text-original write': 'write original text'
		}
		const task = `${givenType}-${givenLang} --> ${requiredType}-${requiredLang} ${activity}`
		return mapOfTaskTexts?.[task]
	}

	const getPlaceholderText = requiredLang => {
		const mapOfTexts = {
			original: 'original text',
			translation: 'translation text'
		}
		return mapOfTexts?.[requiredLang]
	}

	const {
		activityType,
		givenLang,
		givenType,
		requiredLang,
		requiredType
	} = exerciseInfo

	const task1 = getTask1(givenType, givenLang)
	const task2 = getTask2(givenType, requiredType, requiredLang, activityType)
	const taskText = `${task1}, and ${task2}`
	const placeholderText = getPlaceholderText(requiredLang)

	const TextInput = () => (
		<Input
			inputStyle={{ textAlign: 'center' }}
			containerStyle={{ alignSelf: 'center' }}
			placeholder={placeholderText} // translation of the word
		/>
	)

	const ChooseFromVariants = () => (
		<View style={{ width: 100, height: 100, backgroundColor: 'skyblue' }} />
	)

	const userInput =
		activityType === 'write' ? <TextInput /> : <ChooseFromVariants />

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<View style={styles.exerciseInstructionContainer}>
				<Text>{taskText}</Text>
			</View>
			<Button icon={{ name: 'play-arrow', color: 'white' }} />
			<View style={styles.inputContainer}>{userInput}</View>
			<Button title='Check the answer' />
		</View>
	)
}

const styles = {
	exerciseInstructionContainer: {
		margin: 20
	},
	inputContainer: {
		margin: 20,
		width: '100%'
	}
}

export default Single2
