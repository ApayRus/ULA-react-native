import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View, Image } from 'react-native'
import { Text, Button } from 'react-native-elements'
import TranslationsSelect from '../TranslationsSelect'
import content from '../../utils/content'
import globalStyles from '../../config/globalStyles'

export default function HomeScreen({ navigation, route }) {
	const {
		params: { info, translations }
	} = route
	const { title, author } = info || {}

	return (
		<>
			<StatusBar style='auto' />
			<View style={styles.container}>
				<Text style={globalStyles.body1}>{title}</Text>
				<Text style={globalStyles.body3}>{author}</Text>
				<Image
					style={{ width: 200, height: 200 }}
					source={content.getFilesByPathString('images/logo')?.file}
				></Image>
				{Object.keys(info)
					.filter(key => key !== 'title' && key !== 'author')
					.map(key => (
						<View key={`info-${key}`}>
							<Text>
								{key}: {info[key]}
							</Text>
						</View>
					))}
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

				{translations.length > 0 && (
					<TranslationsSelect translations={translations} />
				)}
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
	tableOfContentButton: { paddingRight: 20, margin: 20 }
}
