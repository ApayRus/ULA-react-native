import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'
import { Image, Text, Button } from 'react-native-elements'
import TranslationsSelect from './TranslationsSelect'
import { useSelector } from 'react-redux'

export default function HomeScreen({ navigation, route }) {
	const {
		params: { info, translations, globalStyles }
	} = route
	const { title, author, description } = info || {}
	delete info.title
	delete info.author
	delete info.description
	delete info.website
	const infoArray = Object.entries(info)

	const { trLang } = useSelector(state => state.translation)

	return (
		<>
			<StatusBar style='auto' />
			<View style={styles.container}>
				<Text>trLang: {trLang}</Text>
				<Text style={globalStyles.body1}>{title}</Text>
				<Text style={globalStyles.body3}>{author}</Text>
				<Text>{'\n'}</Text>
				<Image
					style={{ width: 200, height: 200 }}
					source={require('../../content/images/logo.png')}
				></Image>
				<Text>{'\n'}</Text>
				<Text>{description}</Text>
				<Text>{'\n'}</Text>
				{infoArray &&
					infoArray.map(elem => {
						const [key, value] = elem
						return <Text key={`info-${key}`}>{`${key}: ${value}`}</Text>
					})}
				<Text>{'\n'}</Text>
				<Text>{'\n'}</Text>
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
				<Text>{'\n'}</Text>
				<Text>Available translations (choose one)</Text>
				<Text>{'\n'}</Text>

				<TranslationsSelect translations={translations} />
				<Text>{'\n'}</Text>
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
	tableOfContentButton: { paddingRight: 20 }
}
