import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'
import { Image, Text, Button } from 'react-native-elements'
import TranslationsSelect from './TranslationsSelect'

export default function HomeScreen({ navigation, route }) {
	const {
		params: { info, translations, globalStyles }
	} = route
	const { title, author, description, language, level } = info || {}

	return (
		<>
			<StatusBar style='auto' />
			<View style={styles.container}>
				<Text style={globalStyles.body1}>{title}</Text>
				<Text style={globalStyles.body3}>{author}</Text>
				{/* <Text>{'\n'}</Text> */}
				<Image
					style={{ width: 200, height: 200 }}
					source={require('../../content/images/logo.png')}
				></Image>
				{/* <Text>{'\n'}</Text> */}
				<Text>{description}</Text>
				<Text style={styles.lineBreak}>{'\n'}</Text>
				<Text>language: {language}</Text>
				<Text>level: {level}</Text>
				<Text style={styles.lineBreak}>{'\n'}</Text>
				<Button
					onPress={() => navigation.toggleDrawer()}
					icon={{
						name: 'list',
						// size: 15,
						color: 'white'
					}}
					buttonStyle={styles.tableOfContentButton}
					title='Table of contents'
				/>
				<Text style={styles.lineBreak}>{'\n'}</Text>
				<Text>Available translations (choose one)</Text>
				<Text style={styles.lineBreak}>{'\n'}</Text>

				<TranslationsSelect translations={translations} />
				{/* <Text>{'\n'}</Text> */}
			</View>
		</>
	)
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	lineBreak: {
		fontSize: 8
	},
	tableOfContentButton: { paddingRight: 20 }
}
