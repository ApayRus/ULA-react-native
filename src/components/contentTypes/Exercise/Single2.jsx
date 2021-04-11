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
		requiredLang: 'original',
		activityType: 'choose-from-4',
		count: '10'
	}

	const getTask1 = (givenType, givenLang = '') => {
		switch (`${givenType} | ${givenLang}`) {
			case 'audio | ':
				return 'Listen to the audio'
			case 'text | original':
				return 'Read the original text'
			case 'text | translation':
				return 'Read the translation text'
			default:
				return null
		}
	}

	const getTask2 = (givenType, requiredType, requiredLang, activityType) => {
		const activity = activityType === 'write' ? 'write' : 'choose'
		switch (
			`${givenType}-${givenLang} --> ${requiredType}-${requiredLang} ${activity}`
		) {
			case 'audio-original --> text-original write':
				return 'write what you have heard'
			case 'audio-original --> text-translation write':
				return 'write translation'
			case 'audio-original --> text-original choose':
				return 'choose the right variant'
			case 'audio-original --> text-translation choose':
				return 'choose the right translation'

			case 'text-original --> text-translation write':
				return 'write translation'
			case 'text-translation --> text-original write':
				return 'write original text'

			default:
				return null
		}
	}

	const getPlaceholderText = requiredLang => {
		switch (requiredLang) {
			case 'original':
				return 'original text'
			case 'translation':
				return 'translation text'
			default:
				return null
		}
	}

	const {
		activityType,
		givenLang,
		givenType,
		requiredLang,
		requiredType
	} = exerciseInfo

	const task1 = getTask1(givenType)
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
